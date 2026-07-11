"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import axiosInstance from "@/lib/axiosInstance";
import { getMediaUrl } from "@/lib/utils";
import { useRestaurantCartStore } from "@/store/useRestaurantCartStore";

interface CartSideSheetProps {
  restaurantSlug: string;
}

export default function CartSideSheet({ restaurantSlug }: CartSideSheetProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);
  const [mounted, setMounted] = useState(false);

  const carts = useRestaurantCartStore((state) => state.carts);
  const updateQuantity = useRestaurantCartStore(
    (state) => state.updateQuantity,
  );
  const removeItem = useRestaurantCartStore((state) => state.removeItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cart = carts[restaurantSlug] || [];

  // Hide floating cart on checkout page
  const isCheckoutPage = pathname.endsWith("/checkout");

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    if (checkingAuth) return;
    setCheckingAuth(true);
    try {
      const res = await axiosInstance.get("/api/member/v1/portal/me/");
      if (res.status === 200) {
        setIsOpen(false);
        router.push(`/restaurant/${restaurantSlug}/checkout`);
      } else {
        setIsOpen(false);
        router.push(`/restaurant/${restaurantSlug}/checkout`);
      }
    } catch (err) {
      setIsOpen(false);
        router.push(`/restaurant/${restaurantSlug}/checkout`);
    } finally {
      setCheckingAuth(false);
    }
  };

  if (!mounted) return null;
  if (isCheckoutPage) return null;

  return (
    <>
      <style>{`
        /* ── Dark mode overrides ── */
        body.bg-dark .cart-sheet {
          background-color: #2b2b2b;
          color: #e8e8e8;
        }
        body.bg-dark .cart-sheet-header {
          border-bottom-color: rgba(255,255,255,0.08);
        }
        body.bg-dark .cart-sheet-close-btn {
          color: #e8e8e8;
        }
        body.bg-dark .cart-item-row {
          border-bottom-color: rgba(255,255,255,0.07);
        }
        body.bg-dark .cart-item-img {
          background-color: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.1);
        }
        body.bg-dark .cart-item-title {
          color: #e8e8e8;
        }
        body.bg-dark .cart-item-price {
          color: #aaaaaa;
        }
        body.bg-dark .cart-item-portion-badge.full {
          background-color: rgba(255,255,255,0.1);
          color: #cccccc;
        }
        body.bg-dark .qty-adjust-btn {
          background-color: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.15);
          color: #e8e8e8;
        }
        body.bg-dark .cart-sheet-footer {
          background-color: rgba(0,0,0,0.25);
          border-top-color: rgba(255,255,255,0.08);
        }
        body.bg-dark .cart-checkout-btn:hover {
          background-color: #1a1a1a;
          border-color: var(--color-primary);
          color: var(--white);
        }
        body.bg-dark .empty-cart-text {
          color: #888888;
        }

        /* ── Original light-mode styles ── */
        .floating-cart-btn {
          position: fixed;
          bottom: 50px;
          right: 30px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: var(--color-primary);
          border: 2px solid var(--color-primary);
          box-shadow: 0 8px 30px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          cursor: pointer;
          transition: all 0.3s ease;
          color: var(--white);
        }
        .floating-cart-btn:hover {
          background-color: var(--dark);
          color: var(--white);
          border-color: var(--dark);
        }
        .floating-cart-btn i {
          font-size: 18px;
        }
        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background-color: var(--white);
          color: var(--dark);
          font-size: 10px;
          font-weight: 800;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--color-primary);
        }
        .cart-sheet-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0,0,0,0.6);
          z-index: 10000;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.4s ease;
        }
        .cart-sheet-overlay.active {
          opacity: 1;
          pointer-events: auto;
        }
        .cart-sheet {
          position: fixed;
          top: 0;
          right: -450px;
          width: 420px;
          max-width: 100vw;
          height: 100vh;
          background-color: var(--white);
          color: var(--color-heading);
          z-index: 10001;
          box-shadow: -10px 0 30px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          transition: right 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .cart-sheet.active {
          right: 0;
        }
        .cart-sheet-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }
        .cart-sheet-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: var(--color-primary);
          margin: 0;
        }
        .cart-sheet-close-btn {
          background: none;
          border: none;
          color: var(--color-heading);
          font-size: 18px;
          cursor: pointer;
          transition: all 0.2s;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        .cart-sheet-close-btn:hover {
          background-color: var(--color-primary);
          color: var(--white);
        }
        .cart-sheet-body {
          flex-grow: 1;
          overflow-y: auto;
          padding: 20px;
        }
        .cart-item-row {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(0,0,0,0.07);
          align-items: center;
        }
        .cart-item-img {
          position: relative;
          width: 60px;
          height: 60px;
          border-radius: 6px;
          overflow: hidden;
          background-color: rgba(0,0,0,0.04);
          border: 1px solid rgba(0,0,0,0.1);
        }
        .cart-item-info {
          flex-grow: 1;
        }
        .cart-item-title {
          font-size: 14px;
          font-weight: 700;
          margin: 0 0 4px 0;
          color: var(--color-heading);
          line-height: 1.3;
        }
        .cart-item-portion-badge {
          font-size: 9px;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 800;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 4px;
        }
        .cart-item-portion-badge.full {
          background-color: rgba(0,0,0,0.08);
          color: var(--color-heading);
        }
        .cart-item-portion-badge.half {
          background-color: var(--color-primary);
          color: var(--white);
        }
        .cart-item-price {
          font-size: 13px;
          color: var(--color-paragraph);
          margin: 0;
        }
        .cart-item-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 6px;
        }
        .qty-adjust-btn {
          background-color: rgba(0,0,0,0.06);
          border: 1px solid rgba(0,0,0,0.15);
          color: var(--color-heading);
          width: 24px;
          height: 24px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .qty-adjust-btn:hover {
          background-color: var(--color-primary);
          border-color: var(--color-primary);
          color: var(--white);
        }
        .cart-item-qty {
          font-size: 14px;
          font-weight: bold;
          min-width: 15px;
          text-align: center;
        }
        .cart-item-delete-btn {
          background: none;
          border: none;
          color: #ff5e5e;
          cursor: pointer;
          font-size: 15px;
          transition: color 0.2s;
          padding: 4px;
        }
        .cart-item-delete-btn:hover {
          color: #ff3333;
        }
        .cart-sheet-footer {
          padding: 20px;
          border-top: 1px solid rgba(0,0,0,0.08);
          background-color: rgba(0,0,0,0.03);
        }
        .cart-sheet-subtotal {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          font-size: 16px;
          font-weight: 700;
        }
        .cart-sheet-subtotal span:last-child {
          color: var(--color-primary);
          font-size: 18px;
        }
        .cart-checkout-btn {
          width: 100%;
          padding: 14px;
          border-radius: 4px;
          border: 1px solid transparent;
          font-weight: 700;
          font-size: 15px;
          background-color: var(--color-primary);
          color: var(--white);
          cursor: pointer;
          transition: all 0.3s;
        }
        .cart-checkout-btn:hover {
          background-color: var(--white);
          color: var(--dark);
          border-color: var(--color-primary);
        }
        .cart-checkout-btn:disabled {
          background-color: #2c2c2c;
          color: #777777;
          cursor: not-allowed;
        }
        .empty-cart-text {
          text-align: center;
          color: #777777;
          margin-top: 50px;
          font-size: 15px;
        }
      `}</style>

      {/* Floating Cart Button */}
      <div className="floating-cart-btn" onClick={() => setIsOpen(true)}>
        <i className="fas fa-shopping-cart"></i>
        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
      </div>

      {/* Overlay Backdrop */}
      <div
        className={`cart-sheet-overlay ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sliding Sheet Panel */}
      <div className={`cart-sheet ${isOpen ? "active" : ""}`}>
        <div className="cart-sheet-header">
          <h3>Your Order Cart</h3>
          <button
            className="cart-sheet-close-btn"
            onClick={() => setIsOpen(false)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="cart-sheet-body">
          {cart.length === 0 ? (
            <div className="empty-cart-text">
              <i
                className="fas fa-shopping-basket mb-3"
                style={{ fontSize: "40px" }}
              ></i>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.item_id}-${item.portion}`}
                className="cart-item-row"
              >
                <div className="cart-item-img">
                  <Image
                    src={
                      item.cover_image
                        ? getMediaUrl(item.cover_image)
                        : "/assets/restaurent_images/shop/1.jpg"
                    }
                    alt={item.name}
                    fill
                    sizes="60px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="cart-item-info">
                  <h4 className="cart-item-title">{item.name}</h4>
                  <span className={`cart-item-portion-badge ${item.portion}`}>
                    {item.portion === "half" ? "Half" : "Full"}
                  </span>
                  <p className="cart-item-price">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                  <div className="cart-item-actions">
                    <button
                      className="qty-adjust-btn"
                      onClick={() =>
                        updateQuantity(
                          restaurantSlug,
                          item.item_id,
                          item.portion,
                          item.quantity - 1,
                        )
                      }
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <span className="cart-item-qty">{item.quantity}</span>
                    <button
                      className="qty-adjust-btn"
                      onClick={() =>
                        updateQuantity(
                          restaurantSlug,
                          item.item_id,
                          item.portion,
                          item.quantity + 1,
                        )
                      }
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
                <button
                  className="cart-item-delete-btn"
                  onClick={() =>
                    removeItem(restaurantSlug, item.item_id, item.portion)
                  }
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-sheet-footer">
            <div className="cart-sheet-subtotal">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button
              className="cart-checkout-btn"
              onClick={handleCheckout}
              disabled={checkingAuth}
            >
              {checkingAuth ? "Verifying Session..." : "Proceed to Checkout"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
