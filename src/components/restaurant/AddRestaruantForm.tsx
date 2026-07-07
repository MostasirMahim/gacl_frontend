"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  ALargeSmall,
  LocationEdit,
  TowerControl,
  LocateFixed,
  Signpost,
  PhoneCall,
  AlarmClock,
  Shuffle,
  LockKeyholeOpen,
  CircleDollarSign,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/lib/axiosInstance";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Props {
  cuisinesData: any;
  categoriesData: any;
}

export default function AddRestaurantForm({
  cuisinesData,
  categoriesData,
}: Props) {
  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      phone: "",
      operating_hours: "",
      capacity: "",
      status: "",
      opening_time: "",
      closing_time: "",
      booking_fees_per_seat: "",
      cuisine_type: "",
      restaurant_type: "",
      slug: "",
      slogan_1: "",
      slogan_2: "",
      banner_title: "",
      delivery_banner_title: "",
      delivery_banner_text: "",
      reservation_banner_title: "",
      reservation_banner_text: "",
      reservation_banner_launch_menu: "",
      reservation_banner_dinner_menu: "",
      meta_title: "",
      meta_description: "",
      "reset-button-0": "",
      "submit-button-0": "",
    },
  });

  const { setError } = form;

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const cuisines = cuisinesData?.data;
  const categories = categoriesData?.data;

  async function onSubmit(values: any) {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/api/restaurants/v1/restaurants/",
        values
      );
      if (response.status == 201) {
        toast.success("Restaurant added successfully");
        form.reset();
        form.clearErrors();
        router.push("/restaurants/");
        router.refresh();
      }
    } catch (error: any) {
      console.log(error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;

        // Field specific errors
        for (const key in errors) {
          if (key !== "non_field_errors") {
            setError(key as any, {
              type: "server",
              message: errors[key][0],
            });
          }
        }

        // Non-field errors (e.g. general form errors)
        if (errors.non_field_errors) {
          setError("root", {
            type: "server",
            message: errors.non_field_errors.join(" "),
          });
        }
      }
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={onReset}
        className="space-y-8 @container"
      >
        <div className="grid grid-cols-12 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Name</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-0"
                        placeholder="KFC"
                        type="text"
                        id="name"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <ALargeSmall className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Enter restaurant name</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Description </FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Textarea
                      key="textarea-0"
                      id="description"
                      placeholder=""
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter restaurant description
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Address</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-1"
                        placeholder="Dhaka"
                        type="text"
                        id="address"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <LocationEdit className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Enter restaurant address</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">City</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-2"
                        placeholder="Mirpur"
                        type="text"
                        id="city"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <TowerControl className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Enter restaurant city</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">State</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-3"
                        placeholder="Mirpur"
                        type="text"
                        id="state"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <LocateFixed className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Enter restaurant state</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Postal code</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-4"
                        placeholder="6666"
                        type="text"
                        id="postal_code"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <Signpost className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter restaurant postal code
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Phone</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-5"
                        placeholder="01748888***"
                        type="text"
                        id="phone"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <PhoneCall className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Enter phone number</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="operating_hours"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Operating hours</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-6"
                        placeholder="8"
                        type="text"
                        id="operating_hours"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <AlarmClock className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Enter operation hours</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Capacity</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-7"
                        placeholder="50"
                        type="text"
                        id="capacity"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <Shuffle className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter capacity of the restaurant
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Status</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-8"
                        placeholder="open"
                        type="text"
                        id="status"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <LockKeyholeOpen className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter status of restaurant open or close
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="opening_time"
            render={({ field }) => (
              <FormItem className="col-span-12 flex flex-col gap-2 items-start">
                <FormLabel className="flex shrink-0">Opening time</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <input
                      type="time"
                      step="1" // allows seconds
                      {...field}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </FormControl>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="closing_time"
            render={({ field }) => (
              <FormItem className="col-span-12 flex flex-col gap-2 items-start">
                <FormLabel className="flex shrink-0">Closing time</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <input
                      type="time"
                      step="1" // allows seconds
                      {...field}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </FormControl>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="booking_fees_per_seat"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">
                  Booking fees per seat
                </FormLabel>
                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-9"
                        placeholder="100"
                        type="text"
                        id="booking_fees_per_seat"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <CircleDollarSign className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Booking fees per seat</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cuisine_type"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Cuisine type</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Select
                      key="select-0"
                      {...field}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full ">
                        <SelectValue placeholder="select cuisine type" />
                      </SelectTrigger>
                      <SelectContent>
                        {cuisines?.map((cuisine: any) => (
                          <SelectItem
                            key={`${cuisine.id}`}
                            value={`${cuisine.id}`}
                          >
                            {cuisine.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select restaurant cuisine type
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="restaurant_type"
            rules={{ required: true }}
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Restaurant type</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Select
                      key="select-1"
                      {...field}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full ">
                        <SelectValue placeholder="select restaurant type" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: any) => (
                          <SelectItem
                            key={category.id}
                            value={`${category.id}`}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Select restaurant type</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* New Fields */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-6 flex flex-col gap-2 space-y-0 items-start">
                <FormLabel>Restaurant Slug (URL part)</FormLabel>
                <div className="w-full">
                  <FormControl>
                    <Input placeholder="kfc-dhaka" type="text" {...field} />
                  </FormControl>
                  <FormDescription>Unique URL slug (e.g. kfc-dhaka)</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slogan_1"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-6 flex flex-col gap-2 space-y-0 items-start">
                <FormLabel>Slogan 1</FormLabel>
                <div className="w-full">
                  <FormControl>
                    <Input placeholder="Fresh and Hot" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slogan_2"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-6 flex flex-col gap-2 space-y-0 items-start">
                <FormLabel>Slogan 2</FormLabel>
                <div className="w-full">
                  <FormControl>
                    <Input placeholder="Best chicken in town" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="banner_title"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-6 flex flex-col gap-2 space-y-0 items-start">
                <FormLabel>Hero Banner Title</FormLabel>
                <div className="w-full">
                  <FormControl>
                    <Input placeholder="Welcome to KFC" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="delivery_banner_title"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-6 flex flex-col gap-2 space-y-0 items-start">
                <FormLabel>Delivery Banner Title</FormLabel>
                <div className="w-full">
                  <FormControl>
                    <Input placeholder="30 Minutes Delivery!" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="delivery_banner_text"
            render={({ field }) => (
              <FormItem className="col-span-12 flex flex-col gap-2 space-y-0 items-start">
                <FormLabel>Delivery Banner Description</FormLabel>
                <div className="w-full">
                  <FormControl>
                    <Textarea placeholder="A relaxing and pleasant atmosphere..." {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reservation_banner_title"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-6 flex flex-col gap-2 space-y-0 items-start">
                <FormLabel>Reservation Banner Title</FormLabel>
                <div className="w-full">
                  <FormControl>
                    <Input placeholder="Reservation Your Favorite Private Table" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reservation_banner_text"
            render={({ field }) => (
              <FormItem className="col-span-12 flex flex-col gap-2 space-y-0 items-start">
                <FormLabel>Reservation Banner Description</FormLabel>
                <div className="w-full">
                  <FormControl>
                    <Textarea placeholder="Enjoy a nice dinner..." {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reservation_banner_launch_menu"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-6 flex flex-col gap-2 space-y-0 items-start">
                <FormLabel>Lunch Menu Subtitle / Stats</FormLabel>
                <div className="w-full">
                  <FormControl>
                    <Input placeholder="30+ items" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reservation_banner_dinner_menu"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-6 flex flex-col gap-2 space-y-0 items-start">
                <FormLabel>Dinner Menu Subtitle / Stats</FormLabel>
                <div className="w-full">
                  <FormControl>
                    <Input placeholder="50+ items" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="meta_title"
            render={({ field }) => (
              <FormItem className="col-span-12 md:col-span-6 flex flex-col gap-2 space-y-0 items-start">
                <FormLabel>SEO Meta Title</FormLabel>
                <div className="w-full">
                  <FormControl>
                    <Input placeholder="KFC Dhaka - Best Fried Chicken" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="meta_description"
            render={({ field }) => (
              <FormItem className="col-span-12 flex flex-col gap-2 space-y-0 items-start">
                <FormLabel>SEO Meta Description</FormLabel>
                <div className="w-full">
                  <FormControl>
                    <Textarea placeholder="Order chicken online from KFC Dhaka..." {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reset-button-0"
            render={({ field }) => (
              <FormItem className="col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="hidden shrink-0">Reset</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Button
                      key="reset-button-0"
                      id="reset-button-0"
                      name=""
                      className="w-full"
                      type="reset"
                      variant="outline"
                    >
                      Reset
                    </Button>
                  </FormControl>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="submit-button-0"
            render={({ field }) => (
              <FormItem className="col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="hidden shrink-0">Submit</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Button
                      key="submit-button-0"
                      id="submit-button-0"
                      name=""
                      className="w-full"
                      type="submit"
                      variant="default"
                      disabled={loading}
                    >
                      {loading ? "loading..." : "submit"}
                    </Button>
                  </FormControl>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
