"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select, SelectTrigger, SelectContent, SelectItem, SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import useGetVendors from "@/hooks/data/useGetVendors";

function VendorCreateForm() {
  const { data: vendorsData } = useGetVendors();
  const queryClient = useQueryClient();
  const vendors = vendorsData?.data || [];

  // vendor fields
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loadingV, setLoadingV] = useState(false);

  // category + offer fields
  const [categoryName, setCategoryName] = useState("");
  const [loadingC, setLoadingC] = useState(false);
  const [createdCategoryId, setCreatedCategoryId] = useState("");

  const [offerVendor, setOfferVendor] = useState("");
  const [offerCategory, setOfferCategory] = useState("");
  const [offerTitle, setOfferTitle] = useState("");
  const [offerPrice, setOfferPrice] = useState(0);
  const [offerCycle, setOfferCycle] = useState("monthly");
  const [loadingO, setLoadingO] = useState(false);

  async function createVendor() {
    if (!name.trim()) return toast.error("Vendor name required");
    try {
      setLoadingV(true);
      await axiosInstance.post("/api/vendor/v1/vendors/", {
        name, contact_person: contact, phone, email,
      });
      toast.success("Vendor created");
      setName(""); setContact(""); setPhone(""); setEmail("");
      queryClient.invalidateQueries({ queryKey: ["getVendors"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed");
    } finally {
      setLoadingV(false);
    }
  }

  async function createCategory() {
    if (!categoryName.trim()) return toast.error("Category name required");
    try {
      setLoadingC(true);
      const res = await axiosInstance.post("/api/vendor/v1/vendors/categories/", {
        name: categoryName,
      });
      setCreatedCategoryId(String(res?.data?.data?.id || ""));
      toast.success("Category created — use its id in the offer below");
      setCategoryName("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed");
    } finally {
      setLoadingC(false);
    }
  }

  async function createOffer() {
    if (!offerVendor || !offerCategory || !offerTitle) {
      return toast.error("Vendor, category id, and title required");
    }
    try {
      setLoadingO(true);
      await axiosInstance.post("/api/vendor/v1/vendors/offers/", {
        vendor: Number(offerVendor),
        category: Number(offerCategory),
        title: offerTitle,
        price: offerPrice,
        billing_cycle: offerCycle,
      });
      toast.success("Offer created");
      setOfferTitle(""); setOfferPrice(0);
      queryClient.invalidateQueries({ queryKey: ["getVendorOffers"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed");
    } finally {
      setLoadingO(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm space-y-3">
        <h3 className="font-semibold">Add Vendor</h3>
        <Input placeholder="Vendor name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Contact person" value={contact} onChange={(e) => setContact(e.target.value)} />
        <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button onClick={createVendor} disabled={loadingV} className="w-full">
          {loadingV ? "Saving..." : "Add Vendor"}
        </Button>
      </div>

      <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm space-y-3">
        <h3 className="font-semibold">Add Service Category</h3>
        <Input placeholder="e.g. Laundry, Security" value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)} />
        <Button onClick={createCategory} disabled={loadingC} className="w-full">
          {loadingC ? "Saving..." : "Add Category"}
        </Button>
        {createdCategoryId && (
          <p className="text-sm text-muted-foreground">
            Last created category id: <span className="font-mono">{createdCategoryId}</span>
          </p>
        )}
      </div>

      <div className="lg:col-span-2 p-6 bg-card rounded-xl border border-border/50 shadow-sm space-y-3">
        <h3 className="font-semibold">Add Offer (a vendor's price for a category)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select value={offerVendor} onValueChange={setOfferVendor}>
            <SelectTrigger><SelectValue placeholder="Vendor" /></SelectTrigger>
            <SelectContent>
              {vendors.map((v: any) => (
                <SelectItem key={v.id} value={String(v.id)}>{v.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input placeholder="Category id" value={offerCategory}
            onChange={(e) => setOfferCategory(e.target.value)} />
          <Input placeholder="Offer title" value={offerTitle}
            onChange={(e) => setOfferTitle(e.target.value)} />
          <Input type="number" placeholder="Price" value={offerPrice}
            onChange={(e) => setOfferPrice(Number(e.target.value))} />
          <Select value={offerCycle} onValueChange={setOfferCycle}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="one_time">One time</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={createOffer} disabled={loadingO} className="w-full">
          {loadingO ? "Saving..." : "Add Offer"}
        </Button>
      </div>
    </div>
  );
}

export default VendorCreateForm;
