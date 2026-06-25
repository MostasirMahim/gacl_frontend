"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

const venueSchema = Yup.object({
  street_address: Yup.string()
    .min(5, "Street address must be at least 5 characters")
    .required("Street address is required"),
  city: Yup.string()
    .min(3, "City name is too short")
    .required("City is required"),
  state_province: Yup.string().required("State/Province is required"),
  postal_code: Yup.string()
    .min(4, "Postal code must be at least 4 characters")
    .required("Postal code is required"),
  country: Yup.string().required("Country is required"),
});

export function CreateVenueModal() {
  const [open, setOpen] = useState(false);

  const { data: countriesData } = useQuery({
    queryKey: ["eventCountries"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/event/v1/events/countries/");
      return res?.data;
    },
  });
  const countries = countriesData?.data || [];

  const queryClient = useQueryClient();
  const { mutate: createVenues, isPending } = useMutation({
    mutationFn: async (Data: any) => {
      const res = await axiosInstance.post(
        "/api/event/v1/events/venues/",
        Data
      );
      return res.data;
    },
    onSuccess: async (data) => {
      if (data?.status === "success") {
        await queryClient.invalidateQueries({ queryKey: ["getAllVenues"] });
        formik.resetForm();
        setOpen(false);
        toast.success("Venue Created Successfully");
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response.data;
      if (errors) {
         Object.entries(errors).forEach(([field, messages]) => {
          formik.setFieldError(
            field,
            Array.isArray(messages) ? messages[0] : messages
          );
        });
        toast.error(detail || "An error occurred during Added");
      } else {
        toast.error(message || "An error occurred during Added");
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      street_address: "",
      city: "",
      state_province: "",
      postal_code: "",
      country: "",
    },
    validationSchema: venueSchema,
    onSubmit: (values) => {
      createVenues(values);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Venue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Venue</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street_address">Street Address</Label>
            <Input
              id="street_address"
              name="street_address"
              value={formik.values.street_address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="1236 Main St"
            />
            {formik.touched.street_address && formik.errors.street_address && (
              <p className="text-sm text-destructive">
                {formik.errors.street_address}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="New York"
            />
            {formik.touched.city && formik.errors.city && (
              <p className="text-sm text-destructive">{formik.errors.city}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="state_province">State/Province</Label>
              <Input
                id="state_province"
                name="state_province"
                value={formik.values.state_province}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="NY"
              />
              {formik.touched.state_province &&
                formik.errors.state_province && (
                  <p className="text-sm text-destructive">
                    {formik.errors.state_province}
                  </p>
                )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                id="postal_code"
                name="postal_code"
                value={formik.values.postal_code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="10001"
              />
              {formik.touched.postal_code && formik.errors.postal_code && (
                <p className="text-sm text-destructive">
                  {formik.errors.postal_code}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={formik.values.country}
              onValueChange={(v) => formik.setFieldValue("country", v)}
            >
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {countries.map((c: any) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.country && formik.errors.country && (
              <p className="text-sm text-destructive">
                {formik.errors.country}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false), formik.resetForm();
              }}
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
