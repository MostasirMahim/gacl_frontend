"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingDots } from "@/components/ui/loading";
import { ArrowLeft, Receipt, Printer, Download } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { BRAND_CONFIG } from "@/config/brand";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { useRef } from "react";
import { useParams } from "next/navigation";

export default function PortalInvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const pdfRef = useRef<HTMLDivElement>(null);

  const { data: invoice, isLoading } = useQuery({
    queryKey: ["portalInvoiceDetail", params.id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/member/v1/portal/invoices/${params.id}/`);
      return res.data?.data;
    },
  });

  if (isLoading) {
    return <LoadingDots />;
  }

  if (!invoice) {
    return (
      <Card className="p-10 text-center text-muted-foreground">
        Invoice not found.
      </Card>
    );
  }

  // Flatten the items to easily map them in the table
  const allItems: { name: string; quantity: number; price: string; total: string }[] = [];
  
  if (invoice.invoice_items) {
    invoice.invoice_items.forEach((itemWrapper: any) => {
      if (itemWrapper.restaurant_items) {
        itemWrapper.restaurant_items.forEach((item: any) => {
           allItems.push({
             name: item.menu_item?.item_name || "Food Item",
             quantity: item.quantity,
             price: item.price,
             total: item.total_price || (item.quantity * item.price).toString()
           });
        });
      }
      if (itemWrapper.event_tickets) {
        itemWrapper.event_tickets.forEach((item: any) => {
           allItems.push({
             name: `Event Ticket: ${item.ticket_name}`,
             quantity: 1, // Event ticket entries are usually individual or handled per qty
             price: item.price,
             total: item.price
           });
        });
      }
      if (itemWrapper.products) {
        itemWrapper.products.forEach((item: any) => {
           allItems.push({
             name: item.product?.name || "Product",
             quantity: item.quantity,
             price: item.price,
             total: item.total_price || (item.quantity * item.price).toString()
           });
        });
      }
      if (itemWrapper.facility) {
        itemWrapper.facility.forEach((item: any) => {
           allItems.push({
             name: `Facility Booking: ${item.facility?.name || "Facility"}`,
             quantity: 1,
             price: item.price,
             total: item.price
           });
        });
      }
    });
  }

  const handleDownloadPDF = async () => {
    if (!invoice) return;

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
      doc.text(`#${invoice.invoice_number}`, 195, 30, { align: "right" });
      
      // Billed To & Details
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("BILLED TO", 14, 50);
      doc.setFont("helvetica", "normal");
      doc.text(invoice.member || "Member", 14, 55);
      
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE DETAILS", 195, 50, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.text(`Type: ${invoice.invoice_type}`, 195, 55, { align: "right" });
      doc.text(`Date: ${invoice.issue_date ? format(new Date(invoice.issue_date), "MMM d, yyyy") : "N/A"}`, 195, 60, { align: "right" });
      const statusText = invoice.is_full_paid ? "PAID" : "UNPAID";
      doc.text(`Status: ${statusText}`, 195, 65, { align: "right" });
      
      // Table
      const tableColumn = ["Item Description", "Qty", "Unit Price", "Total"];
      const tableRows: any[] = [];
      
      if (allItems.length > 0) {
        allItems.forEach(item => {
          tableRows.push([
            item.name,
            item.quantity,
            item.price,
            item.total
          ]);
        });
      } else {
        tableRows.push(["No items found for this invoice", "", "", ""]);
      }
      
      autoTable(doc, {
        startY: 75,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
      });
      
      // Footer Totals
      const finalY = (doc as any).lastAutoTable.finalY || 75;
      
      doc.setFont("helvetica", "bold");
      doc.text("Subtotal:", 140, finalY + 10);
      doc.text(`BDT ${invoice.total_amount}`, 195, finalY + 10, { align: "right" });
      
      if (Number(invoice.discount) > 0) {
        doc.text("Discount:", 140, finalY + 16);
        doc.text(`- BDT ${invoice.discount}`, 195, finalY + 16, { align: "right" });
        
        doc.text("Paid Amount:", 140, finalY + 22);
        doc.text(`BDT ${invoice.paid_amount || "0.00"}`, 195, finalY + 22, { align: "right" });
        
        doc.text("Balance Due:", 140, finalY + 30);
        doc.text(`BDT ${invoice.balance_due}`, 195, finalY + 30, { align: "right" });
      } else {
        doc.text("Paid Amount:", 140, finalY + 16);
        doc.text(`BDT ${invoice.paid_amount || "0.00"}`, 195, finalY + 16, { align: "right" });
        
        doc.text("Balance Due:", 140, finalY + 24);
        doc.text(`BDT ${invoice.balance_due}`, 195, finalY + 24, { align: "right" });
      }
      
      doc.save(`Invoice-${invoice.invoice_number}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("There was an error generating the PDF. Please try again.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link href="/portal/bills" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit whitespace-nowrap">
          <ArrowLeft className="w-4 h-4" /> Back to Bills
        </Link>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Button variant="outline" className="gap-2 flex-1 sm:flex-none" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Print
          </Button>
          <Button onClick={handleDownloadPDF} className="gap-2 flex-1 sm:flex-none">
            <Download className="w-4 h-4" /> Download PDF
          </Button>
        </div>
      </div>

      <Card ref={pdfRef} className="p-8 md:p-12 print:shadow-none print:border-none print:p-0 bg-card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border/60 pb-8 mb-8 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-tight">INVOICE</h1>
              <p className="text-muted-foreground font-medium">#{invoice.invoice_number}</p>
            </div>
          </div>
          <div className="text-left md:text-right">
            <h3 className="font-semibold text-lg">{BRAND_CONFIG.companyName}</h3>
            <p className="text-sm text-muted-foreground max-w-xs mt-1">
              {BRAND_CONFIG.addressLine1}
              <br />
              {BRAND_CONFIG.contactEmail}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-sm text-muted-foreground mb-1 uppercase font-semibold tracking-wider">Billed To</p>
            <p className="font-semibold text-lg">{invoice.member}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm text-muted-foreground mb-1 uppercase font-semibold tracking-wider">Invoice Details</p>
            <p className="text-sm"><span className="font-medium">Type:</span> {invoice.invoice_type}</p>
            <p className="text-sm"><span className="font-medium">Date:</span> {invoice.issue_date ? format(new Date(invoice.issue_date), "MMM d, yyyy") : "N/A"}</p>
            <p className="text-sm">
              <span className="font-medium">Status:</span> 
              <span className={`ml-2 inline-flex font-semibold ${
                invoice.is_full_paid ? "text-green-600" : "text-amber-600"
              }`}>
                {invoice.is_full_paid ? "PAID" : "UNPAID"}
              </span>
            </p>
          </div>
        </div>

        <div className="w-full overflow-x-auto mb-8">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-y border-border/60">
              <tr>
                <th className="py-3 px-4 font-semibold w-[50%]">Item Description</th>
                <th className="py-3 px-4 font-semibold text-center">Qty</th>
                <th className="py-3 px-4 font-semibold text-right">Unit Price</th>
                <th className="py-3 px-4 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {allItems.length > 0 ? (
                allItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{item.name}</td>
                    <td className="py-3 px-4 text-center text-muted-foreground">{item.quantity}</td>
                    <td className="py-3 px-4 text-right text-muted-foreground">{item.price}</td>
                    <td className="py-3 px-4 text-right font-medium">{item.total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 px-4 text-center text-muted-foreground italic">
                    No items found for this invoice.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-end w-full">
          <div className="w-full max-w-sm space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">BDT {invoice.total_amount}</span>
            </div>
            {Number(invoice.discount) > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span className="font-medium">- BDT {invoice.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Paid Amount</span>
              <span className="font-medium">BDT {invoice.paid_amount || "0.00"}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-4 border-t border-border/60">
              <span>Balance Due</span>
              <span>BDT {invoice.balance_due}</span>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/60 text-center text-xs text-muted-foreground">
          <p>Thank you for being a valued member of {BRAND_CONFIG.companyName}.</p>
          <p>If you have any questions about this invoice, please contact the club administration.</p>
        </div>
      </Card>
    </div>
  );
}
