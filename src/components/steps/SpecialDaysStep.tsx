"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronRight, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { useAddMemberStore } from "@/store/store";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import useGetMember from "@/hooks/data/useGetMember";
import { useRouter } from "next/navigation";

const validationSchema = Yup.object({
  data: Yup.array()
    .of(
      Yup.object({
        title: Yup.string().required("Special day title is required"),
        date: Yup.date().required("Special day date is required"),
      })
    )
    .min(1, "At least one special day is required"),
});

const initialValues = {
  data: [
    {
      title: "",
      date: null as Date | null,
    },
  ],
};

export default function SpecialDaysStep() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { currentStep, nextStep, markStepCompleted, memberID, isUpdateMode } =
    useAddMemberStore();

  const { data, isLoading: isLoadingMember } = useGetMember(memberID, {
    enabled: isUpdateMode && !!memberID,
  });
  const { special_days: memberData } = data ?? {};

  const { mutate: addSpecialDayFunc, isPending } = useMutation({
    mutationFn: async (userData: any) => {
      const res = await axiosInstance.post(
        `/api/member/v1/members/special_day/`,
        userData
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        formik.resetForm();
        toast.success(
          data.message || "Special day has been successfully added."
        );
        markStepCompleted(currentStep);
        router.push("/members/view");
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response?.data || {};
      if (errors?.data && Array.isArray(errors.data)) {
        const contactsErrors = errors.data;
        contactsErrors.forEach((contactErrorObj: any, contactIndex: number) => {
          if (contactErrorObj && typeof contactErrorObj === "object") {
            for (const [fieldName, messages] of Object.entries(
              contactErrorObj
            )) {
              if (Array.isArray(messages) && messages.length > 0) {
                const fieldPath = `data.${contactIndex}.${fieldName}`;
                formik.setFieldError(fieldPath, messages[0]);
              }
            }
          }
        });
      }
      if (errors && typeof errors === "object") {
        const otherErrorKeys = Object.keys(errors).filter(
          (key) => key !== "data"
        );

        if (otherErrorKeys.length > 0) {
          const firstKey = otherErrorKeys[0];
          const messages = errors[firstKey];

          if (Array.isArray(messages) && messages.length > 0) {
            toast.error(messages[0]);
            return;
          }
        }
      }

      toast.error(detail || message || "Submission Failed");
    },
  });

  const { mutate: updateSpecialDayFunc, isPending: isUpdating } = useMutation({
    mutationFn: async (userData: any) => {
      const res = await axiosInstance.patch(
        `/api/member/v1/members/special_day/${memberID}/`,
        userData
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["useGetMember", memberID] });
        toast.success(data.message || "Special day successfully updated.");
        markStepCompleted(currentStep);
        router.push("/members/view");
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response?.data || {};
      if (errors?.data && Array.isArray(errors.data)) {
        const contactsErrors = errors.data;
        contactsErrors.forEach((contactErrorObj: any, contactIndex: number) => {
          if (contactErrorObj && typeof contactErrorObj === "object") {
            for (const [fieldName, messages] of Object.entries(
              contactErrorObj
            )) {
              if (Array.isArray(messages) && messages.length > 0) {
                const fieldPath = `data.${contactIndex}.${fieldName}`;
                formik.setFieldError(fieldPath, messages[0]);
              }
            }
          }
        });
      }
      if (errors && typeof errors === "object") {
        const otherErrorKeys = Object.keys(errors).filter(
          (key) => key !== "data"
        );

        if (otherErrorKeys.length > 0) {
          const firstKey = otherErrorKeys[0];
          const messages = errors[firstKey];

          if (Array.isArray(messages) && messages.length > 0) {
            toast.error(messages[0]);
            return;
          }
        }
      }
      toast.error(detail || message || "Submission Failed");
    },
  });

  const { mutate: deleteSpecialDayFunc, isPending: isDeleting } = useMutation({
    mutationFn: async (userData: any) => {
      const res = await axiosInstance.delete(
        `/api/member/v1/members/special_day/${memberID}/`,
        { data: userData }
      );
      return res.data;
    },
    onSuccess: async (data) => {
      if (data?.status === "success") {
        await queryClient.invalidateQueries({ queryKey: ["useGetMember", memberID] });
        toast.success(data.message || "Special day successfully deleted.");
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response?.data || {};
      if (errors?.data && Array.isArray(errors.data)) {
        const contactsErrors = errors.data;
        contactsErrors.forEach((contactErrorObj: any, contactIndex: number) => {
          if (contactErrorObj && typeof contactErrorObj === "object") {
            for (const [fieldName, messages] of Object.entries(
              contactErrorObj
            )) {
              if (Array.isArray(messages) && messages.length > 0) {
               toast.error(messages[0]);
              }
            }
          }
        });
      }
      if (errors && typeof errors === "object") {
        const otherErrorKeys = Object.keys(errors).filter(
          (key) => key !== "data"
        );

        if (otherErrorKeys.length > 0) {
          const firstKey = otherErrorKeys[0];
          const messages = errors[firstKey];

          if (Array.isArray(messages) && messages.length > 0) {
            toast.error(messages[0]);
            return;
          }
        }
      }

      toast.error(detail || message || "Submission Failed");
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      isUpdateMode && memberData && memberData?.length > 0
        ? {
            data: memberData?.map((s: any) => ({
              id: s.id || 0,
              title: s.title || "",
              date: s.date ? s.date : null,
            })),
          }
        : initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (!memberID) {
        toast.error("No Member ID found.");
        return;
      }
      const data = {
        member_ID: memberID,
        data: values.data,
      };
      if (isUpdateMode) {
        updateSpecialDayFunc(data);
      } else {
        addSpecialDayFunc(data);
      }
    },
  });

  const addSpecialDay = () => {
    const newSpecialDay = {
      title: "",
      date: null as Date | null,
    };
    const updatedSpecialDays = [...formik.values.data, newSpecialDay];
    formik.setFieldValue("data", updatedSpecialDays);
  };

  const removeSpecialDay = (index: number) => {
    const data = formik.values.data[index];
    if (!data?.id) {
      const updated = formik.values.data.filter(
        (_: any, i: any) => i !== index
      );
      formik.setFieldValue("data", updated);
      return;
    }

    deleteSpecialDayFunc({ id: data.id });
  };

  const updateSpecialDay = (index: number, field: string, value: any) => {
    formik.setFieldValue(`data.${index}.${field}`, value);
  };


  const handleSkip = () => {
    // Special Days is the final step. Skipping should complete the
    // add-member flow (or close the update flow) rather than calling
    // nextStep(), which does nothing on the last step and leaves the
    // user stuck with a "failed to complete" state.
    markStepCompleted(currentStep);
    if (isUpdateMode) {
      toast.success("Special days skipped.");
    } else {
      toast.success("Member created successfully.");
    }
    router.push("/members/view");
  };

  const handleSaveAndExit = () => {
    formik.resetForm();
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {formik.values.data.map((specialDay: any, index: number) => (
          <div key={index} className="border rounded-lg p-4 space-y-4 relative">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-primary">
                  Special Day {index + 1}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSpecialDay(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            <div className="grid gap-4 md:grid-cols-1">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Special Day Title
                </Label>
                <Input
                  placeholder="Special Day Name"
                  value={specialDay.title}
                  onChange={(e) =>
                    updateSpecialDay(index, "title", e.target.value)
                  }
                  onBlur={formik.handleBlur}
                  name={`data.${index}.title`}
                  className="w-full"
                />
                {(formik.touched.data as any[])?.[index]?.title &&
                  (formik.errors.data as any[])?.[index]?.title && (
                    <p className="text-sm text-red-600">
                      {(formik.errors.data as any[])?.[index]?.title}
                    </p>
                  )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Select Special Day
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !specialDay.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {specialDay.date
                        ? format(specialDay.date, "PPP")
                        : "Choose date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      captionLayout="dropdown"
                      selected={
                        formik.values.data[index].date
                          ? new Date(formik.values.data[index].date)
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          const formattedDate = format(date, "yyyy-MM-dd");
                          updateSpecialDay(index, "date", formattedDate);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {(formik.touched.data as any[])?.[index]?.date &&
                  (formik.errors.data as any[])?.[index]?.date && (
                    <p className="text-sm text-red-600">
                      {(formik.errors.data as any[])?.[index]?.date}
                    </p>
                  )}
              </div>
            </div>
          </div>
        ))}

        {/* Add Another Button */}
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addSpecialDay}
            className="gap-2 bg-transparent"
          >
            <Plus className="w-4 h-4" />
            Add Another
          </Button>
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
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSkip()}
            className="flex-1 sm:flex-none"
          >
            Skip
          </Button>
        </div>
        <Button
          type="submit"
          disabled={isPending || isUpdating}
          className="flex-1 sm:flex-none sm:min-w-[140px]"
        >
          {isPending || isUpdating ? "Saving..." : "Save & Next"}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </form>
  );
}
