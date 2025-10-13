"use client";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";

import useGetChoices from "@/hooks/data/useGetChoices";
import { LoadingDots } from "@/components/ui/loading";
import { toast } from "react-toastify";

interface ChoiceItem {
  id: string;
  name: string;
  code?: string;
}

interface ChoiceSection {
  title: string;
  slug: string;
  component: string;
  items: ChoiceItem[];
  hasCode?: boolean;
}
type Slug = keyof typeof apiMap;
type hasCode = {
  hasCode: boolean;
};

const apiMap = {
  membership_type: "/api/core/v1/membership_type/",
  institute_name: "/api/core/v1/institute_name/",
  gender: "/api/core/v1/gender/",
  membership_status: "/api/core/v1/member_ship_status_choice/",
  marital_status: "/api/core/v1/marital_status_choice/",
  employment_type: "/api/core/v1/employment_type_choice/",
  email_type: "/api/core/v1/email_type_choice/",
  contact_type: "/api/core/v1/contact_type_choice/",
  address_type: "/api/core/v1/address_type_choice/",
  document_type: "/api/core/v1/document_type_choice/",
  spouse_status_choice: "/api/core/v1/spouse_status_type_choice/",
  descendant_relation_choice: "/api/core/v1/descendant_relation_type_choice/",
} as const;

export default function ManageChoicesPage() {
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    sectionIndex: -1,
    title: "",
  });
  function getApiEndpoint(slug: Slug): string {
    return apiMap[slug];
  }
  const queryClient = useQueryClient();
  const { data: CHOICES, isLoading } = useGetChoices();
  const [sections, setSections] = useState<ChoiceSection[]>([]);
  useEffect(() => {
    if (CHOICES) {
      setSections(CHOICES);
    }
  }, [CHOICES]);

  const { mutate: addChoice, isPending } = useMutation({
    mutationFn: async ({ slug, formData }: { slug: Slug; formData: any }) => {
      const endpoint = getApiEndpoint(slug);
      if (!endpoint) {
        toast.error("Endpoint not found");
        return;
      }
      const res = await axiosInstance.post(`${endpoint}`, formData);
      return res.data;
    },
    onSuccess: async(data) => {
      if (data?.status === "success") {
        await queryClient.invalidateQueries({ queryKey: ["getChoices"] });
        toast.success("Choice Added Successfully");
      }
    },
    onError: (error: any) => {
      console.log("error", error?.response);
      const { message, errors, detail } = error?.response.data;
      if (errors) {
        const allErrors = Object.values(errors).flat().join("\n");
        toast.error(allErrors || "An error occurred during Choice Added");
      } else {
        toast.error(message || "An error occurred during Choice Added");
      }
    },
  });


  const FORMIK_COUNT: hasCode[] = [
    { hasCode: false },
    { hasCode: false },
    { hasCode: true },
    { hasCode: false },
    { hasCode: false },
    { hasCode: false },
    { hasCode: false },
    { hasCode: false },
    { hasCode: false },
    { hasCode: false },
    { hasCode: false },
    { hasCode: false },
  ];
  const formiks = FORMIK_COUNT.map((section) =>
    useFormik({
      initialValues: {
        name: "",
        code: section.hasCode ? "" : undefined,
      },
      onSubmit: () => {},
    })
  );

  const handleAddClick = (sectionIndex: number) => {
    const section = sections[sectionIndex];
    setConfirmDialog({
      isOpen: true,
      sectionIndex,
      title: section.title,
    });
  };

  const handleConfirm = (sectionIndex: number) => {
    const section = sections[sectionIndex];
    const formik = formiks[sectionIndex];
    const formData = formik.values;

    addChoice({
      slug: section.slug as Slug,
      formData: formData,
    });

    formik.resetForm();
    setConfirmDialog({ isOpen: false, sectionIndex: -1, title: "" });
  };
  if (isLoading) return <LoadingDots />;
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 ">
          <h1 className="text-3xl font-bold tracking-tight">
            Manage All Choices
          </h1>
          <p className="mt-2 text-muted-foreground">
            Add and manage different types of choices for the membership system
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 ">
          {sections.map((section, sectionIndex) => (
            <Card key={section.slug} className="shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-bold">
                  {section.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2 max-h-[250px]  overflow-y-auto">
                  {section.items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No items found
                    </p>
                  ) : (
                    section.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.name}</span>
                          {item.code && (
                            <Badge variant="secondary" className="text-xs">
                              {item.code}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex  gap-2">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder={`Enter new ${section.title.toLowerCase()} name`}
                      value={formiks[sectionIndex].values.name}
                      onChange={(e) =>
                        formiks[sectionIndex].setFieldValue(
                          "name",
                          e.target.value
                        )
                      }
                    />
                    {section.hasCode && (
                      <Input
                        placeholder={`Enter new ${section.title.toLowerCase()} code`}
                        value={formiks[sectionIndex].values.code || ""}
                        onChange={(e) =>
                          formiks[sectionIndex].setFieldValue(
                            "code",
                            e.target.value
                          )
                        }
                      />
                    )}
                  </div>
                  <Button
                    onClick={() => handleAddClick(sectionIndex)}
                    className="self-end"
                    disabled={isPending}
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <AlertDialog
          open={confirmDialog.isOpen}
          onOpenChange={(open) =>
            !open &&
            setConfirmDialog({ isOpen: false, sectionIndex: -1, title: "" })
          }
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Addition</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to add this new{" "}
                {confirmDialog.title.toLowerCase()}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleConfirm(confirmDialog.sectionIndex)}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
