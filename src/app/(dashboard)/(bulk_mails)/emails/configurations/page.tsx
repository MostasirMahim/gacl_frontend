import EmailConfigTable from "@/components/bulk_mail/EmailConfigTable";
import { Button } from "@/components/ui/button";
import RefreshButton from "@/components/utils/RefreshButton";
import axiosInstance from "@/lib/axiosInstance";
import { MailPlus } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import React, { Suspense } from "react";

async function EmailConfigPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  let responseData = {};
  try {
    const { data } = await axiosInstance.get(`/api/mails/v1/configs/`, {
      headers: {
        Cookie: `access_token=${authToken}`,
      },
    });
    responseData = data;
  } catch (error: any) {
    console.log("Error occurred");
    console.log(error.response.data);
    const errorMsg = error?.response?.data?.message || "Something went wrong";
    throw new Error(errorMsg);
  }

  return (
    <div className="w-full bg-background overflow-y-auto">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-4 p-2">
        <div>
          <h2 className="font-bold text-2xl sm:text-3xl">Email configurations</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <div>
            <RefreshButton />
          </div>
          <Button variant="outline" >
            <Link href="/emails/configurations/add/">
              <span className="flex items-center justify-center gap-1">
                <MailPlus /> Create configurations
              </span>
            </Link>
          </Button>
        </div>
      </div>
      <EmailConfigTable data={responseData} />
    </div>
  );
}

export default EmailConfigPage;
