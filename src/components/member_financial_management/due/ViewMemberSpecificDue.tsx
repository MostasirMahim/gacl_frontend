"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileText, Download, Printer, Check } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { BRAND_CONFIG } from "@/config/brand";
import { useRef } from "react";

interface MemberDueStatementProps {
  data: any;
}

export function MemberDueStatement({ data }: MemberDueStatementProps) {
  const pdfRef = useRef<HTMLDivElement>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Updated Badges to use semantic colors for dark mode
  const getStatusBadge = (isPaid: boolean, overdueAmount: string) => {
    if (isPaid) {
      return (
        <Badge
          variant="outline"
          className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
        >
          Paid
        </Badge>
      );
    } else if (parseFloat(overdueAmount) > 0) {
      return (
        <Badge
          variant="outline"
          className="bg-destructive/10 text-destructive border-destructive/20 dark:border-destructive/40"
        >
          Overdue
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800"
        >
          Pending
        </Badge>
      );
    }
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;

    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      const pdf = new jsPDF("p", "mm", "a4");
      let position = 0;

      pdf.addImage(
        imgData,
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        "FAST"
      );
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          "FAST"
        );
        heightLeft -= pageHeight;
      }

      pdf.save(`Due-${data.id}-Receipt.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("There was an error generating the PDF. Please try again.");
    }
  };

  return (
    <div
      ref={pdfRef}
      className="min-h-screen bg-background p-4 md:p-8 flex justify-center items-start"
    >
      {/* Card uses border and background semantic colors */}
      <Card className="w-full max-w-3xl shadow-lg border-border bg-card">
        {/* Header - Uses border and text semantic colors */}
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{BRAND_CONFIG.brandAbbreviation}</h1>
              <p className="text-sm text-muted-foreground">
                Member Financial Statement
              </p>
            </div>
            <div className="text-right">
              <CardTitle className="text-lg">Due Details Statement</CardTitle>
              <p className="text-xs text-muted-foreground">
                Generated on: {formatDate(new Date().toISOString())}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Member & Status Summary */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                Member ID
              </h2>
              <p className="text-lg font-mono font-semibold text-foreground">
                {data.member}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-muted-foreground">
                Invoice #
              </h2>
              <p className="text-lg font-mono font-semibold text-foreground">
                {data.due_reference.invoice}
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-sm font-medium text-muted-foreground">
                Status
              </h2>
              {getStatusBadge(data.is_due_paid, data.overdue_amount)}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Charges</h3>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Original Amount:</span>
                <span className="font-mono text-foreground">
                  {data.due_reference.original_amount}{" "}
                  {data.due_reference.currency}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Paid:</span>
                <span className="font-mono text-green-600 dark:text-green-400">
                  {data.amount_paid} {data.due_reference.currency}
                </span>
              </div>
            </div>

            {/* Balance Summary uses muted background */}
            <div className="space-y-2 bg-muted p-4 rounded-md">
              <h3 className="font-semibold text-foreground">Balance Summary</h3>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount Due:</span>
                <span className="font-mono text-foreground">
                  {data.amount_due} {data.due_reference.currency}
                </span>
              </div>
              {parseFloat(data.overdue_amount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Overdue Amount:</span>
                  <span className="font-mono text-destructive">
                    {data.overdue_amount} {data.due_reference.currency}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-semibold mt-2 pt-2 border-t border-border">
                <span className="text-foreground">Total Outstanding:</span>
                <span className="font-mono text-foreground">
                  {data.amount_due} {data.due_reference.currency}
                </span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Due Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Due Date</h3>
              <p className="text-sm text-foreground">
                {formatDate(data.due_date)}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Last Payment Date
              </h3>
              <p className="text-sm text-muted-foreground">
                {data.payment_date
                  ? formatDate(data.payment_date)
                  : "No payments recorded"}
              </p>
            </div>
          </div>

          {/* Notes (if any) - Uses muted background */}
          {data.notes && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {data.notes}
                </p>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <Separator className="my-6" />
          <div className="flex justify-end gap-2 pt-4">
            <Button
              onClick={handleDownloadPDF}
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <FileText className="h-4 w-4" />
              Save PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Link href={`/mfm/pay_member_due/${data.id}`}>
              <Button variant="outline" size="sm" className="gap-1">
                <Check className="h-4 w-4" />
                Pay due
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
