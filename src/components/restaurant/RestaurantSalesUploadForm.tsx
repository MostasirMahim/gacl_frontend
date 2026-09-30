"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  Store,
  Wallet,
  ArrowRight,
  Info,
} from "lucide-react";

interface Props {
  incomeParticular: any;
  receivedFrom: any;
  restaurant: any;
}

export default function RestaurantSalesUploadForm({
  incomeParticular,
  receivedFrom,
  restaurant,
}: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    defaultValues: {
      restaurant: "",
      income_particular: "",
      received_from: "",
    },
  });

  const incomeParticularOptions = incomeParticular?.data || [];
  const receivedFromOptions = receivedFrom?.data || [];
  const restaurantOptions = restaurant?.data || [];

  function handleFileChange(files: FileList | null) {
    if (files && files[0]) {
      const file = files[0];
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ];
      if (
        !validTypes.includes(file.type) &&
        !file.name.endsWith(".xlsx") &&
        !file.name.endsWith(".xls") &&
        !file.name.endsWith(".csv")
      ) {
        toast.error("Please upload an Excel (.xlsx, .xls) or CSV file");
        return;
      }
      setSelectedFile(file);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }

  function removeFile() {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function onSubmit(values: any) {
    if (!values.restaurant) {
      return toast.error("Please select a restaurant venue");
    }
    if (!values.income_particular) {
      return toast.error("Please select an income particular");
    }
    if (!values.received_from) {
      return toast.error("Please select a received from option");
    }
    if (!selectedFile) {
      return toast.error("Please select an Excel sales spreadsheet to upload");
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("restaurant", values.restaurant);
      formData.append("income_particular", values.income_particular);
      formData.append("received_from", values.received_from);
      formData.append("excel_file", selectedFile);

      const response = await axiosInstance.post(
        "/api/restaurants/v1/restaurants/upload/excel",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("Restaurant sales records uploaded & synced successfully!");
        form.reset();
        removeFile();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to process sales upload. Check your Excel file schema."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Main Upload Form (8 Cols) */}
      <div className="lg:col-span-8 bg-card rounded-2xl border border-border/60 p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Sales Data Ingestion
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Select venue parameters and drop your compiled spreadsheet below.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Parameters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Target Restaurant */}
              <FormField
                control={form.control}
                name="restaurant"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-primary" /> Target Venue
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-9 text-xs bg-muted/30 border-border/60">
                          <SelectValue placeholder="Select restaurant" />
                        </SelectTrigger>
                        <SelectContent>
                          {restaurantOptions.map((item: any) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Income Particular */}
              <FormField
                control={form.control}
                name="income_particular"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <Wallet className="w-3.5 h-3.5 text-blue-500" /> Income Particular
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-9 text-xs bg-muted/30 border-border/60">
                          <SelectValue placeholder="Select particular" />
                        </SelectTrigger>
                        <SelectContent>
                          {incomeParticularOptions.map((item: any) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Received From */}
              <FormField
                control={form.control}
                name="received_from"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Received From
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-9 text-xs bg-muted/30 border-border/60">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          {receivedFromOptions.map((item: any) => (
                            <SelectItem key={item.id} value={String(item.id)}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Drag & Drop Zone */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Excel Spreadsheet File
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : selectedFile
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-border/70 hover:border-primary/50 hover:bg-muted/30"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                  onChange={(e) => handleFileChange(e.target.files)}
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">
                        {selectedFile.name}
                      </h4>
                      <p className="text-xs text-muted-foreground font-mono">
                        {(selectedFile.size / 1024).toFixed(1)} KB — Ready to upload
                      </p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile();
                      }}
                      className="gap-1.5 text-xs h-7 text-red-500 hover:text-red-700"
                    >
                      <X className="w-3.5 h-3.5" /> Remove file
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-sm text-foreground">
                        Drag and drop your sales spreadsheet
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        or click anywhere to browse from your device
                      </p>
                    </div>
                    <span className="text-[11px] text-muted-foreground/80 font-mono">
                      Supports .xlsx, .xls, and .csv formats
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  form.reset();
                  removeFile();
                }}
                className="h-9 px-4 text-xs"
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={uploading || !selectedFile}
                className="h-9 px-6 text-xs font-bold gap-2 shadow-xs"
              >
                {uploading ? (
                  "Processing Upload..."
                ) : (
                  <>
                    <UploadCloud className="w-3.5 h-3.5" /> Upload & Sync Sales
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Guidelines & Schema Sidebar (4 Cols) */}
      <div className="lg:col-span-4 space-y-4">
        {/* Expected Format Card */}
        <div className="bg-card rounded-2xl border border-border/60 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-sm text-foreground">
              Expected Spreadsheet Schema
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Make sure your Excel sheet contains the following standard columns for automatic parsing:
          </p>

          <div className="space-y-2 font-mono text-[11px]">
            <div className="p-2 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-between">
              <span className="font-semibold text-foreground">Date</span>
              <span className="text-muted-foreground">YYYY-MM-DD</span>
            </div>
            <div className="p-2 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-between">
              <span className="font-semibold text-foreground">Item Name</span>
              <span className="text-muted-foreground">e.g. Club Steak</span>
            </div>
            <div className="p-2 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-between">
              <span className="font-semibold text-foreground">Quantity</span>
              <span className="text-muted-foreground">Integer (e.g. 5)</span>
            </div>
            <div className="p-2 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-between">
              <span className="font-semibold text-foreground">Unit Price</span>
              <span className="text-muted-foreground">Amount in ৳</span>
            </div>
            <div className="p-2 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-between">
              <span className="font-semibold text-foreground">Total Sale</span>
              <span className="text-muted-foreground">Amount in ৳</span>
            </div>
          </div>
        </div>

        {/* Sync Guarantee Card */}
        <div className="bg-muted/30 rounded-2xl border border-border/50 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Automated Ledger Sync
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Uploaded sales are verified and posted into Member Financial accounts and restaurant income balances automatically upon completion.
          </p>
        </div>
      </div>
    </div>
  );
}
