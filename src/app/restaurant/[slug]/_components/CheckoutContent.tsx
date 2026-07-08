"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useRestaurantCartStore } from "@/store/useRestaurantCartStore";

interface CheckoutContentProps {
  restaurantSlug: string;
}

const CheckoutContent = ({ restaurantSlug }: CheckoutContentProps) => {
  const router = useRouter();
  
  // Cart store integration
  const [mounted, setMounted] = useState(false);
  const carts = useRestaurantCartStore((state) => state.carts);
  const clearCart = useRestaurantCartStore((state) => state.clearCart);

  // Authentication & Member state
  const [member, setMember] = useState<any>(null);
  const [loadingMember, setLoadingMember] = useState(true);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loadingRestaurant, setLoadingRestaurant] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cart = carts[restaurantSlug] || [];

  // Form states
  const [serveLocation, setServeLocation] = useState<"restaurant" | "room">("restaurant");
  const [roomNumber, setRoomNumber] = useState("");
  const [note, setNote] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Order Placement & OTP verification states
  const [placing, setPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [otp, setOtp] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const finalTotal = Math.max(0, subtotal - couponDiscount);

  // Fetch Member Profile
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await axiosInstance.get("/api/member/v1/portal/me/");
        if (res.status === 200 && res.data?.data?.member_info) {
          setMember(res.data.data.member_info);
        } else {
          toast.error("You are not signed in yet. Please log in to place an order.");
        }
      } catch (err) {
        toast.error("You are not signed in yet. Please log in to place an order.");
      } finally {
        setLoadingMember(false);
      }
    };
    fetchMember();
  }, []);

  // Fetch Restaurant Details
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await axiosInstance.get(`/api/restaurants/v1/public/by-slug/${restaurantSlug}/menu/`);
        if (res.status === 200 && res.data?.data?.restaurant) {
          setRestaurant(res.data.data.restaurant);
        }
      } catch (err) {
        console.error("Error fetching restaurant details:", err);
      } finally {
        setLoadingRestaurant(false);
      }
    };
    fetchRestaurant();
  }, [restaurantSlug]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) {
      toast.error("You are not signed in yet");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!restaurant) {
      toast.error("Restaurant details not found");
      return;
    }
    if (serveLocation === "room" && !roomNumber.trim()) {
      toast.error("Please enter your room number");
      return;
    }

    setPlacing(true);
    try {
      const payload = {
        restaurant_id: restaurant.id,
        serve_location: serveLocation,
        room_number: serveLocation === "room" ? roomNumber.trim() : "",
        note: note,
        require_otp: true,
        items: cart.map((item) => ({
          item_id: item.item_id,
          quantity: item.quantity,
        })),
      };

      const res = await axiosInstance.post("/api/restaurants/v1/restaurants/orders/", payload);
      if (res.status === 201 && res.data?.data) {
        setPlacedOrder(res.data.data);
        toast.success("Order placed! An OTP verification code has been sent.");
      } else {
        toast.error(res.data?.message || "Failed to place order");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placedOrder) return;
    if (!otp.trim()) {
      toast.error("Please enter the OTP verification code");
      return;
    }

    setVerifyingOtp(true);
    try {
      const res = await axiosInstance.post(
        `/api/restaurants/v1/restaurants/orders/${placedOrder.id}/verify-otp/`,
        { otp_code: otp.trim() }
      );
      if (res.status === 200 || res.status === 201) {
        toast.success("Order confirmed successfully! It is now being prepared.");
        clearCart(restaurantSlug);
        router.push(`/restaurant/${restaurantSlug}/menu`);
      } else {
        toast.error(res.data?.message || "Invalid OTP code");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid OTP code");
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleApplyCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.warning("Please enter a coupon code");
      return;
    }
    // Simple mock coupon logic
    if (couponCode.toUpperCase() === "WELCOME10") {
      setCouponDiscount(10);
      toast.success("Coupon code WELCOME10 applied! $10.00 discount granted.");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  if (!mounted || loadingMember || loadingRestaurant) {
    return (
      <div className="checkout-area default-padding text-center">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 py-5">
              <i className="fas fa-spinner fa-spin fa-3x" style={{ color: "var(--color-primary)" }}></i>
              <p className="mt-3">Loading checkout details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="checkout-area default-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 text-center py-5" style={{ backgroundColor: "var(--white)", borderRadius: "8px", border: "1px solid var(--color-primary)" }}>
              <i className="fas fa-exclamation-circle fa-4x mb-3" style={{ color: "var(--color-primary)" }}></i>
              <h2>Authentication Required</h2>
              <p className="text-muted">You must be logged in as a registered club member to place food orders.</p>
              <button
                className="btn btn-theme secondary mt-3"
                onClick={() => router.push("/login")}
              >
                Sign In Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-area default-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 text-center py-5" style={{ backgroundColor: "var(--white)", borderRadius: "8px", border: "1px solid var(--color-primary)" }}>
              <i className="fas fa-shopping-basket fa-4x mb-3" style={{ color: "var(--color-primary)" }}></i>
              <h2>Your Cart is Empty</h2>
              <p className="text-muted">Browse our menu items and add dishes to your cart to check out.</p>
              <button
                className="btn btn-theme secondary mt-3"
                onClick={() => router.push(`/restaurant/${restaurantSlug}/menu`)}
              >
                View Restaurant Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-area default-padding">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="checkout-form">
              <div className="row">
                
                 {/* Left side: Order summary & Notes */}
                <div className="col-lg-6">
                  <div className="shop-cart-totals" style={{ padding: "30px", backgroundColor: "var(--white)", borderRadius: "8px", border: "1px solid var(--color-primary)" }}>
                    <h3 className="mb-4" style={{ color: "var(--color-heading)" }}>Your Order</h3>
                    <div className="table-responsive">
                      <table className="table" style={{ color: "var(--color-heading)", borderColor: "rgba(0,0,0,0.1)" }}>
                        <thead>
                          <tr style={{ borderColor: "rgba(0,0,0,0.1)" }}>
                            <th scope="col" style={{ color: "var(--color-primary)" }}>Product</th>
                            <th scope="col" className="text-end" style={{ color: "var(--color-primary)" }}>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.map((item) => (
                            <tr key={`${item.item_id}-${item.portion}`} style={{ borderColor: "#2c2c2c" }}>
                              <td style={{ verticalAlign: "middle" }}>
                                <span className="font-weight-bold">{item.name}</span>
                                <span
                                  className="badge ms-2"
                                  style={{
                                    backgroundColor: item.portion === "half" ? "var(--color-primary)" : "#333333",
                                    color: "var(--white)",
                                    fontSize: "10px",
                                    fontWeight: "800"
                                  }}
                                >
                                  {item.portion === "half" ? "Half" : "Full"}
                                </span>
                                <span className="text-muted block text-xs mt-1 d-block">
                                  Qty: {item.quantity}
                                </span>
                              </td>
                              <td className="text-end" style={{ verticalAlign: "middle" }}>
                                ${(item.price * item.quantity).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                          <tr style={{ borderColor: "#444444", fontWeight: "bold" }}>
                            <td>Cart Subtotal</td>
                            <td className="text-end">${subtotal.toFixed(2)}</td>
                          </tr>
                          {couponDiscount > 0 && (
                            <tr style={{ borderColor: "#2c2c2c", color: "#28a745" }}>
                              <td>Coupon Discount</td>
                              <td className="text-end">-${couponDiscount.toFixed(2)}</td>
                            </tr>
                          )}
                          <tr style={{ borderColor: "var(--color-primary)", fontWeight: "bold", fontSize: "1.2rem" }}>
                            <td style={{ color: "var(--color-primary)" }}>Total Bill</td>
                            <td className="text-end" style={{ color: "var(--color-primary)" }}>${finalTotal.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3>Order notes (optional)</h3>
                    <div className="form-group comments">
                      <textarea
                        className="form-control"
                        id="comments"
                        name="comments"
                        placeholder="Notes about your order, e.g. special notes for delivery."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        autoComplete="off"
                        style={{
                          minHeight: "100px",
                          maxHeight: "150px",
                          border: "2px solid rgba(0,0,0,0.1)",
                          transition: "border-color 0.3s ease",
                          borderRadius: "8px"
                        }}
                        onFocus={(e) => e.target.style.border = "2px solid var(--color-primary)"}
                        onBlur={(e) => e.target.style.border = "2px solid rgba(0,0,0,0.1)"}
                      />
                    </div>
                  </div>
                </div>

                {/* Right side: Serve location, Room, Coupon & Place Order OR OTP */}
                <div className="col-lg-6 mt-5 mt-lg-0">
                  {!placedOrder ? (
                    <div
                      className="card-order-config p-4"
                      style={{
                        backgroundColor: "var(--white)",
                        borderRadius: "8px",
                        border: "1px solid var(--color-primary)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
                      }}
                    >
                      <h3 className="mb-4" style={{ borderBottom: "2px solid var(--color-primary)", paddingBottom: "10px" }}>
                        Delivery & Serve Settings
                      </h3>
                      
                      <form onSubmit={handlePlaceOrder}>
                        {/* Serve Location */}
                        <div className="form-group mb-4">
                          <label className="mb-2 font-weight-bold d-block">Serve Location</label>
                          <div className="d-flex gap-3">
                            <label
                              className="flex-fill p-3 text-center border rounded cursor-pointer transition-all"
                              style={{
                                backgroundColor: serveLocation === "restaurant" ? "var(--color-primary)" : "var(--dark-secondary)",
                                color: "var(--white)",
                                borderColor: serveLocation === "restaurant" ? "var(--color-primary)" : "#333333",
                                fontWeight: "bold"
                              }}
                            >
                              <input
                                type="radio"
                                name="serveLocation"
                                value="restaurant"
                                checked={serveLocation === "restaurant"}
                                onChange={() => setServeLocation("restaurant")}
                                className="d-none"
                              />
                              <i className="fas fa-utensils me-2"></i>
                              Restaurant Table
                            </label>
                            <label
                              className="flex-fill p-3 text-center border rounded cursor-pointer transition-all"
                              style={{
                                backgroundColor: serveLocation === "room" ? "var(--color-primary)" : "var(--dark-secondary)",
                                color: "var(--white)",
                                borderColor: serveLocation === "room" ? "var(--color-primary)" : "#333333",
                                fontWeight: "bold"
                              }}
                            >
                              <input
                                type="radio"
                                name="serveLocation"
                                value="room"
                                checked={serveLocation === "room"}
                                onChange={() => setServeLocation("room")}
                                className="d-none"
                              />
                              <i className="fas fa-door-open me-2"></i>
                              Room Service
                            </label>
                          </div>
                        </div>

                        {/* Room Number Input */}
                        {serveLocation === "room" && (
                          <div className="form-group mb-4 animate__animated animate__fadeIn">
                            <label htmlFor="roomNumber" className="mb-2">Room / Suite Number *</label>
                            <input
                              className="form-control"
                              id="roomNumber"
                              name="roomNumber"
                              type="text"
                              placeholder="e.g. 302, Suite B"
                              value={roomNumber}
                              onChange={(e) => setRoomNumber(e.target.value)}
                              required
                            />
                          </div>
                        )}

                        {/* Coupon Code */}
                        <div className="form-group mb-4">
                          <label htmlFor="coupon" className="mb-2">Have a coupon code?</label>
                          <div className="input-group">
                            <input
                              className="form-control"
                              id="coupon"
                              name="coupon"
                              type="text"
                              placeholder="e.g. WELCOME10"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                            />
                            <button
                              type="button"
                              className="btn btn-theme secondary btn-sm px-3"
                              onClick={handleApplyCoupon}
                            >
                              Apply
                            </button>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="mt-5">
                          <button
                            type="submit"
                            className="btn btn-theme secondary w-100 py-3"
                            disabled={placing}
                          >
                            {placing ? (
                              <>
                                <i className="fas fa-spinner fa-spin me-2"></i>
                                Placing Order...
                              </>
                            ) : (
                              "Place Order"
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div
                      className="card-order-otp p-4 text-center"
                      style={{
                        backgroundColor: "var(--white)",
                        borderRadius: "8px",
                        border: "2px dashed var(--color-primary)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
                      }}
                    >
                      <div 
                        className="icon-box mb-4 mx-auto" 
                        style={{ 
                          width: "80px", 
                          height: "80px", 
                          borderRadius: "50%", 
                          backgroundColor: "var(--color-primary)", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                        }}
                      >
                        <i className="fas fa-envelope-open-text fa-3x" style={{ color: "var(--white)" }}></i>
                      </div>
                      <h3 className="mb-2">Confirm Your Order</h3>
                      <p className="text-muted mb-4">
                        We sent a 6-digit one-time code to your registered email / device. Please enter the OTP below to verify and send your order to the kitchen.
                      </p>

                      <form onSubmit={handleVerifyOtp}>
                        <div className="form-group mb-5" style={{ position: "relative" }}>
                          <div className="d-flex gap-2 justify-content-center" style={{ pointerEvents: "none" }}>
                            {otp.padEnd(6, " ").split("").map((char, i) => (
                              <div key={i} style={{ 
                                width: "50px", 
                                height: "60px", 
                                border: (otp.length === i || (otp.length === 6 && i === 5)) ? "2px solid var(--color-primary)" : "2px solid rgba(0,0,0,0.1)", 
                                borderRadius: "8px", 
                                display: "flex", 
                                alignItems: "center", 
                                justifyContent: "center", 
                                fontSize: "24px", 
                                fontWeight: "bold", 
                                backgroundColor: "var(--white)",
                                color: "var(--color-heading)",
                                boxShadow: "inset 0 2px 5px rgba(0,0,0,0.02)",
                                transition: "all 0.2s ease"
                              }}>
                                {char.trim()}
                              </div>
                            ))}
                          </div>
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                            maxLength={6}
                            required
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              opacity: 0,
                              cursor: "text",
                              outline: "none",
                              color: "transparent",
                              background: "transparent"
                            }}
                          />
                        </div>

                        <div className="d-flex gap-3">
                          <button
                            type="button"
                            className="btn btn-theme secondary flex-fill py-3"
                            onClick={() => setPlacedOrder(null)}
                            style={{ fontSize: "16px", fontWeight: "600", borderRadius: "8px" }}
                          >
                            Go Back
                          </button>
                          
                          <button
                            type="submit"
                            className="btn btn-theme flex-fill py-3"
                            disabled={verifyingOtp}
                            style={{ fontSize: "16px", fontWeight: "600", borderRadius: "8px" }}
                          >
                            {verifyingOtp ? (
                              <>
                                <i className="fas fa-spinner fa-spin me-2"></i>
                                Verifying...
                              </>
                            ) : (
                              "Verify & Confirm"
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutContent;
