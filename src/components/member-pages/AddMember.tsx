"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

import ContactDetailsStep from "../steps/ContactDetailsStep";
import CompanionDetailsStep from "../steps/CompanionDetailsStep";
import EmergencyContactStep from "../steps/EmergencyContactStep";
import CertificateDetailsStep from "../steps/CertificateDetailsStep";
import DocumentDetailsStep from "../steps/DocumentDetailsStep";
import EmailDetailsStep from "../steps/EmailDetailsStep";
import AddressDetailsStep from "../steps/AddressDetailsStep";
import SpouseDetailsStep from "../steps/SpouseDetailsStep";
import MembershipDetailsStep from "../steps/MembershipDetailsStep";
import DescendantsDetailsStep from "../steps/DescendantsDetailsStep";
import SpecialDaysStep from "../steps/SpecialDaysStep";
import { useAddMemberStore } from "@/store/store";
import JobDetailsStep from "../steps/JobDetailsStep";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { toast } from "react-toastify";

const stepTitles = [
  { full: "Membership Details", short: "Membership" },
  { full: "Member Contact Details", short: "Contact" },
  { full: "Member Emails Details", short: "Email" },
  { full: "Member Address Details", short: "Address" },
  { full: "Member Spouse Details", short: "Spouse" },
  { full: "Member Descendants Details", short: "Descendants" },
  { full: "Member Companion Details", short: "Companion" },
  { full: "Member Emergency Contact Details", short: "Emergency" },
  { full: "Member Documents Details", short: "Documents" },
  { full: "Member Certificate Details", short: "Certificate" },
  { full: "Member Job Details", short: "Job" },
  { full: "Member Special Days", short: "Special Days" },
];

export default function AddMember() {
  const {
    currentStep,
    completedSteps,
    totalSteps,
    memberID,
    setCurrentStep,
    setMemberID,
    setIsUpdateMode,
    resetSteps,
  } = useAddMemberStore();

  const path = usePathname();
  const isUpdatePage = path?.startsWith("/member/update/");

  useEffect(() => {
    if (path?.startsWith("/member/update/")) {
      const memberIdFromPath = path.split("/").pop();
      if (memberIdFromPath && memberIdFromPath !== memberID) {
        setMemberID(memberIdFromPath);
        setIsUpdateMode(true);
      }
    }
  }, [path, memberID, setMemberID, setIsUpdateMode]);

  useEffect(() => {
    return () => {
      setMemberID("");
      resetSteps();
      if (!path?.startsWith("/member/update/")) {
        setIsUpdateMode(false);
      }
    };
  }, [path, setMemberID, setIsUpdateMode]);

  const handleStepClick = (stepIndex: number) => {
    if (isUpdatePage) {
      setCurrentStep(stepIndex);
    } else {
      if (!completedSteps.includes(0)) {
        toast.error("Please complete the first step.");
        return;
      }
      if (completedSteps.includes(stepIndex)) {
        toast.error("Already Completed Step.");
      } else {
        setCurrentStep(stepIndex);
      }
    }
  };
  const renderStep = () => {
    const stepComponents = [
      <MembershipDetailsStep key="membership" />,
      <ContactDetailsStep key="contact" />,
      <EmailDetailsStep key="email" />,
      <AddressDetailsStep key="address" />,
      <SpouseDetailsStep key="spouse" />,
      <DescendantsDetailsStep key="descendants" />,
      <CompanionDetailsStep key="companion" />,
      <EmergencyContactStep key="emergency" />,
      <DocumentDetailsStep key="document" />,
      <CertificateDetailsStep key="certificate" />,
      <JobDetailsStep key="job" />,
      <SpecialDaysStep key="special-days" />,
    ];
    return stepComponents[currentStep];
  };

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="text-foreground">
      <div className="mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">
              {isUpdatePage ? (
                <p>
                  Update Member{" "}
                  <span className="font-secondary text-lg text-primary">
                    {memberID && "#" + memberID}
                  </span>
                </p>
              ) : (
                <p>
                  Add New Member{" "}
                  <span className="font-secondary text-lg text-primary">
                    {memberID && "#" + memberID}
                  </span>
                </p>
              )}
            </h1>
  
              {isUpdatePage ? (
                <p className="text-muted-foreground">
                 Update Member Informations.
                </p>
              ) : (
                <p className="text-muted-foreground">
                 Add New Member Informations.
                </p>
              )}
  
            </div>
            <Badge variant="default" className="text-sm">
              Step {currentStep + 1} of {totalSteps}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{stepTitles[currentStep].full}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          <div className="flex justify-between mt-4 overflow-x-auto">
            <TooltipProvider>
              {stepTitles.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center space-y-1 min-w-0 flex-1 cursor-pointer transition-colors ${
                    index <= currentStep
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => handleStepClick(index)}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                          completedSteps.includes(index)
                            ? "bg-green-500 text-white"
                            : index === currentStep
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/30 text-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        {completedSteps.includes(index) ? "✓" : index + 1}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.full}</p>
                    </TooltipContent>
                  </Tooltip>
                  <span className="hidden sm:block text-xs text-center truncate w-full px-1">
                    {item.short}
                  </span>
                </div>
              ))}
            </TooltipProvider>
          </div>
        </div>
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-primary">
              {stepTitles[currentStep].full}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">{renderStep()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
