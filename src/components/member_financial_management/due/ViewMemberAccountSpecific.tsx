"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileText, Printer } from "lucide-react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { BRAND_CONFIG } from "@/config/brand";
import { toast } from "react-toastify";

interface MemberAccountStatementProps {
  data: any;
}

export function MemberAccountStatement({ data }: MemberAccountStatementProps) {
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
    return parseFloat(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getStatusBadge = (balance: string, isActive: boolean) => {
    const balanceNum = parseFloat(balance);

    if (!isActive) {
      return (
        <Badge
          variant="outline"
          className="bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800"
        >
          Inactive
        </Badge>
      );
    } else if (balanceNum > 0) {
      return (
        <Badge
          variant="outline"
          className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
        >
          Credit Balance
        </Badge>
      );
    } else if (balanceNum < 0) {
      return (
        <Badge
          variant="outline"
          className="bg-destructive/10 text-destructive border-destructive/20 dark:border-destructive/40"
        >
          Debit Balance
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
        >
          Zero Balance
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

      pdf.save(`Member-Account-${data.id}-Receipt.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("There was an error generating the PDF. Please try again.");
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div
      ref={pdfRef}
      className="min-h-screen bg-background p-4 md:p-8 flex justify-center items-start"
    >
      <Card className="w-full max-w-3xl shadow-lg border-border bg-card print:shadow-none print:border-0 print:bg-transparent">
        <CardHeader className="pb-3 border-b border-border print:border-b-foreground/20">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{BRAND_CONFIG.brandAbbreviation}</h1>
              <p className="text-sm text-muted-foreground">
                Member Account Summary
              </p>
            </div>
            <div className="text-right">
              <CardTitle className="text-lg">Account Statement</CardTitle>
              <p className="text-xs text-muted-foreground">
                Generated on: {formatDate(new Date().toISOString())}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Account Overview */}
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
                Account Created
              </h2>
              <p className="text-sm text-foreground">
                {formatDate(data.created_at)}
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-sm font-medium text-muted-foreground">
                Account Status
              </h2>
              {getStatusBadge(data.balance, data.is_active)}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">
                Transaction Summary
              </h3>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Credits:</span>
                <span className="font-mono text-green-600 dark:text-green-400">
                  {formatCurrency(data.total_credits)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Debits:</span>
                <span className="font-mono text-rose-600 dark:text-rose-400">
                  {formatCurrency(data.total_debits)}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-border">
                <span className="text-muted-foreground">Net Activity:</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">
                  {formatCurrency(
                    (
                      parseFloat(data.total_credits) -
                      parseFloat(data.total_debits)
                    ).toString()
                  )}
                </span>
              </div>
            </div>

            <div className="space-y-3 bg-muted p-4 rounded-md print:bg-muted/50">
              <h3 className="font-semibold text-foreground">Current Balance</h3>
              <div className="flex justify-between items-center text-lg">
                <span className="text-muted-foreground">Balance:</span>
                <span
                  className={`font-mono font-bold ${
                    parseFloat(data.balance) > 0
                      ? "text-green-600 dark:text-green-400"
                      : parseFloat(data.balance) < 0
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-foreground"
                  }`}
                >
                  {formatCurrency(data.balance)}
                </span>
              </div>

              {parseFloat(data.overdue_amount) > 0 && (
                <div className="flex justify-between text-sm pt-2">
                  <span className="text-muted-foreground">Overdue Amount:</span>
                  <span className="font-mono text-rose-600 dark:text-rose-400">
                    {formatCurrency(data.overdue_amount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm pt-2 border-t border-border">
                <span className="text-muted-foreground">Credit Limit:</span>
                <span className="font-mono text-foreground">
                  {formatCurrency(data.credit_limit)}
                </span>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Account Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Last Transaction
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(data.last_transaction_date)}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Account Updated
              </h3>
              <p className="text-sm text-foreground">
                {formatDate(data.updated_at)}
              </p>
            </div>
          </div>

          {data.notes && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Account Notes
                </h3>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md print:bg-muted/50">
                  {data.notes}
                </p>
              </div>
            </>
          )}

          {/* Empty State for No Activity */}
          {parseFloat(data.total_credits) === 0 &&
            parseFloat(data.total_debits) === 0 && (
              <>
                <Separator className="my-6" />
                <div className="text-center py-8">
                  <div className="bg-muted/50 rounded-lg p-6 max-w-md mx-auto">
                    <h3 className="font-semibold text-foreground mb-2">
                      No Account Activity
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      This account has no transaction history yet.
                    </p>
                  </div>
                </div>
              </>
            )}

          <Separator className="my-6" />

          {/* Action Buttons */}
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
