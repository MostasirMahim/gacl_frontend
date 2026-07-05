"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DollarSignIcon,
  FileText,
  Printer,
  Download,
  ChevronLeft,
  CalendarClock,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { BRAND_CONFIG } from "@/config/brand";
import Link from "next/link";

interface InvoiceItem {
  products?: { name: string; sku: string }[];
  restaurant_items?: { name: string }[];
  facility?: { name: string }[];
  event_tickets?: { name: string }[];
}

interface Invoice {
  invoice_number: string;
  invoice_type: string;
  generated_by: string;
  member: string;
  restaurant?: string | null;
  event?: string | null;
  issue_date: string;
  due_date?: string | null;
  status: string;
  is_full_paid?: boolean;
  invoice_items?: InvoiceItem[];
  total_amount: string;
  paid_amount: string;
  balance_due: string;
  discount: string;
  promo_code: string;
  tax?: string | null;
  currency: string;
  excel_upload_date?: string | null;
  created_at: string;
  updated_at: string;
}

interface Props {
  invoice: Invoice;
}

interface Props2 {
  data: any;
}

export default function InvoiceComponent({ data }: Props2) {
  const pdfRef = useRef<HTMLDivElement>(null);
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getStatusBadge = (status: string, isFullPaid: boolean) => {
    if (isFullPaid || status.toLowerCase() === "paid") {
      return (
        <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
          Paid
        </Badge>
      );
    } else if (parseFloat(data.balance_due) > 0) {
      return (
        <Badge className="bg-destructive/10 text-destructive border-destructive/20 dark:border-destructive/40">
          Due: {formatCurrency(data.balance_due)} {data.currency}
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
        >
          {status || "Pending"}
        </Badge>
      );
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleDownloadPDF = async () => {
    if (!data) return;

    try {
      const doc = new jsPDF();

      // Add Company Info (Top Left)
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(BRAND_CONFIG.companyName, 14, 22);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(BRAND_CONFIG.addressLine1, 14, 30);
      doc.text(BRAND_CONFIG.contactEmail, 14, 35);

      // Add Invoice Title (Top Right)
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", 195, 22, { align: "right" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`#${data.invoice_number}`, 195, 30, { align: "right" });

      // Billed To & Details
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("BILLED TO", 14, 50);
      doc.setFont("helvetica", "normal");
      doc.text(data.member || "Member", 14, 55);

      doc.setFont("helvetica", "bold");
      doc.text("INVOICE DETAILS", 195, 50, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.text(`Type: ${data.invoice_type}`, 195, 55, { align: "right" });
      doc.text(`Issue Date: ${formatDate(data.issue_date)}`, 195, 60, {
        align: "right",
      });
      doc.text(`Due Date: ${formatDate(data.due_date)}`, 195, 65, {
        align: "right",
      });
      const statusText = data.is_full_paid ? "PAID" : "UNPAID";
      doc.text(`Status: ${statusText}`, 195, 70, { align: "right" });

      // Table
      const tableColumn = ["Item Details", "Total Amount"];
      const tableRows: any[] = [];

      if (hasItems) {
        data.invoice_items.forEach((item: any) => {
          let details = "";
          if (item.restaurant_items && item.restaurant_items.length > 0) {
            details +=
              "Restaurant: " +
              item.restaurant_items.map((r: any) => r.name).join(", ") +
              "\n";
          }
          if (item.products && item.products.length > 0) {
            details +=
              "Products: " +
              item.products.map((p: any) => p.name).join(", ") +
              "\n";
          }
          if (item.facility && item.facility.length > 0) {
            details +=
              "Facility: " +
              item.facility.map((f: any) => f.name).join(", ") +
              "\n";
          }
          if (item.event_tickets && item.event_tickets.length > 0) {
            details +=
              "Events: " +
              item.event_tickets.map((e: any) => e.name).join(", ") +
              "\n";
          }
          if (!details) {
            details = "General Item";
          }
          tableRows.push([
            details.trim(),
            item.total_amount ? `BDT ${item.total_amount}` : "",
          ]);
        });
      } else {
        tableRows.push(["No items found on this invoice", ""]);
      }

      autoTable(doc, {
        startY: 80,
        head: [tableColumn],
        body: tableRows,
        theme: "striped",
        headStyles: { fillColor: [41, 128, 185] },
      });

      // Footer Totals
      const finalY = (doc as any).lastAutoTable.finalY || 80;

      doc.setFont("helvetica", "bold");
      doc.text("Total Amount:", 140, finalY + 10);
      doc.text(`BDT ${data.total_amount}`, 195, finalY + 10, {
        align: "right",
      });

      if (Number(data.discount) > 0) {
        doc.text("Discount:", 140, finalY + 16);
        doc.text(`- BDT ${data.discount}`, 195, finalY + 16, {
          align: "right",
        });

        doc.text("Paid Amount:", 140, finalY + 22);
        doc.text(`BDT ${data.paid_amount || "0.00"}`, 195, finalY + 22, {
          align: "right",
        });

        doc.text("Balance Due:", 140, finalY + 30);
        doc.text(`BDT ${data.balance_due}`, 195, finalY + 30, {
          align: "right",
        });
      } else {
        doc.text("Paid Amount:", 140, finalY + 16);
        doc.text(`BDT ${data.paid_amount || "0.00"}`, 195, finalY + 16, {
          align: "right",
        });

        doc.text("Balance Due:", 140, finalY + 24);
        doc.text(`BDT ${data.balance_due}`, 195, finalY + 24, {
          align: "right",
        });
      }

      doc.save(`Invoice-${data.invoice_number}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("There was an error generating the PDF. Please try again.");
    }
  };

  const hasItems = data.invoice_items && data.invoice_items.length > 0;

  return (
    <div
      ref={pdfRef}
      className="min-h-screen bg-background p-4 md:p-8 flex justify-center items-start"
    >
      <Card className="w-full max-w-4xl shadow-lg border-border bg-card print:shadow-none print:border-0 print:bg-transparent">
        {/* Invoice Header */}
        <CardHeader className="pb-4 border-b border-border print:border-b-foreground/20">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {BRAND_CONFIG.brandAbbreviation}
              </h1>
              <p className="text-sm text-muted-foreground">Official Invoice</p>
            </div>
            <div className="text-right">
              <CardTitle className="text-2xl font-bold text-foreground">
                #{data.invoice_number}
              </CardTitle>
              <p className="text-sm text-muted-foreground">invoice number</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Invoice Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Issued To
              </h3>
              <p className="text-foreground font-medium">{data.member}</p>
              <p className="text-sm text-muted-foreground">Member</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Invoice Details
              </h3>
              <p className="text-sm text-foreground">
                <span className="font-medium">Type:</span> {data.invoice_type}
              </p>
              <p className="text-sm text-foreground">
                <span className="font-medium">Issue Date:</span>{" "}
                {formatDate(data.issue_date)}
              </p>
              <p className="text-sm text-foreground">
                <span className="font-medium">Due Date:</span>{" "}
                {formatDate(data.due_date)}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Status
              </h3>
              <div className="mb-2">
                {getStatusBadge(data.status, data.is_full_paid)}
              </div>
              <p className="text-sm text-muted-foreground">
                Generated by: {data.generated_by}
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Invoice Items - Redesigned */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 border-b pb-2">
              Invoice Items
            </h3>

            {!hasItems ? (
              <p className="text-muted-foreground text-center py-8">
                No items found on this invoice.
              </p>
            ) : (
              <div className="space-y-4">
                {data.invoice_items.map((item: any, index: number) => (
                  <motion.div
                    key={item.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="border border-border p-4 rounded-lg hover:shadow-md transition-shadow duration-300 bg-muted/30"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Restaurant Items */}
                      {item.restaurant_items.length > 0 && (
                        <div>
                          <h4 className="font-medium text-foreground mb-2">
                            Restaurant Items
                          </h4>
                          <ul className="space-y-1">
                            {item.restaurant_items.map((r: any) => (
                              <li
                                key={r.id}
                                className="text-sm text-muted-foreground"
                              >
                                • {r.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Products */}
                      {item.products.length > 0 && (
                        <div>
                          <h4 className="font-medium text-foreground mb-2">
                            Products
                          </h4>
                          <ul className="space-y-1">
                            {item.products.map((p: any) => (
                              <li
                                key={p.id}
                                className="text-sm text-muted-foreground"
                              >
                                • {p.name} {p.sku && `(SKU: ${p.sku})`}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Facility */}
                      {item.facility.length > 0 && (
                        <div>
                          <h4 className="font-medium text-foreground mb-2">
                            Facility
                          </h4>
                          <ul className="space-y-1">
                            {item.facility.map((f: any) => (
                              <li
                                key={f.id}
                                className="text-sm text-muted-foreground"
                              >
                                • {f.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Event Tickets */}
                      {item.event_tickets.length > 0 && (
                        <div>
                          <h4 className="font-medium text-foreground mb-2">
                            Event Tickets
                          </h4>
                          <ul className="space-y-1">
                            {item.event_tickets.map((e: any) => (
                              <li
                                key={e.id}
                                className="text-sm text-muted-foreground"
                              >
                                • {e.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <Separator className="my-6" />

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Billing Summary</h3>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-mono text-foreground">
                  {formatCurrency(data.total_amount)} {data.currency}
                </span>
              </div>

              {parseFloat(data.discount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Discount ({data.promo_code}):
                  </span>
                  <span className="font-mono text-green-600 dark:text-green-400">
                    -{formatCurrency(data.discount)} {data.currency}
                  </span>
                </div>
              )}

              {data.tax && parseFloat(data.tax) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax:</span>
                  <span className="font-mono text-foreground">
                    {formatCurrency(data.tax)} {data.currency}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3 bg-muted p-4 rounded-md print:bg-muted/50">
              <h3 className="font-semibold text-foreground">Amount Summary</h3>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-mono font-bold text-foreground">
                  {formatCurrency(data.total_amount)} {data.currency}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="font-mono text-green-600 dark:text-green-400">
                  {formatCurrency(data.paid_amount)} {data.currency}
                </span>
              </div>

              {parseFloat(data.balance_due) > 0 && (
                <div className="flex justify-between text-sm pt-2 border-t border-border">
                  <span className="text-muted-foreground">Balance Due:</span>
                  <span className="font-mono text-rose-600 dark:text-rose-400">
                    {formatCurrency(data.balance_due)} {data.currency}
                  </span>
                </div>
              )}

              {data.is_full_paid && (
                <div className="flex justify-between text-sm pt-2 border-t border-border">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <span className="font-mono text-green-600 dark:text-green-400 font-medium">
                    Fully Paid
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Footer Notes */}
          <div className="text-center text-xs text-muted-foreground mt-8">
            <p>Thank you for your business!</p>
            <p className="mt-1">
              Invoice generated on {formatDate(data.created_at)}
            </p>
            {data.excel_upload_date && (
              <p className="mt-1">
                Uploaded to accounting system on{" "}
                {formatDate(data.excel_upload_date)}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <Separator className="my-6" />
          <div className="flex justify-end gap-2 pt-4 print:hidden">
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <FileText className="h-4 w-4" />
              Save PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>

            <Link href={`/mfm/payment_invoice?id=${data.id}`}>
              <Button size="sm" className="gap-1">
                <DollarSignIcon />
                Pay Invoice
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
