"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { LoadingDots } from "@/components/ui/loading";
import {
  Pencil,
  Plus,
  Trash2,
  Star,
  Check,
  X,
  Image as ImageIcon,
  MessageSquare,
  ListCollapse,
  Settings,
  UserCheck,
} from "lucide-react";
import { getMediaUrl } from "@/lib/utils";

export default function RestaurantManagePanel({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<
    "overview" | "menu" | "testimonials" | "reviews" | "footer"
  >("overview");

  const [footerVal, setFooterVal] = useState<any>({
    aboutText: "",
    fbLink: "",
    twitterLink: "",
    youtubeLink: "",
    linkedinLink: "",
    address: "",
    phone1: "",
    phone2: "",
    email: "",
    newsletterText: "",
    explore: [],
  });

  const [savingFooter, setSavingFooter] = useState(false);

  // Queries
  const { data: detailData, isLoading: loadingDetail } = useQuery({
    queryKey: ["restaurantDetail", restaurantId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/restaurants/v1/restaurants/${restaurantId}/detail/`,
      );
      return res?.data;
    },
  });
  const restaurant = detailData?.data;

  const { data: itemsData, isLoading: loadingItems } = useQuery({
    queryKey: ["restaurantItemsManage", restaurantId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/restaurants/v1/restaurants/items/?restaurant=${restaurantId}`,
      );
      return res?.data;
    },
  });
  const items = itemsData?.data || [];

  const { data: categoriesData } = useQuery({
    queryKey: ["restaurantCategories"],
    queryFn: async () => {
      const res = await axiosInstance.get(
        "/api/restaurants/v1/restaurants/categories/",
      );
      return res?.data;
    },
  });
  const categories = categoriesData?.data || [];

  const { data: sectionsData, isLoading: loadingSections } = useQuery({
    queryKey: ["restaurantSections", restaurantId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/portal-management/v1/restaurants/${restaurantId}/sections/`,
      );
      return res?.data;
    },
  });
  const sections = sectionsData?.data || [];

  const { data: testimonialsData, isLoading: loadingTestimonials } = useQuery({
    queryKey: ["restaurantTestimonials", restaurantId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/portal-management/v1/restaurants/${restaurantId}/testimonials/`,
      );
      return res?.data;
    },
  });
  const testimonials = testimonialsData?.data || [];

  const { data: reviewsData, isLoading: loadingReviews } = useQuery({
    queryKey: ["restaurantReviews", restaurantId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/api/portal-management/v1/restaurants/${restaurantId}/reviews/`,
      );
      return res?.data;
    },
  });
  const reviews = reviewsData?.data || [];

  useEffect(() => {
    if (restaurant && restaurant.footer_config) {
      const fc = restaurant.footer_config;
      setFooterVal({
        aboutText: fc.about_us?.text || "",
        fbLink: fc.about_us?.facebook || "",
        twitterLink: fc.about_us?.twitter || "",
        youtubeLink: fc.about_us?.youtube || "",
        linkedinLink: fc.about_us?.linkedin || "",
        address: fc.contact_info?.address || "",
        phone1: fc.contact_info?.phone_1 || "",
        phone2: fc.contact_info?.phone_2 || "",
        email: fc.contact_info?.email || "",
        newsletterText: fc.newsletter?.text || "",
        explore: fc.explore || [],
      });
    }
  }, [restaurant, activeTab]);

  async function saveFooterConfig() {
    try {
      setSavingFooter(true);
      const payload = {
        about_us: {
          text: footerVal.aboutText,
          facebook: footerVal.fbLink,
          twitter: footerVal.twitterLink,
          youtube: footerVal.youtubeLink,
          linkedin: footerVal.linkedinLink,
        },
        explore: footerVal.explore,
        contact_info: {
          address: footerVal.address,
          phone_1: footerVal.phone1,
          phone_2: footerVal.phone2,
          email: footerVal.email,
        },
        newsletter: {
          text: footerVal.newsletterText,
        },
      };

      const fd = new FormData();
      fd.append("footer_config", JSON.stringify(payload));

      await axiosInstance.patch(
        `/api/restaurants/v1/restaurants/${restaurantId}/detail/`,
        fd,
      );

      queryClient.invalidateQueries({ queryKey: ["restaurantDetail", restaurantId] });
      toast.success("Footer configuration updated successfully!");
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to update footer configuration");
    } finally {
      setSavingFooter(false);
    }
  }

  // Form states
  const [editingRestaurant, setEditingRestaurant] = useState(false);
  const [rv, setRv] = useState<any>({});
  const [bannerBgFile, setBannerBgFile] = useState<File | null>(null);

  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editSection, setEditSection] = useState<any>(null);
  const [sv, setSv] = useState<any>({});
  const [sectionCoverFile, setSectionCoverFile] = useState<File | null>(null);

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [iv, setIv] = useState<any>({});
  const [uploadedItemImages, setUploadedItemImages] = useState<File[]>([]);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [editTestimonial, setEditTestimonial] = useState<any>(null);
  const [tv, setTv] = useState<any>({});

  // ----------------------------------------
  // Overview Actions
  // ----------------------------------------
  function startEditRestaurant() {
    setRv({
      name: restaurant?.name || "",
      description: restaurant?.description || "",
      address: restaurant?.address || "",
      city: restaurant?.city || "",
      state: restaurant?.state || "",
      postal_code: restaurant?.postal_code || "",
      phone: restaurant?.phone || "",
      operating_hours: restaurant?.operating_hours || "",
      capacity: restaurant?.capacity ?? "",
      status: restaurant?.status || "open",
      opening_time: restaurant?.opening_time || "",
      closing_time: restaurant?.closing_time || "",
      booking_fees_per_seat: restaurant?.booking_fees_per_seat || "",
      slug: restaurant?.slug || "",
      slogan_1: restaurant?.slogan_1 || "",
      slogan_2: restaurant?.slogan_2 || "",
      banner_title: restaurant?.banner_title || "",
      delivery_banner_title: restaurant?.delivery_banner_title || "",
      delivery_banner_text: restaurant?.delivery_banner_text || "",
      reservation_banner_title: restaurant?.reservation_banner_title || "",
      reservation_banner_text: restaurant?.reservation_banner_text || "",
      reservation_banner_launch_menu:
        restaurant?.reservation_banner_launch_menu || "",
      reservation_banner_dinner_menu:
        restaurant?.reservation_banner_dinner_menu || "",
      meta_title: restaurant?.meta_title || "",
      meta_description: restaurant?.meta_description || "",
      is_active: restaurant?.is_active ?? true,
    });
    setBannerBgFile(null);
    setEditingRestaurant(true);
  }

  async function saveRestaurant() {
    try {
      const fd = new FormData();
      Object.keys(rv).forEach((key) => {
        if (rv[key] !== null && rv[key] !== undefined) {
          fd.append(key, String(rv[key]));
        }
      });
      if (bannerBgFile) {
        fd.append("banner_bg_image", bannerBgFile);
      }

      await axiosInstance.patch(
        `/api/restaurants/v1/restaurants/${restaurantId}/detail/`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      toast.success("Restaurant layout updated successfully");
      setEditingRestaurant(false);
      queryClient.invalidateQueries({
        queryKey: ["restaurantDetail", restaurantId],
      });
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Layout update failed");
    }
  }

  // ----------------------------------------
  // Section Actions
  // ----------------------------------------
  function startAddSection() {
    setEditSection(null);
    setSv({
      title: "",
      description: "",
      order: 0,
      is_active: true,
      layout_type: "default",
    });
    setSectionCoverFile(null);
    setSectionModalOpen(true);
  }

  function startEditSection(sec: any) {
    setEditSection(sec);
    setSv({
      title: sec.title || "",
      description: sec.description || "",
      order: sec.order || 0,
      is_active: sec.is_active ?? true,
      layout_type: sec.layout_type || "default",
    });
    setSectionCoverFile(null);
    setSectionModalOpen(true);
  }

  async function saveSection() {
    try {
      const fd = new FormData();
      fd.append("title", sv.title);
      fd.append("description", sv.description);
      fd.append("order", String(sv.order));
      fd.append("is_active", String(sv.is_active));
      fd.append("layout_type", sv.layout_type || "default");
      if (sectionCoverFile) {
        fd.append("cover_image", sectionCoverFile);
      }

      if (editSection) {
        await axiosInstance.patch(
          `/api/portal-management/v1/restaurants/sections/${editSection.id}/`,
          fd,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        toast.success("Menu section updated");
      } else {
        await axiosInstance.post(
          `/api/portal-management/v1/restaurants/${restaurantId}/sections/`,
          fd,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        toast.success("Menu section created");
      }
      setSectionModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["restaurantSections", restaurantId],
      });
    } catch (e: any) {
      toast.error("Failed to save menu section");
    }
  }

  async function deleteSection(id: number) {
    if (confirm("Are you sure you want to delete this menu section?")) {
      try {
        await axiosInstance.delete(
          `/api/portal-management/v1/restaurants/sections/${id}/`,
        );
        toast.success("Menu section deleted");
        queryClient.invalidateQueries({
          queryKey: ["restaurantSections", restaurantId],
        });
      } catch (e: any) {
        toast.error("Failed to delete section");
      }
    }
  }

  // ----------------------------------------
  // Item Actions
  // ----------------------------------------
  function startAddItem() {
    setEditItem(null);
    setIv({
      name: "",
      description: "",
      unit: "1 Portion",
      unit_cost: "",
      selling_price: "",
      half_price: "",
      availability: true,
      category: categories[0]?.id || "",
      menu_section: sections[0]?.id || "",
      slug: "",
      sku: "",
      stock: 100,
      tags: "",
      sub_items: "",
      free_bonus: "",
    });
    setUploadedItemImages([]);
    setCoverImageFile(null);
    setItemModalOpen(true);
  }

  function startEditItem(it: any) {
    setEditItem(it);
    setIv({
      name: it.name || "",
      description: it.description || "",
      unit: it.unit || "1 Portion",
      unit_cost: it.unit_cost || "",
      selling_price: it.selling_price || "",
      half_price: it.half_price || "",
      availability: it.availability ?? true,
      category: it.category_id || it.category || "",
      menu_section: it.menu_section_id || it.menu_section || "",
      slug: it.slug || "",
      sku: it.sku || "",
      stock: it.stock ?? 0,
      tags: Array.isArray(it.tags) ? it.tags.join(", ") : it.tags || "",
      sub_items: it.sub_items || "",
      free_bonus: it.free_bonus || "",
    });
    setUploadedItemImages([]);
    setCoverImageFile(null);
    setItemModalOpen(true);
  }

  async function saveItem() {
    try {
      const tagsArray = iv.tags
        ? iv.tags
            .split(",")
            .map((t: string) => t.trim())
            .filter(Boolean)
        : [];

      const fd = new FormData();
      Object.keys(iv).forEach((key) => {
        if (
          key !== "tags" &&
          key !== "category" &&
          key !== "menu_section" &&
          key !== "half_price" &&
          key !== "selling_price" &&
          key !== "unit_cost" &&
          key !== "stock"
        ) {
          if (iv[key] !== null && iv[key] !== undefined) {
            fd.append(key, String(iv[key]));
          }
        }
      });

      fd.append("restaurant", String(restaurantId));
      fd.append("category", String(iv.category));
      fd.append("menu_section", iv.menu_section ? String(iv.menu_section) : "");
      fd.append("tags", JSON.stringify(tagsArray));
      fd.append(
        "half_price",
        iv.half_price !== "" &&
          iv.half_price !== null &&
          iv.half_price !== undefined
          ? String(iv.half_price)
          : "",
      );
      fd.append("selling_price", String(iv.selling_price));
      fd.append("unit_cost", String(iv.unit_cost));
      fd.append("stock", String(iv.stock));

      if (coverImageFile) {
        fd.append("cover_image", coverImageFile);
      }

      let itemRes;
      if (editItem) {
        itemRes = await axiosInstance.patch(
          `/api/restaurants/v1/restaurants/items/${editItem.id}/detail/`,
          fd,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        toast.success("Item updated");
      } else {
        itemRes = await axiosInstance.post(
          `/api/restaurants/v1/restaurants/items/`,
          fd,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        toast.success("Item created successfully");
      }

      // Handle item media images uploads
      const itemId = editItem ? editItem.id : itemRes.data.id;
      if (itemId && uploadedItemImages.length > 0) {
        for (const file of uploadedItemImages) {
          const fd = new FormData();
          fd.append("image", file);
          fd.append("is_cover", "false");
          await axiosInstance.post(
            `/api/portal-management/v1/items/${itemId}/media/`,
            fd,
            {
              headers: { "Content-Type": "multipart/form-data" },
            },
          );
        }
      }

      setItemModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["restaurantItemsManage", restaurantId],
      });
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to save food item");
    }
  }

  async function deleteItem(id: number) {
    if (confirm("Are you sure you want to delete this food item?")) {
      try {
        await axiosInstance.delete(
          `/api/restaurants/v1/restaurants/items/${id}/detail/`,
        );
        toast.success("Item deleted successfully");
        queryClient.invalidateQueries({
          queryKey: ["restaurantItemsManage", restaurantId],
        });
      } catch (e: any) {
        toast.error("Failed to delete item");
      }
    }
  }

  async function deleteItemMedia(mediaId: number) {
    if (confirm("Delete this image?")) {
      try {
        await axiosInstance.delete(
          `/api/portal-management/v1/media/${mediaId}/`,
        );
        toast.success("Image deleted");
        queryClient.invalidateQueries({
          queryKey: ["restaurantItemsManage", restaurantId],
        });
      } catch (e: any) {
        toast.error("Failed to delete image");
      }
    }
  }

  // ----------------------------------------
  // Testimonial Actions
  // ----------------------------------------
  function startAddTestimonial() {
    setEditTestimonial(null);
    setTv({
      rating: 5,
      title: "",
      text: "",
      name: "",
      designation: "",
      is_active: true,
    });
    setTestimonialModalOpen(true);
  }

  function startEditTestimonial(testi: any) {
    setEditTestimonial(testi);
    setTv({
      rating: testi.rating || 5,
      title: testi.title || "",
      text: testi.text || "",
      name: testi.name || "",
      designation: testi.designation || "",
      is_active: testi.is_active ?? true,
    });
    setTestimonialModalOpen(true);
  }

  async function saveTestimonial() {
    try {
      if (editTestimonial) {
        await axiosInstance.patch(
          `/api/portal-management/v1/testimonials/${editTestimonial.id}/`,
          tv,
        );
        toast.success("Testimonial updated");
      } else {
        await axiosInstance.post(
          `/api/portal-management/v1/restaurants/${restaurantId}/testimonials/`,
          tv,
        );
        toast.success("Testimonial created");
      }
      setTestimonialModalOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["restaurantTestimonials", restaurantId],
      });
    } catch (e: any) {
      toast.error("Failed to save testimonial");
    }
  }

  async function deleteTestimonial(id: number) {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      try {
        await axiosInstance.delete(
          `/api/portal-management/v1/testimonials/${id}/`,
        );
        toast.success("Testimonial deleted");
        queryClient.invalidateQueries({
          queryKey: ["restaurantTestimonials", restaurantId],
        });
      } catch (e: any) {
        toast.error("Failed to delete testimonial");
      }
    }
  }

  // ----------------------------------------
  // Review Moderation Actions
  // ----------------------------------------
  async function toggleReviewStatus(rev: any) {
    try {
      await axiosInstance.patch(
        `/api/portal-management/v1/reviews/${rev.id}/`,
        {
          is_active: !rev.is_active,
        },
      );
      toast.success("Review status updated");
      queryClient.invalidateQueries({
        queryKey: ["restaurantReviews", restaurantId],
      });
    } catch (e: any) {
      toast.error("Failed to update status");
    }
  }

  async function deleteReview(id: number) {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await axiosInstance.delete(`/api/portal-management/v1/reviews/${id}/`);
        toast.success("Review deleted");
        queryClient.invalidateQueries({
          queryKey: ["restaurantReviews", restaurantId],
        });
      } catch (e: any) {
        toast.error("Failed to delete review");
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex border-b border-border/60 space-x-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all border-b-2 -mb-[2px] ${
            activeTab === "overview"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Settings className="w-4 h-4" /> Overview & Layouts
        </button>
        <button
          onClick={() => setActiveTab("menu")}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all border-b-2 -mb-[2px] ${
            activeTab === "menu"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ListCollapse className="w-4 h-4" /> Sections & Items
        </button>
        <button
          onClick={() => setActiveTab("testimonials")}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all border-b-2 -mb-[2px] ${
            activeTab === "testimonials"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <UserCheck className="w-4 h-4" /> Testimonials
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all border-b-2 -mb-[2px] ${
            activeTab === "reviews"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Reviews Moderation
        </button>
        <button
          onClick={() => setActiveTab("footer")}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm transition-all border-b-2 -mb-[2px] ${
            activeTab === "footer"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ImageIcon className="w-4 h-4" /> Footer Configuration
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Restaurant Details & Layout Configuration
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Configure banners, SEO tags, and page content
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={startEditRestaurant}
              className="gap-2"
            >
              <Pencil className="w-4 h-4" /> Edit Configuration
            </Button>
          </div>
          {loadingDetail ? (
            <LoadingDots />
          ) : restaurant ? (
            <div className="grid gap-4 md:grid-cols-2 mt-6 text-sm">
              <div className="border border-border/40 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold text-primary">
                  Core Configuration
                </h3>
                <div>
                  <span className="text-muted-foreground">Name:</span>{" "}
                  {restaurant.name}
                </div>
                <div>
                  <span className="text-muted-foreground">Slug (URL):</span>{" "}
                  {restaurant.slug || (
                    <span className="text-red-500 font-mono">missing</span>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <Badge
                    variant={
                      restaurant.status === "open" ? "default" : "secondary"
                    }
                  >
                    {restaurant.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    City / Capacity:
                  </span>{" "}
                  {restaurant.city} ({restaurant.capacity} seats)
                </div>
                <div>
                  <span className="text-muted-foreground">Phone:</span>{" "}
                  {restaurant.phone}
                </div>
                <div>
                  <span className="text-muted-foreground">Slogan 1:</span>{" "}
                  {restaurant.slogan_1 || "N/A"}
                </div>
                <div>
                  <span className="text-muted-foreground">Slogan 2:</span>{" "}
                  {restaurant.slogan_2 || "N/A"}
                </div>
              </div>

              <div className="border border-border/40 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold text-primary">
                  Hero Banner & Images
                </h3>
                <div>
                  <span className="text-muted-foreground">Banner Title:</span>{" "}
                  {restaurant.banner_title || "N/A"}
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Banner Background:
                  </span>{" "}
                  {restaurant.banner_bg_image ? (
                    <a
                      href={restaurant.banner_bg_image}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 hover:underline break-all"
                    >
                      View Image
                    </a>
                  ) : (
                    "None"
                  )}
                </div>
                <h3 className="font-semibold text-primary pt-2">
                  SEO Meta Fields
                </h3>
                <div>
                  <span className="text-muted-foreground">Meta Title:</span>{" "}
                  {restaurant.meta_title || "N/A"}
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Meta Description:
                  </span>{" "}
                  {restaurant.meta_description || "N/A"}
                </div>
              </div>

              <div className="border border-border/40 p-4 rounded-lg space-y-2 md:col-span-2">
                <h3 className="font-semibold text-primary">
                  Dynamic Page Banners
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <h4 className="font-medium text-xs">
                      Delivery Banner Settings
                    </h4>
                    <div className="text-xs">
                      <span className="font-semibold">Title:</span>{" "}
                      {restaurant.delivery_banner_title || "N/A"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {restaurant.delivery_banner_text || "N/A"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-xs">
                      Reservation Banner Settings
                    </h4>
                    <div className="text-xs">
                      <span className="font-semibold">Title:</span>{" "}
                      {restaurant.reservation_banner_title || "N/A"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {restaurant.reservation_banner_text || "N/A"}
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold">Launch stats:</span>{" "}
                      {restaurant.reservation_banner_launch_menu || "N/A"}
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold">Dinner stats:</span>{" "}
                      {restaurant.reservation_banner_dinner_menu || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground mt-4">
              Could not load restaurant.
            </p>
          )}
        </div>
      )}

      {/* SECTIONS & ITEMS TAB */}
      {activeTab === "menu" && (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Menu Sections (Left column) */}
          <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base">Menu Sections</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={startAddSection}
                className="h-8 gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </Button>
            </div>
            {loadingSections ? (
              <LoadingDots />
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {sections.map((sec: any) => (
                  <div
                    key={sec.id}
                    className="p-3 bg-muted/40 rounded-lg border border-border/50 flex items-center justify-between"
                  >
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-sm">{sec.title}</span>
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1 py-0 h-4"
                        >
                          Order: {sec.order}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">
                        {sec.description || "No description"}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => startEditSection(sec)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                        onClick={() => deleteSection(sec.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
                {sections.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    No menu sections created yet.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Food Items (Right column) */}
          <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base">Food Items</h3>
              <Button size="sm" onClick={startAddItem} className="h-8 gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Food Item
              </Button>
            </div>
            {loadingItems ? (
              <LoadingDots />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Details</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Pricing</TableHead>
                      <TableHead>Stock / SKU</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((it: any) => (
                      <TableRow key={it.id}>
                        <TableCell>
                          <div>
                            <span className="font-medium text-sm block">
                              {it.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground block line-clamp-1">
                              {it.description}
                            </span>
                            {it.tags && it.tags.length > 0 && (
                              <div className="flex gap-1 flex-wrap mt-1">
                                {it.tags.map((tg: string, i: number) => (
                                  <Badge
                                    key={i}
                                    variant="secondary"
                                    className="text-[9px] px-1 py-0 h-4"
                                  >
                                    {tg}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs">
                            {it.menu_section_title || "Unassigned"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div>Full: ${it.selling_price}</div>
                            {it.half_price && (
                              <div className="text-muted-foreground">
                                Half: ${it.half_price}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div>
                              SKU:{" "}
                              <code className="text-red-500">
                                {it.sku || "N/A"}
                              </code>
                            </div>
                            <div>Stock: {it.stock}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1.5 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => startEditItem(it)}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              onClick={() => deleteItem(it.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {items.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-muted-foreground py-8"
                        >
                          No items added to this restaurant yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TESTIMONIALS TAB */}
      {activeTab === "testimonials" && (
        <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Customer Testimonials</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage customer feedback testimonials displayed in portal
              </p>
            </div>
            <Button size="sm" onClick={startAddTestimonial} className="gap-1">
              <Plus className="w-4 h-4" /> Add Testimonial
            </Button>
          </div>
          {loadingTestimonials ? (
            <LoadingDots />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review Slogan / Text</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testi: any) => (
                  <TableRow key={testi.id}>
                    <TableCell>
                      <div>
                        <span className="font-semibold text-sm block">
                          {testi.name}
                        </span>
                        <span className="text-xs text-muted-foreground block">
                          {testi.designation}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex text-warning">
                        {Array.from({ length: testi.rating || 5 }).map(
                          (_, i) => (
                            <Star
                              key={i}
                              className="w-3.5 h-3.5 fill-current"
                            />
                          ),
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-medium text-xs block text-primary">
                          “{testi.title}”
                        </span>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {testi.text}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1.5 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          onClick={() => startEditTestimonial(testi)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          onClick={() => deleteTestimonial(testi.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {testimonials.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground py-8"
                    >
                      No testimonials added yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      {/* REVIEWS TAB */}
      {activeTab === "reviews" && (
        <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Member Reviews Moderation</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Moderate customer reviews submitted dynamically
            </p>
          </div>
          {loadingReviews ? (
            <LoadingDots />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Food Item</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviews.map((rev: any) => (
                  <TableRow key={rev.id}>
                    <TableCell className="font-semibold text-xs">
                      {rev.item_name}
                    </TableCell>
                    <TableCell className="text-xs">{rev.member_name}</TableCell>
                    <TableCell>
                      <div className="flex text-warning">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                      {rev.review_text}
                    </TableCell>
                    <TableCell>
                      <Badge variant={rev.is_active ? "default" : "secondary"}>
                        {rev.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1.5 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 gap-1 text-[11px]"
                          onClick={() => toggleReviewStatus(rev)}
                        >
                          {rev.is_active ? (
                            <>
                              <X className="w-3 h-3 text-red-500" /> Hide
                            </>
                          ) : (
                            <>
                              <Check className="w-3 h-3 text-green-500" />{" "}
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={() => deleteReview(rev.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {reviews.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground py-8"
                    >
                      No reviews found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      {/* FOOTER CONFIGURATION TAB */}
      {activeTab === "footer" && (
        <div className="p-6 bg-card rounded-xl border border-border/50 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Footer Section Configuration</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Customize About Us description, social links, explore links, and contact info
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* About Us & Newsletter */}
            <div className="space-y-4 border border-border/40 p-4 rounded-lg">
              <h3 className="font-semibold text-sm text-primary uppercase tracking-wide">
                About Us & Newsletter
              </h3>
              <div>
                <label className="text-xs text-muted-foreground">About Us Description</label>
                <Textarea
                  value={footerVal.aboutText}
                  onChange={(e) => setFooterVal({ ...footerVal, aboutText: e.target.value })}
                  placeholder="Enter About Us paragraph"
                  rows={4}
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Newsletter Description</label>
                <Textarea
                  value={footerVal.newsletterText}
                  onChange={(e) => setFooterVal({ ...footerVal, newsletterText: e.target.value })}
                  placeholder="Enter newsletter description"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-muted-foreground block font-medium">Social Links</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-muted-foreground">Facebook Link</span>
                    <Input
                      value={footerVal.fbLink}
                      onChange={(e) => setFooterVal({ ...footerVal, fbLink: e.target.value })}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground">Twitter Link</span>
                    <Input
                      value={footerVal.twitterLink}
                      onChange={(e) => setFooterVal({ ...footerVal, twitterLink: e.target.value })}
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground">YouTube Link</span>
                    <Input
                      value={footerVal.youtubeLink}
                      onChange={(e) => setFooterVal({ ...footerVal, youtubeLink: e.target.value })}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground">LinkedIn Link</span>
                    <Input
                      value={footerVal.linkedinLink}
                      onChange={(e) => setFooterVal({ ...footerVal, linkedinLink: e.target.value })}
                      placeholder="https://linkedin.com/..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info & Explore */}
            <div className="space-y-4 border border-border/40 p-4 rounded-lg">
              <h3 className="font-semibold text-sm text-primary uppercase tracking-wide">
                Contact Info
              </h3>
              <div>
                <label className="text-xs text-muted-foreground">Physical Address</label>
                <Input
                  value={footerVal.address}
                  onChange={(e) => setFooterVal({ ...footerVal, address: e.target.value })}
                  placeholder="175 10h Street, Office 375 Berlin, De 21562"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">Phone Number 1</label>
                  <Input
                    value={footerVal.phone1}
                    onChange={(e) => setFooterVal({ ...footerVal, phone1: e.target.value })}
                    placeholder="+123 34598768"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Phone Number 2 (Optional)</label>
                  <Input
                    value={footerVal.phone2}
                    onChange={(e) => setFooterVal({ ...footerVal, phone2: e.target.value })}
                    placeholder="+554 34598734"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Email Address</label>
                <Input
                  value={footerVal.email}
                  onChange={(e) => setFooterVal({ ...footerVal, email: e.target.value })}
                  placeholder="food@restan.com"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-muted-foreground block font-medium">Explore Links</label>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-6 text-[10px] px-2"
                    onClick={() => {
                      const updatedExplore = [...(footerVal.explore || [])];
                      updatedExplore.push({ label: "New Link", link: "#" });
                      setFooterVal({ ...footerVal, explore: updatedExplore });
                    }}
                  >
                    + Add Link
                  </Button>
                </div>
                <div className="max-h-[180px] overflow-y-auto space-y-2 pr-1">
                  {(footerVal.explore || []).map((exp: any, idx: number) => (
                    <div className="flex gap-2 items-center" key={idx}>
                      <Input
                        className="h-8 text-xs text-foreground bg-background"
                        value={exp.label}
                        onChange={(e) => {
                          const updatedExplore = [...footerVal.explore];
                          updatedExplore[idx] = { ...updatedExplore[idx], label: e.target.value };
                          setFooterVal({ ...footerVal, explore: updatedExplore });
                        }}
                        placeholder="Label"
                      />
                      <Input
                        className="h-8 text-xs text-foreground bg-background"
                        value={exp.link}
                        onChange={(e) => {
                          const updatedExplore = [...footerVal.explore];
                          updatedExplore[idx] = { ...updatedExplore[idx], link: e.target.value };
                          setFooterVal({ ...footerVal, explore: updatedExplore });
                        }}
                        placeholder="URL/Path"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        className="h-8 w-8 text-red-500 shrink-0"
                        onClick={() => {
                          const updatedExplore = footerVal.explore.filter((_: any, i: number) => i !== idx);
                          setFooterVal({ ...footerVal, explore: updatedExplore });
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                  {(footerVal.explore || []).length === 0 && (
                    <div className="text-center text-[11px] text-muted-foreground py-2 border border-dashed rounded">
                      No links added yet. Click "+ Add Link" to build your custom menu links!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={saveFooterConfig} disabled={savingFooter} className="gap-2">
              {savingFooter ? "Saving..." : "Save Footer Configuration"}
            </Button>
          </div>
        </div>
      )}

      {/* EDIT RESTAURANT DIALOG */}
      <Dialog open={editingRestaurant} onOpenChange={setEditingRestaurant}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Restaurant Configuration & Layout</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-b border-border/40 pb-2">
              <h3 className="font-semibold text-xs text-primary uppercase tracking-wide">
                Core Metadata
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground font-medium">
                  Name
                </label>
                <Input
                  value={rv.name || ""}
                  onChange={(e) => setRv({ ...rv, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-medium">
                  Slug URL
                </label>
                <Input
                  value={rv.slug || ""}
                  onChange={(e) => setRv({ ...rv, slug: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-medium">
                  City
                </label>
                <Input
                  value={rv.city || ""}
                  onChange={(e) => setRv({ ...rv, city: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-medium">
                  Phone
                </label>
                <Input
                  value={rv.phone || ""}
                  onChange={(e) => setRv({ ...rv, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="border-b border-border/40 pb-2 pt-2">
              <h3 className="font-semibold text-xs text-primary uppercase tracking-wide">
                Hero Banners & Branding
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground font-medium">
                  Slogan 1
                </label>
                <Input
                  value={rv.slogan_1 || ""}
                  onChange={(e) => setRv({ ...rv, slogan_1: e.target.value })}
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-medium">
                  Slogan 2
                </label>
                <Input
                  value={rv.slogan_2 || ""}
                  onChange={(e) => setRv({ ...rv, slogan_2: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] text-muted-foreground font-medium">
                  Hero Banner Title
                </label>
                <Input
                  value={rv.banner_title || ""}
                  onChange={(e) =>
                    setRv({ ...rv, banner_title: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] text-muted-foreground font-medium block">
                  Hero Banner Background Image File{" "}
                  <span className="text-[10px] text-primary">
                    (Recommended: 1800x800 px)
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const img = new Image();
                      img.src = URL.createObjectURL(file);
                      img.onload = () => {
                        URL.revokeObjectURL(img.src);
                        if (
                          Math.abs(img.width - 1800) > 100 ||
                          Math.abs(img.height - 800) > 100
                        ) {
                          toast.warning(
                            `Image size warning: selected image is ${img.width}x${img.height}px. Best dimensions for Hero Banner background are 1800x800px to maintain design layout.`,
                          );
                        }
                      };
                      setBannerBgFile(file);
                    } else {
                      setBannerBgFile(null);
                    }
                  }}
                  className="mt-1 block text-xs"
                />
              </div>
            </div>

            <div className="border-b border-border/40 pb-2 pt-2">
              <h3 className="font-semibold text-xs text-primary uppercase tracking-wide">
                Delivery & Reservation Sections
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground font-medium">
                  Delivery Title
                </label>
                <Input
                  value={rv.delivery_banner_title || ""}
                  onChange={(e) =>
                    setRv({ ...rv, delivery_banner_title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-medium">
                  Delivery Slogan / Description
                </label>
                <Textarea
                  value={rv.delivery_banner_text || ""}
                  onChange={(e) =>
                    setRv({ ...rv, delivery_banner_text: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-medium">
                  Reservation Title
                </label>
                <Input
                  value={rv.reservation_banner_title || ""}
                  onChange={(e) =>
                    setRv({ ...rv, reservation_banner_title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-medium">
                  Reservation Slogan / Description
                </label>
                <Textarea
                  value={rv.reservation_banner_text || ""}
                  onChange={(e) =>
                    setRv({ ...rv, reservation_banner_text: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-medium">
                  Lunch Menu Stats
                </label>
                <Input
                  value={rv.reservation_banner_launch_menu || ""}
                  onChange={(e) =>
                    setRv({
                      ...rv,
                      reservation_banner_launch_menu: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-medium">
                  Dinner Menu Stats
                </label>
                <Input
                  value={rv.reservation_banner_dinner_menu || ""}
                  onChange={(e) =>
                    setRv({
                      ...rv,
                      reservation_banner_dinner_menu: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="border-b border-border/40 pb-2 pt-2">
              <h3 className="font-semibold text-xs text-primary uppercase tracking-wide">
                SEO Properties
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="text-[11px] text-muted-foreground font-medium">
                  SEO Meta Title
                </label>
                <Input
                  value={rv.meta_title || ""}
                  onChange={(e) => setRv({ ...rv, meta_title: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] text-muted-foreground font-medium">
                  SEO Meta Description
                </label>
                <Textarea
                  value={rv.meta_description || ""}
                  onChange={(e) =>
                    setRv({ ...rv, meta_description: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={rv.is_active}
                  onCheckedChange={(v) => setRv({ ...rv, is_active: v })}
                />
                <span className="text-xs font-medium">Active Status</span>
              </div>
              <Button onClick={saveRestaurant}>Save Layout Config</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT/ADD SECTION DIALOG */}
      <Dialog open={sectionModalOpen} onOpenChange={setSectionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editSection ? "Edit Menu Section" : "Add Menu Section"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Title</label>
              <Input
                value={sv.title || ""}
                onChange={(e) => setSv({ ...sv, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">
                Description
              </label>
              <Textarea
                value={sv.description || ""}
                onChange={(e) => setSv({ ...sv, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">
                  Display Order
                </label>
                <Input
                  type="number"
                  value={sv.order ?? 0}
                  onChange={(e) =>
                    setSv({ ...sv, order: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Layout Type
                </label>
                <select
                  value={sv.layout_type || "default"}
                  onChange={(e) =>
                    setSv({ ...sv, layout_type: e.target.value })
                  }
                  className="w-full h-10 px-3 border border-input rounded-md text-sm bg-background text-foreground"
                >
                  <option value="default">Default / Tabs</option>
                  <option value="left">Left Column</option>
                  <option value="right">Right Column</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block">
                  Cover Image File{" "}
                  <span className="text-[10px] text-primary">
                    (800x1000)
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const img = new Image();
                      img.src = URL.createObjectURL(file);
                      img.onload = () => {
                        URL.revokeObjectURL(img.src);
                        if (
                          Math.abs(img.width - 800) > 80 ||
                          Math.abs(img.height - 1000) > 80
                        ) {
                          toast.warning(
                            `Image size warning: selected image is ${img.width}x${img.height}px. Best dimensions for Menu Section Cover are 800x1000px.`,
                          );
                        }
                      };
                      setSectionCoverFile(file);
                    } else {
                      setSectionCoverFile(null);
                    }
                  }}
                  className="mt-1 block text-xs"
                />
              </div>
            </div>
            <Button onClick={saveSection} className="w-full mt-2">
              Save Menu Section
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT/ADD ITEM DIALOG */}
      <Dialog open={itemModalOpen} onOpenChange={setItemModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editItem ? `Edit Item: ${editItem.name}` : "Add Food Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Name *</label>
                <Input
                  value={iv.name || ""}
                  onChange={(e) => setIv({ ...iv, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Slug URL *
                </label>
                <Input
                  value={iv.slug || ""}
                  onChange={(e) => setIv({ ...iv, slug: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-muted-foreground">
                  Description
                </label>
                <Textarea
                  value={iv.description || ""}
                  onChange={(e) =>
                    setIv({ ...iv, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Full Selling Price *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={iv.selling_price ?? ""}
                  onChange={(e) =>
                    setIv({ ...iv, selling_price: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Half Price (Optional)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={iv.half_price ?? ""}
                  onChange={(e) => setIv({ ...iv, half_price: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  SKU Code
                </label>
                <Input
                  value={iv.sku || ""}
                  onChange={(e) => setIv({ ...iv, sku: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Stock Quantity
                </label>
                <Input
                  type="number"
                  value={iv.stock ?? 0}
                  onChange={(e) => setIv({ ...iv, stock: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Category *
                </label>
                <select
                  value={iv.category}
                  onChange={(e) => setIv({ ...iv, category: e.target.value })}
                  className="w-full h-10 px-3 border border-input rounded-md text-sm bg-background"
                >
                  {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Menu Section
                </label>
                <select
                  value={iv.menu_section}
                  onChange={(e) =>
                    setIv({ ...iv, menu_section: e.target.value })
                  }
                  className="w-full h-10 px-3 border border-input rounded-md text-sm bg-background"
                >
                  <option value="">Unassigned</option>
                  {sections.map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Unit (e.g. 1 portion, 1 plate)
                </label>
                <Input
                  value={iv.unit || ""}
                  onChange={(e) => setIv({ ...iv, unit: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Unit Cost (Internal)
                </label>
                <Input
                  type="number"
                  value={iv.unit_cost ?? ""}
                  onChange={(e) => setIv({ ...iv, unit_cost: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Free Bonus Slogan (e.g. Free garlic bread)
                </label>
                <Input
                  value={iv.free_bonus || ""}
                  onChange={(e) => setIv({ ...iv, free_bonus: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">
                  Tags (comma-separated)
                </label>
                <Input
                  value={iv.tags || ""}
                  placeholder="CheesePizza, Spicy"
                  onChange={(e) => setIv({ ...iv, tags: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-muted-foreground">
                  Ingredients / Sub-items list
                </label>
                <Textarea
                  value={iv.sub_items || ""}
                  placeholder="Ricotta / goat cheese / beetroot"
                  onChange={(e) => setIv({ ...iv, sub_items: e.target.value })}
                />
              </div>
            </div>

            {/* Current Cover Image Display */}
            {editItem && editItem.cover_image && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary">
                  Current Cover Image
                </label>
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                  <img
                    src={getMediaUrl(editItem.cover_image)}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-primary block">
                Upload Cover Image{" "}
                <span className="text-[10px] text-muted-foreground font-normal">
                  (Recommended: 200x200 px)
                </span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const img = new Image();
                    img.src = URL.createObjectURL(file);
                    img.onload = () => {
                      URL.revokeObjectURL(img.src);
                      if (
                        Math.abs(img.width - 200) > 30 ||
                        Math.abs(img.height - 200) > 30
                      ) {
                        toast.warning(
                          `Image size warning: selected image is ${img.width}x${img.height}px. Best dimensions for Food Cover are 200x200px.`,
                        );
                      }
                    };
                    setCoverImageFile(file);
                  } else {
                    setCoverImageFile(null);
                  }
                }}
                className="mt-1 block text-xs"
              />
            </div>

            {/* Item media upload & management */}
            {editItem &&
              editItem.item_media &&
              editItem.item_media.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-primary">
                    Current Item Images
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {editItem.item_media.map((med: any) => (
                      <div
                        key={med.id}
                        className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group"
                      >
                        <img
                          src={getMediaUrl(med.image)}
                          alt="Media"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => deleteItemMedia(med.id)}
                          className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div>
              <label className="text-xs font-semibold text-primary block">
                Upload Gallery Images{" "}
                <span className="text-[10px] text-muted-foreground font-normal">
                  (Recommended: 800x600 px)
                </span>
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  files.forEach((file) => {
                    const img = new Image();
                    img.src = URL.createObjectURL(file);
                    img.onload = () => {
                      URL.revokeObjectURL(img.src);
                      if (
                        Math.abs(img.width - 800) > 80 ||
                        Math.abs(img.height - 600) > 80
                      ) {
                        toast.warning(
                          `Image size warning: "${file.name}" is ${img.width}x${img.height}px. Best dimensions for gallery images are 800x600px.`,
                        );
                      }
                    };
                  });
                  setUploadedItemImages(files);
                }}
                className="mt-1 block text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <Switch
                  checked={iv.availability}
                  onCheckedChange={(v) => setIv({ ...iv, availability: v })}
                />
                <span className="text-xs font-medium">Available</span>
              </div>
              <Button onClick={saveItem}>Save Food Item</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* TESTIMONIAL EDIT/ADD DIALOG */}
      <Dialog
        open={testimonialModalOpen}
        onOpenChange={setTestimonialModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editTestimonial ? "Edit Testimonial" : "Add Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">
                Customer Name
              </label>
              <Input
                value={tv.name || ""}
                onChange={(e) => setTv({ ...tv, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">
                Customer Designation
              </label>
              <Input
                value={tv.designation || ""}
                placeholder="CEO / Food Critic"
                onChange={(e) => setTv({ ...tv, designation: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">
                Rating (1 to 5)
              </label>
              <select
                value={tv.rating}
                onChange={(e) =>
                  setTv({ ...tv, rating: Number(e.target.value) })
                }
                className="w-full h-10 px-3 border border-input rounded-md text-sm bg-background"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} Stars
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">
                Review Slogan / Title
              </label>
              <Input
                value={tv.title || ""}
                placeholder="Highly recommended!"
                onChange={(e) => setTv({ ...tv, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">
                Testimonial Feedback Text
              </label>
              <Textarea
                value={tv.text || ""}
                placeholder="The service was outstanding and the chicken was delicious..."
                onChange={(e) => setTv({ ...tv, text: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Switch
                checked={tv.is_active}
                onCheckedChange={(v) => setTv({ ...tv, is_active: v })}
              />
              <span className="text-xs font-medium">Display Active</span>
            </div>
            <Button onClick={saveTestimonial} className="w-full mt-2">
              Save Testimonial
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
