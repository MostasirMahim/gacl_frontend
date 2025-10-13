import EmailGroupsTable from "@/components/bulk_mail/EmailGroupsTable";
import { Button } from "@/components/ui/button";
import RefreshButton from "@/components/utils/RefreshButton";
import axiosInstance from "@/lib/axiosInstance";
import { CirclePlus } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";

async function EmailGroupsPage() {
  const cookieStore = cookies();
  const authToken = cookieStore.get("access_token")?.value || "";
  let responseData = {};
  try {
    const { data } = await axiosInstance.get(`/api/mails/v1/email/groups/`, {
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
    <div>
      <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
        <div>
          <h2 className="font-bold text-3xl">Groups List</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <div>
            <RefreshButton />
          </div>
          <Button variant="outline">
            <Link href="/emails/groups/add/">
              <span className="flex items-center justify-center gap-1">
                <CirclePlus /> Add Group
              </span>
            </Link>
          </Button>
        </div>
      </div>
      <EmailGroupsTable data={responseData} />
    </div>
  );
}

export default EmailGroupsPage;
