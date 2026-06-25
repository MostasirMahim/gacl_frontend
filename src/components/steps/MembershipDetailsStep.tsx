"use client";
import type React from "react";
import { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronRight, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import useGetAllChoice from "@/hooks/data/useGetAllChoice";
import axiosInstance from "@/lib/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { LoadingCard, LoadingDots } from "../ui/loading";
import { useAddMemberStore } from "@/store/store";
import { toast } from "react-toastify";
import useGetMember from "@/hooks/data/useGetMember";
import { getNames } from "country-list";
import { ImageViewer } from "../utils/ImageViewer";

const validationSchema = Yup.object({
  member_ID: Yup.string().required("Member ID is required"),
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string(),
  gender: Yup.string().required("Gender is required"),
  date_of_birth: Yup.date().required("Date of birth is required"),
  institute_name: Yup.string().required("Institute name is required"),
  batch_number: Yup.string().required("Batch number is required"),
  membership_status: Yup.string().required("Membership status is required"),
  membership_type: Yup.string().required("Membership type is required"),
  marital_status: Yup.string().required("Marital status is required"),
  anniversary_date: Yup.date()
    .nullable()
    .when("marital_status", {
      is: (val: string) =>
        !!val && val.toString().toLowerCase().includes("married"),
      then: (schema) => schema.required("Anniversary date is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  profile_photo: Yup.mixed().required("Profile picture is required"),
  blood_group: Yup.string().required("Blood group is required"),
  nationality: Yup.string().required("Nationality is required"),
});
const validationSchemaForUpdate = Yup.object({
  member_ID: Yup.string().required("Member ID is required"),
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string(),
  gender: Yup.string().required("Gender is required"),
  date_of_birth: Yup.date().required("Date of birth is required"),
  institute_name: Yup.string().required("Institute name is required"),
  batch_number: Yup.string().required("Batch number is required"),
  membership_status: Yup.string().required("Membership status is required"),
  membership_type: Yup.string().required("Membership type is required"),
  marital_status: Yup.string().required("Marital status is required"),
  anniversary_date: Yup.date()
    .nullable()
    .when("marital_status", {
      is: (val: string) =>
        !!val && val.toString().toLowerCase().includes("married"),
      then: (schema) => schema.required("Anniversary date is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  profile_photo: Yup.mixed().nullable(),
  blood_group: Yup.string().required("Blood group is required"),
  nationality: Yup.string().required("Nationality is required"),
});

export default function MembershipDetailsStep() {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const countries = getNames();
  const {
    currentStep,
    nextStep,
    markStepCompleted,
    setMemberID,
    memberID,
    isUpdateMode,
  } = useAddMemberStore();
  const querClient = useQueryClient();
  const { data: choiceSections, isLoading } = useGetAllChoice();
  const { data, isLoading: isLoadingMember } = useGetMember(memberID, {
    enabled: isUpdateMode && !!memberID,
  });

  const { member_info: memberData } = data ?? {};
  const {
    membership_type,
    institute_name,
    gender,
    membership_status,
    marital_status,
  } = choiceSections ?? {};

  const handleImageClick = (image: any) => {
    setSelectedImage(image);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedImage(null);
  };

  const { mutate: generateID, isPending } = useMutation({
    mutationFn: async (userData: any) => {
      const res = await axiosInstance.post(
        `/api/member/v1/members/get_latest_id/`,
        userData
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        const member_ID = data?.data?.next_available;
        if (member_ID) {
          formik.setFieldValue("member_ID", member_ID);
          setMemberID(member_ID);
        }
        toast.success("Member ID added successfully");
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response.data;
      if (errors) {
        if (errors && typeof errors === "object") {
          Object.entries(errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              formik.setFieldError(field, messages[0]);
            }
          });
          toast.error(detail || message || "Generate ID Failed");
        }
      } else {
        toast.error(detail || message || "Generate ID Failed");
      }
    },
  });
  const { mutate: createMember, isPending: isPendingMember } = useMutation({
    mutationFn: async (userData: any) => {
      const formData = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        formData.append(key, value as any);
      });

      const res = await axiosInstance.post(
        `/api/member/v1/members/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        querClient.invalidateQueries({ queryKey: ["useGetMember", memberID] });
        toast.success(
          data.message || "Membership has been successfully added."
        );
        markStepCompleted(currentStep);
        nextStep();
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response.data;
      console.log(errors);
      if (errors && typeof errors === "object") {
        Object.entries(errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            formik.setFieldError(field, messages[0]);
          }
        });
        toast.error(message || detail || "Validation failed.");
      } else {
        toast.error(
          detail || message || "An error occurred during submission."
        );
      }
    },
  });
  const { mutate: updateMember, isPending: isUpdating } = useMutation({
    mutationFn: async (userData: any) => {
      const formData = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        if (value != null) {
          formData.append(key, value as any);
        }
      });
      const res = await axiosInstance.patch(
        `/api/member/v1/members/${memberID}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    },
    onSuccess: async (data) => {
      if (data?.status === "success") {
        const routes = 3;
        const page = 2;
        await querClient.invalidateQueries({
          queryKey: ["getAllMembers", page, routes],
        });
        toast.success(data.message || "Membership Updated Successfully.");
        markStepCompleted(currentStep);
        nextStep();
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response.data;
      console.log(errors);
      if (errors && typeof errors === "object") {
        Object.entries(errors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            formik.setFieldError(field, messages[0]);
          }
        });
        toast.error(message || detail || "Validation failed.");
      } else {
        toast.error(
          detail || message || "An error occurred during submission."
        );
      }
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      isUpdateMode && memberData
        ? {
            id: memberData.id,
            member_ID: memberData.member_ID || "",
            first_name: memberData.first_name || "",
            last_name: memberData.last_name || "",
            gender: memberData.gender?.name || "",
            date_of_birth: memberData.date_of_birth || null,
            institute_name: memberData.institute_name?.name || "",
            batch_number: memberData.batch_number || "",
            membership_status: memberData.membership_status?.name || "",
            membership_type: memberData.membership_type?.name || "",
            marital_status: memberData.marital_status?.name || "",
            anniversary_date: memberData.anniversary_date || null,
            profile_photo: null as File | null,
            blood_group: memberData.blood_group || "",
            nationality: memberData.nationality || "Bangladesh",
          }
        : {
            member_ID: "",
            first_name: "",
            last_name: "",
            gender: "",
            date_of_birth: null as Date | null,
            institute_name: "",
            batch_number: "",
            membership_status: "",
            membership_type: "",
            marital_status: "",
            anniversary_date: null as Date | null,
            profile_photo: null as File | null,
            blood_group: "",
            nationality: "Bangladesh",
          },
    validationSchema: isUpdateMode
      ? validationSchemaForUpdate
      : validationSchema,
    onSubmit: (values) => {
      if (isUpdateMode) {
        if (values.id) {
          updateMember(values);
        } else {
          toast.error("Updation ID not found");
        }
      } else {
        createMember(values);
      }
    },
  });

  const handleFieldChangeAndGenerateID = (fieldName: string, value: string) => {
    formik.setFieldValue(fieldName, value);
    const otherFieldValue =
      fieldName === "membership_type"
        ? formik.values.institute_name
        : formik.values.membership_type;
    const currentFieldValue = value?.trim();
    const otherFieldTrimmed = otherFieldValue?.trim();

    if (
      currentFieldValue &&
      currentFieldValue !== "" &&
      otherFieldTrimmed &&
      otherFieldTrimmed !== "" &&
      !isUpdateMode
    ) {
      const data = {
        membership_type:
          fieldName === "membership_type"
            ? value
            : formik.values.membership_type,
        institute_name:
          fieldName === "institute_name" ? value : formik.values.institute_name,
      };
      generateID(data);
    }
  };

  const imgRef = useRef<HTMLInputElement>(null);
  const handleProfilePictureUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) return;
    if (file) {
      formik.setFieldValue("profile_photo", file);
    }
  };

  const handleSkip = () => {
    nextStep();
  };

  const handleSaveAndExit = () => {
    formik.resetForm();
  };

  //TODO: When reload the page still choices are not loaded.
  if (isLoading && isLoadingMember) {
    return <LoadingCard />;
  }
  return (
    <div className="">
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="member_ID" className="text-sm font-medium">
                Member ID
              </Label>
              <Input
                id="member_ID"
                name="member_ID"
                disabled
                value={formik.values.member_ID}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full"
                readOnly
              />
              {formik.touched.member_ID && formik.errors.member_ID && (
                <p className="text-sm text-red-600">
                  {formik.errors.member_ID as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium ">Membership Type</Label>
              <Select
                disabled={isUpdateMode}
                value={formik.values.membership_type}
                onValueChange={(value) =>
                  handleFieldChangeAndGenerateID("membership_type", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Membership Type" />
                </SelectTrigger>
                <SelectContent>
                  {membership_type?.map((choice: any, index: number) => (
                    <SelectItem key={index} value={choice.name}>
                      {choice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.membership_type &&
                formik.errors.membership_type && (
                  <p className="text-sm text-red-600">
                    {formik.errors.membership_type as string}
                  </p>
                )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Institute Name</Label>
              <Select
                disabled={isUpdateMode}
                value={formik.values.institute_name}
                onValueChange={(value) =>
                  handleFieldChangeAndGenerateID("institute_name", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose Institute" />
                </SelectTrigger>
                <SelectContent>
                  {institute_name?.map((choice: any, index: number) => (
                    <SelectItem key={index} value={choice.name}>
                      {choice.name} - {choice.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.institute_name &&
                formik.errors.institute_name && (
                  <p className="text-sm text-red-600">
                    {formik.errors.institute_name as string}
                  </p>
                )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-sm font-medium">
                First Name
              </Label>
              <Input
                id="first_name"
                name="first_name"
                value={formik.values.first_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter first name"
                className="w-full"
              />
              {formik.touched.first_name && formik.errors.first_name && (
                <p className="text-sm text-red-600">
                  {formik.errors.first_name as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-sm font-medium">
                Last Name
              </Label>
              <Input
                id="last_name"
                name="last_name"
                value={formik.values.last_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter last name"
                className="w-full"
              />
              {formik.touched.last_name && formik.errors.last_name && (
                <p className="text-sm text-red-600">
                  {formik.errors.last_name as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Gender</Label>
              <Select
                value={formik.values.gender}
                onValueChange={(value) => formik.setFieldValue("gender", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Gender">
                    {formik.values.gender
                      ? gender?.find(
                          (choice: any) => choice.id == formik.values.gender
                        )?.name
                      : "Choose Gender"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {gender?.map((choice: any, index: number) => (
                    <SelectItem key={index} value={choice.name}>
                      {choice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.gender && formik.errors.gender && (
                <p className="text-sm text-red-600">
                  {formik.errors.gender as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Profile Picture</Label>
                {isUpdateMode && (
                  <p
                    className="text-sm text-gray-500 pr-5 cursor-pointer hover:text-indigo-500"
                    onClick={() => handleImageClick(memberData?.profile_photo)}
                  >
                    {memberData?.profile_photo?.split("/").pop()}
                  </p>
                )}
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-background">
                <input
                  ref={imgRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                />
                {formik.values.profile_photo ? (
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">
                      {formik.values.profile_photo
                        ? formik.values.profile_photo?.name
                        : "No file chosen"}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        formik.setFieldValue("profile_photo", null)
                      }
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => imgRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                )}
              </div>
              {formik.touched.profile_photo && formik.errors.profile_photo && (
                <p className="text-sm text-red-600">
                  {formik.errors.profile_photo as string}
                </p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background border-2 border-border",
                      !formik.values.date_of_birth && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formik.values.date_of_birth
                      ? format(formik.values.date_of_birth, "PPP")
                      : "Select Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={
                      formik.values.date_of_birth
                        ? new Date(formik.values.date_of_birth)
                        : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        const formatted = format(date, "yyyy-MM-dd");
                        formik.setFieldValue("date_of_birth", formatted);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {formik.touched.date_of_birth && formik.errors.date_of_birth && (
                <p className="text-sm text-red-600">
                  {formik.errors.date_of_birth as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Membership Status</Label>
              <Select
                value={formik.values.membership_status}
                onValueChange={(value) =>
                  formik.setFieldValue("membership_status", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="What's Member Status?" />
                </SelectTrigger>
                <SelectContent>
                  {membership_status?.map((choice: any, index: number) => (
                    <SelectItem key={index} value={choice.name}>
                      {choice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.membership_status &&
                formik.errors.membership_status && (
                  <p className="text-sm text-red-600">
                    {formik.errors.membership_status as string}
                  </p>
                )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch_number" className="text-sm font-medium">
                Batch Number
              </Label>
              <Input
                id="batch_number"
                name="batch_number"
                value={formik.values.batch_number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter batch year"
                className="w-full"
              />
              {formik.touched.batch_number && formik.errors.batch_number && (
                <p className="text-sm text-red-600">
                  {formik.errors.batch_number as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Marital Status</Label>
              <Select
                value={formik.values.marital_status}
                onValueChange={(value) =>
                  formik.setFieldValue("marital_status", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="What's Marital Status?" />
                </SelectTrigger>
                <SelectContent>
                  {marital_status?.map((choice: any, index: number) => (
                    <SelectItem key={index} value={choice.name}>
                      {choice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.marital_status &&
                formik.errors.marital_status && (
                  <p className="text-sm text-red-600">
                    {formik.errors.marital_status as string}
                  </p>
                )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Anniversary Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background border-2 border-border",
                      !formik.values.anniversary_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formik.values.anniversary_date
                      ? format(formik.values.anniversary_date, "PPP")
                      : "Select Date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={
                      formik.values.anniversary_date
                        ? new Date(formik.values.anniversary_date)
                        : undefined
                    }
                    onSelect={(date) => {
                      if (date) {
                        const formatted = format(date, "yyyy-MM-dd");
                        formik.setFieldValue("anniversary_date", formatted);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {formik.touched.anniversary_date &&
                formik.errors.anniversary_date && (
                  <p className="text-sm text-red-600">
                    {formik.errors.anniversary_date as string}
                  </p>
                )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Blood Group</Label>
              <Select
                value={formik.values.blood_group}
                onValueChange={(value) =>
                  formik.setFieldValue("blood_group", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="What is his/her blood type?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.blood_group && formik.errors.blood_group && (
                <p className="text-sm text-red-600">
                  {formik.errors.blood_group as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nationality</Label>
              <Select
                value={formik.values.nationality}
                onValueChange={(value) =>
                  formik.setFieldValue("nationality", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Nationality" />
                </SelectTrigger>
                <SelectContent>
                  {countries?.map((name: any, index: number) => (
                    <SelectItem key={index} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.nationality && formik.errors.nationality && (
                <p className="text-sm text-red-600">
                  {formik.errors.nationality as string}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <div className="flex gap-3 flex-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSaveAndExit()}
              className="flex-1 sm:flex-none"
            >
              Reset
            </Button>
            {isUpdateMode && (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSkip()}
                className="flex-1 sm:flex-none "
              >
                Skip
              </Button>
            )}
          </div>
          <Button
            type="submit"
            disabled={isPendingMember || isUpdating}
            className="flex-1 sm:flex-none sm:min-w-[140px]"
          >
            {isPendingMember || isUpdating ? "Saving..." : "Save & Next"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </form>
      <ImageViewer
        image={selectedImage}
        isOpen={isViewerOpen}
        onClose={handleCloseViewer}
      />
    </div>
  );
}
