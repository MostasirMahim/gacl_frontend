import EmailAddToGroupForm from "@/components/bulk_mail/AddEmailToGroup";
import axiosInstance from "@/lib/axiosInstance";
import { cookies } from "next/headers";

async function AddEmailToGroupPage() {
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
    <div className="w-full h-full space-y-4">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Add Email to Group
          </h1>
          <p className="mt-2 text-muted-foreground">
            Email to add to group.
          </p>
        </div>

      <div>
        <EmailAddToGroupForm data={responseData} />
      </div>
    </div>
  );
}

export default AddEmailToGroupPage;
