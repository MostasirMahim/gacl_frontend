"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GenerateRunForm from "@/components/payroll/GenerateRunForm";
import PayrollRunsList from "@/components/payroll/PayrollRunsList";
import SalaryStructureForm from "@/components/payroll/SalaryStructureForm";
import SalaryComponentForm from "@/components/payroll/SalaryComponentForm";

export default function PayrollPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Payroll</h1>
      <Tabs defaultValue="runs">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="runs">Payroll Runs</TabsTrigger>
          <TabsTrigger value="generate">Generate Run</TabsTrigger>
          <TabsTrigger value="structures">Salary Structure</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </TabsList>
        <TabsContent value="runs" className="mt-4">
          <PayrollRunsList />
        </TabsContent>
        <TabsContent value="generate" className="mt-4">
          <GenerateRunForm />
        </TabsContent>
        <TabsContent value="structures" className="mt-4">
          <SalaryStructureForm />
        </TabsContent>
        <TabsContent value="components" className="mt-4">
          <SalaryComponentForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
