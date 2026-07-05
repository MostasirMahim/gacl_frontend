"use client";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { Card } from "@/components/ui/card";
import { LoadingDots } from "@/components/ui/loading";
import { User, Phone, Mail, Droplet, MapPin, Calendar, CreditCard } from "lucide-react";
import Image from "next/image";

export default function PortalProfilePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["portalProfile"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/member/v1/portal/me/");
      return res.data?.data;
    },
  });

  if (isLoading) {
    return <LoadingDots />;
  }

  if (!profile) {
    return (
      <Card className="p-10 text-center text-muted-foreground">
        Profile could not be loaded.
      </Card>
    );
  }

  const fullName = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
  const addressObj = profile.address && profile.address.length > 0 ? profile.address[0] : null;
  const addressStr = addressObj 
    ? `${addressObj.street_address}, ${addressObj.city}` 
    : "No address on file";
  const emailObj = profile.email_address && profile.email_address.length > 0 ? profile.email_address[0] : null;
  const emailStr = emailObj ? emailObj.email : "No email on file";
  const contactObj = profile.contact_number && profile.contact_number.length > 0 ? profile.contact_number[0] : null;
  const phoneStr = contactObj ? contactObj.number : "No phone number on file";
  const photoUrl = profile.media_files && profile.media_files.length > 0 ? profile.media_files[0].image : null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          View your membership details and personal information.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Card className="p-6 flex flex-col items-center text-center space-y-4 relative overflow-hidden">
          <div className="w-32 h-32 rounded-full bg-muted border-4 border-background shadow-md overflow-hidden relative flex items-center justify-center">
            {photoUrl ? (
              <Image src={photoUrl} alt={fullName} fill className="object-cover" />
            ) : (
              <User className="w-16 h-16 text-muted-foreground opacity-50" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{fullName}</h2>
            <p className="text-muted-foreground">Member ID: {profile.member_ID}</p>
          </div>
          <div className="w-full pt-4 border-t border-border/60 flex items-center justify-center gap-2 text-sm">
            <span className="font-semibold text-primary">{profile.membership_type?.name || "Member"}</span>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Personal Details</h3>
          <div className="grid gap-y-4 gap-x-6 sm:grid-cols-2">
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <CreditCard className="w-4 h-4" /> <span>Member ID</span>
              </div>
              <p className="font-medium">{profile.member_ID}</p>
            </div>
            
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Droplet className="w-4 h-4" /> <span>Blood Group</span>
              </div>
              <p className="font-medium">
                {typeof profile.blood_group === 'object' ? profile.blood_group?.name : profile.blood_group || "Unknown"}
              </p>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="w-4 h-4" /> <span>Date of Birth</span>
              </div>
              <p className="font-medium">{profile.date_of_birth || "Unknown"}</p>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <User className="w-4 h-4" /> <span>Gender</span>
              </div>
              <p className="font-medium">
                {typeof profile.gender === 'object' ? profile.gender?.name : profile.gender || "Unknown"}
              </p>
            </div>
            
            <div className="space-y-1 text-sm sm:col-span-2 pt-4 border-t border-border/60 mt-2">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Phone className="w-4 h-4" /> <span>Phone Number</span>
              </div>
              <p className="font-medium">{phoneStr}</p>
            </div>

            <div className="space-y-1 text-sm sm:col-span-2">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Mail className="w-4 h-4" /> <span>Email Address</span>
              </div>
              <p className="font-medium">{emailStr}</p>
            </div>

            <div className="space-y-1 text-sm sm:col-span-2">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <MapPin className="w-4 h-4" /> <span>Address</span>
              </div>
              <p className="font-medium">{addressStr}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
