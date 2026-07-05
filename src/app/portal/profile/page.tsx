"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatJoinedDate as formatDate } from "@/lib/date_modify";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Heart,
  Users,
  AlertTriangle,
  Award,
  FileText,
  Calendar,
  Hash,
  GraduationCap,
  Globe,
  Droplets,
  Building,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { LoadingDots } from "@/components/ui/loading";
import { useState } from "react";
import { ImageViewer } from "@/components/utils/ImageViewer";

const NoDetailsFound = ({ sectionName }: { sectionName: string }) => (
  <div className="text-center text-muted-foreground py-8">
    No {sectionName.toLowerCase()} details found.
  </div>
);

export default function PortalProfilePage() {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { data: responseData, isLoading } = useQuery({
    queryKey: ["portalProfile"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/member/v1/portal/me/");
      return res.data?.data;
    },
  });

  //TODO:Need Functionality Attach to See Documents File View/GET Operation

  const {
    member_info,
    contact_info,
    email_address,
    address,
    job,
    spouse,
    descendant,
    emergency_contact,
    certificate,
    companion,
    document,
    special_days,
  } = responseData ?? {};

  const primaryNumber = contact_info?.find((c: any) => c.is_primary);
  const primaryEmail = email_address?.find((e: any) => e.is_primary);

  const handleImageClick = (image: any) => {
    setSelectedImage(image);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedImage(null);
  };

  if (isLoading) return <LoadingDots />;

  if (!member_info) {
    return (
      <div className="w-full mx-auto space-y-6 p-4 md:p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <User className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Invalid Member Data</h2>
          <p className="text-muted-foreground">
            Member information is incomplete or corrupted.
          </p>
        </div>
      </div>
    );
  }
  if (!responseData || Object.keys(responseData).length === 0) {
    return (
      <div className="w-full mx-auto space-y-6 p-4 md:p-6">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <User className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Member Data Found</h2>
          <p className="text-muted-foreground">
            No information available for member.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="w-full max-w-5xl mx-auto space-y-5">
        <div className="relative overflow-hidden bg-primary text-primary-foreground rounded-2xl shadow-2xl">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
          </div>

          <div className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <div className="relative">
                  <Avatar
                    onClick={() => handleImageClick(member_info?.profile_photo)}
                    className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-2xl transition-transform duration-300 group-hover:scale-105"
                  >
                    <AvatarImage
                      src={
                        `${
                          process.env.NEXT_PUBLIC_BACKEND_API_URL ||
                          "http://localhost:8000"
                        }${member_info?.profile_photo}` || "/assets/logo.png"
                      }
                      alt={`${member_info?.first_name} ${member_info?.last_name}`}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-2xl md:text-3xl font-bold bg-primary text-white">
                      {member_info?.first_name?.[0]}
                      {member_info?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left text-white space-y-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 animate-fade-in">
                    {member_info?.first_name} {member_info?.last_name}
                  </h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                    <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors">
                      {member_info?.membership_type?.name}
                    </Badge>
                    <Badge className="bg-green-500/20 text-green-100 border-green-400/30">
                      {member_info?.membership_status?.name}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-background/20 rounded-lg p-3 backdrop-blur-sm border border-background/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Hash className="h-4 w-4" />
                      <span className="text-white/80">Member ID</span>
                    </div>
                    <p className="font-semibold">{member_info?.member_ID}</p>
                  </div>

                  <div className="bg-background/20 rounded-lg p-3 backdrop-blur-sm border border-background/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Building className="h-4 w-4" />
                      <span className="text-white/80">Institute</span>
                    </div>
                    <p className="font-semibold line-clamp-1">
                      {member_info?.institute_name?.name}
                    </p>
                  </div>

                  <div className="bg-background/20 rounded-lg p-3 backdrop-blur-sm border border-background/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Droplets className="h-4 w-4" />
                      <span className="text-white/80">Blood Group</span>
                    </div>
                    <p className="font-semibold">
                      {typeof member_info?.blood_group === "object"
                        ? member_info?.blood_group?.name
                        : member_info?.blood_group}
                    </p>
                  </div>

                  <div className="bg-background/20 rounded-lg p-3 backdrop-blur-sm border border-background/20">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="h-4 w-4" />
                      <span className="text-white/80">Nationality</span>
                    </div>
                    <p className="font-semibold">{member_info?.nationality}</p>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                  {primaryNumber?.number && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{primaryNumber?.number}</span>
                    </div>
                  )}

                  {primaryEmail?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{primaryEmail?.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <Tabs defaultValue="personal" className="w-full">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <div className="overflow-x-scroll no-scrollbar">
                  <TabsList className="w-full justify-start h-auto p-0 bg-transparent rounded-t-lg ">
                    <div className="flex justify-around min-w-max w-full p-2 gap-2 bg-muted rounded-t-lg">
                      <TabsTrigger
                        value="personal"
                        className="gap-2 border-b-2 border-transparent bg-background dark:bg-gray-700 rounded-lg data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted transition-all duration-200 "
                      >
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">Personal Info</span>
                        <span className="sm:hidden">Personal</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="contact"
                        className="gap-2  bg-background dark:bg-gray-700 rounded-lg border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted transition-all duration-200"
                      >
                        <Phone className="h-4 w-4" />
                        <span className="hidden sm:inline">Contact Info</span>
                        <span className="sm:hidden">Contact</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="family"
                        className="gap-2 bg-background dark:bg-gray-700 rounded-lg  border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted transition-all duration-200"
                      >
                        <Heart className="h-4 w-4" />
                        <span className="hidden sm:inline">Family</span>
                        <span className="sm:hidden">Family</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="work"
                        className="gap-2 bg-background dark:bg-gray-700 rounded-lg border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted transition-all duration-200"
                      >
                        <Briefcase className="h-4 w-4" />
                        <span className="hidden sm:inline">Work History</span>
                        <span className="sm:hidden">Work</span>
                      </TabsTrigger>

                      <TabsTrigger
                        value="documents"
                        className="gap-2 bg-background dark:bg-gray-700 rounded-lg border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted transition-all duration-200"
                      >
                        <FileText className="h-4 w-4" />
                        <span className="hidden sm:inline">Documents</span>
                        <span className="sm:hidden">Docs</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="companions"
                        className="gap-2 bg-background dark:bg-gray-700 rounded-lg border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted transition-all duration-200"
                      >
                        <Users className="h-4 w-4" />
                        <span className="hidden sm:inline">Companions</span>
                        <span className="sm:hidden">Companions</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="special"
                        className="gap-2 bg-background dark:bg-gray-700 rounded-lg border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-muted transition-all duration-200"
                      >
                        <Calendar className="h-4 w-4" />
                        <span className="hidden sm:inline">Special Days</span>
                        <span className="sm:hidden">Special</span>
                      </TabsTrigger>
                    </div>
                  </TabsList>
                </div>
              </div>
            </div>

            <TabsContent value="personal" className="m-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-lg bg-card border border-border">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <User className="h-5 w-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                        <p className="text-muted-foreground font-medium">
                          Marital Status
                        </p>
                        <p className="font-semibold text-foreground">
                          {typeof member_info?.marital_status === "object"
                            ? member_info?.marital_status?.name
                            : member_info?.marital_status || "N/A"}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                        <p className="text-muted-foreground font-medium">
                          Gender
                        </p>
                        <p className="font-semibold text-foreground">
                          {typeof member_info?.gender === "object"
                            ? member_info?.gender?.name
                            : member_info?.gender || "N/A"}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                        <p className="text-muted-foreground font-medium">
                          Blood Group
                        </p>
                        <p className="font-semibold text-foreground">
                          {typeof member_info?.blood_group === "object"
                            ? member_info?.blood_group?.name
                            : member_info?.blood_group || "N/A"}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                        <p className="text-muted-foreground font-medium">
                          Date of Birth
                        </p>
                        <p className="font-semibold text-foreground">
                          {formatDate(member_info?.date_of_birth)}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                        <p className="text-muted-foreground font-medium">
                          Anniversary Date
                        </p>
                        <p className="font-semibold text-foreground">
                          {formatDate(member_info?.anniversary_date)}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                        <p className="text-muted-foreground font-medium">
                          Nationality
                        </p>
                        <p className="font-semibold text-foreground">
                          {member_info?.nationality || "N/A"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-card border border-border">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <GraduationCap className="h-5 w-5" />
                      Institution Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                      <p className="text-muted-foreground font-medium text-sm">
                        Institute Name
                      </p>
                      <p className="font-semibold text-foreground">
                        {member_info?.institute_name?.name || "N/A"}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                      <p className="text-muted-foreground font-medium text-sm">
                        Institute Code
                      </p>
                      <p className="font-semibold text-foreground">
                        {member_info?.institute_name?.code || "N/A"}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                      <p className="text-muted-foreground font-medium text-sm">
                        Batch Number
                      </p>
                      <p className="font-semibold text-foreground">
                        {member_info?.batch_number || "N/A"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="m-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-lg bg-card border border-border">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Phone className="h-5 w-5" />
                      Phone Numbers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {contact_info && contact_info.length > 0 ? (
                      <div className="space-y-3">
                        {contact_info.map((contact: any) => (
                          <div
                            key={contact.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50"
                          >
                            <div>
                              <p className="font-semibold text-foreground">
                                {contact.number}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {contact.contact_type?.name || "N/A"}
                              </p>
                            </div>
                            {contact.is_primary && (
                              <Badge className="bg-primary/10 text-primary border-primary/20">
                                Primary
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <NoDetailsFound sectionName="Contact" />
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-card border border-border">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Mail className="h-5 w-5" />
                      Email Addresses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {email_address && email_address.length > 0 ? (
                      <div className="space-y-3">
                        {email_address.map((email: any) => (
                          <div
                            key={email.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50"
                          >
                            <div>
                              <p className="font-semibold break-all text-foreground">
                                {email.email}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {email.email_type?.name || "N/A"}
                              </p>
                            </div>
                            {email.is_primary && (
                              <Badge className="bg-primary/10 text-primary border-primary/20">
                                Primary
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <NoDetailsFound sectionName="Email" />
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-card border border-border">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <MapPin className="h-5 w-5" />
                      Addresses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {address && address.length > 0 ? (
                      <div className="space-y-4 w-full">
                        {address.map((addr: any) => (
                          <div
                            key={addr.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50"
                          >
                            <div>
                              <p className="font-semibold text-foreground">
                                {addr.address}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {addr.address_type?.name || "N/A"}
                              </p>
                            </div>
                            {addr.is_primary && (
                              <Badge className="mt-1 bg-primary/10 text-primary border-primary/20">
                                Primary
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <NoDetailsFound sectionName="Address" />
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-card border border-border">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                      Emergency Contacts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {emergency_contact && emergency_contact.length > 0 ? (
                      <div className="grid gap-4">
                        {emergency_contact.map((ec: any) => (
                          <div
                            key={ec.id}
                            className="p-4 border border-red-200 dark:border-red-700/30 rounded-lg flex justify-between items-center bg-white/60 dark:bg-red-900/20"
                          >
                            <div>
                              <p className="font-semibold text-foreground">
                                {ec.contact_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Number: {ec.contact_number || "N/A"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Relation: {ec.relation_with_member || "N/A"}
                              </p>
                            </div>
                            {ec.is_active && (
                              <Badge className="mt-1 bg-primary/10 text-primary border-primary/20">
                                Active
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <NoDetailsFound sectionName="Emergency Contact" />
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="family" className="m-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-0 shadow-lg bg-card border border-border">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Heart className="h-5 w-5" />
                      Spouse Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {spouse && spouse.length > 0 ? (
                      <div className="space-y-6">
                        {spouse.map((s: any) => (
                          <div
                            key={s.id}
                            className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border/50"
                          >
                            <Avatar
                              onClick={() => handleImageClick(s?.image)}
                              className="h-16 w-16 ring-4 ring-pink-200 dark:ring-pink-700"
                            >
                              <AvatarImage
                                src={`${
                                  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
                                  "http://localhost:8000"
                                }${s?.image}`}
                                alt={s?.spouse_name}
                              />
                              <AvatarFallback className="bg-pink-100 text-pink-700 dark:bg-pink-800 dark:text-pink-200">
                                {s.spouse_name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-semibold text-foreground">
                                {s.spouse_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Contact Number:{" "}
                                {s.spouse_contact_number || "N/A"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Date of Birth: {formatDate(s.spouse_dob)}
                              </p>
                              <Badge
                                className={`mt-1 ${
                                  s.current_status === 1
                                    ? "bg-primary/10 text-primary border-primary/20"
                                    : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                }`}
                              >
                                {s.current_status === 1 ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <NoDetailsFound sectionName="Spouse" />
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-card border border-border">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Users className="h-5 w-5" />
                      Descendants
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {descendant && descendant.length > 0 ? (
                      <div className="space-y-6">
                        {descendant.map((d: any) => (
                          <div
                            key={d.id}
                            className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border/50"
                          >
                            <Avatar
                              onClick={() => handleImageClick(d?.image)}
                              className="h-16 w-16 ring-4 ring-indigo-200 dark:ring-indigo-700"
                            >
                              <AvatarImage
                                src={`${
                                  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
                                  "http://localhost:8000"
                                }${d?.image}`}
                                alt={d.name}
                              />
                              <AvatarFallback className="bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200">
                                {d.name?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-foreground">
                                  {d.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Relation Type:{" "}
                                  {d.relation_type?.name || "N/A"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Contact Number:{" "}
                                  {d.descendant_contact_number || "N/A"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Date of Birth: {formatDate(d.dob)}
                                </p>
                                {d.is_active && (
                                  <Badge className="mt-1 bg-primary/10 text-primary border-primary/20">
                                    Active
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <NoDetailsFound sectionName="Descendant" />
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="work" className="m-6">
              <Card className="border-0 shadow-lg bg-card border border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Briefcase className="h-5 w-5" />
                    Job History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {job && job.length > 0 ? (
                    <div className="space-y-6">
                      {job.map((jobItem: any) => (
                        <div
                          key={jobItem.id}
                          className={`${
                            jobItem.is_active
                              ? "border-l-4 border-slate-500 dark:border-slate-400 bg-slate-50 dark:bg-slate-900/30"
                              : "border-l-4 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/20"
                          } pl-6 py-4 rounded-r-lg`}
                        >
                          <h3 className="text-lg font-semibold text-foreground">
                            {jobItem.title}
                          </h3>
                          <p className="text-foreground font-medium">
                            <span className="text-sm font-normal text-muted-foreground">
                              Organization Name:
                            </span>{" "}
                            {jobItem.organization_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="text-sm font-normal">
                              Location:
                            </span>{" "}
                            {jobItem.location}
                          </p>
                          {jobItem.job_description && (
                            <p className="text-sm mt-2 text-muted-foreground bg-white/50 dark:bg-slate-800/30 p-3 rounded-lg">
                              {jobItem.job_description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <NoDetailsFound sectionName="Job History" />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="m-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-0 shadow-lg bg-card border border-border">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Award className="h-5 w-5" />
                      Certificates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {certificate && certificate.length > 0 ? (
                      <div className="space-y-4">
                        {certificate.map((cert: any) => (
                          <div
                            key={cert.id}
                            className="p-4 border border-yellow-200 dark:border-yellow-700/30 rounded-lg bg-white/60 dark:bg-yellow-900/20"
                          >
                            <p className="font-semibold text-foreground">
                              {cert.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Number: {cert.certificate_number || "N/A"}
                            </p>
                            {cert.certificate_document && (
                              <a
                                href={`/placeholder.svg?height=200&width=300&query=certificate document for ${cert.title}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-foreground hover:text-yellow-800 dark:hover:text-yellow-200 hover:underline font-medium"
                              >
                                View Document
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <NoDetailsFound sectionName="Certificate" />
                    )}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-card border border-border">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <FileText className="h-5 w-5" />
                      Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {document && document.length > 0 ? (
                      <div className="space-y-4">
                        {document.map((doc: any) => (
                          <div
                            key={doc.id}
                            className="p-4 border border-green-200 dark:border-green-700/30 rounded-lg bg-white/60 dark:bg-green-900/20"
                          >
                            <p className="font-semibold text-foreground">
                              {doc.document_type?.name || "N/A"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Number: {doc.document_number || "N/A"}
                            </p>
                            {doc.document_document && (
                              <a
                                href={`/placeholder.svg?height=200&width=300&query=document for ${doc.document_type?.name}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-foreground hover:text-green-800 dark:hover:text-green-200 hover:underline font-medium"
                              >
                                View Document
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <NoDetailsFound sectionName="Document" />
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="companions" className="m-6">
              <Card className="border-0 shadow-lg bg-card border border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Users className="h-5 w-5" />
                    Companions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {companion && companion.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                      {companion.map((comp: any) => (
                        <div
                          key={comp.id}
                          className="flex items-center gap-4 p-4 border border-violet-200 dark:border-violet-700/30 rounded-lg bg-white/60 dark:bg-violet-900/20"
                        >
                          <Avatar
                            onClick={() =>
                              handleImageClick(comp.companion_image)
                            }
                            className="h-16 w-16 ring-4 ring-violet-200 dark:ring-violet-700"
                          >
                            <AvatarImage
                              src={`${
                                process.env.NEXT_PUBLIC_BACKEND_API_URL ||
                                "http://localhost:8000"
                              }${comp.companion_image}`}
                              alt={comp.companion_name}
                            />
                            <AvatarFallback className="bg-violet-100 text-violet-700 dark:bg-violet-800 dark:text-violet-200">
                              {comp.companion_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">
                              {comp.companion_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Relation: {comp.relation_with_member || "N/A"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Contact: {comp.companion_contact_number || "N/A"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Card: {comp.companion_card_number || "N/A"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Date of Birth: {formatDate(comp.companion_dob)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <NoDetailsFound sectionName="Companion" />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="special" className="m-6">
              <Card className="border-0 shadow-lg bg-card border border-border">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <Calendar className="h-5 w-5" />
                    Special Days
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {special_days && special_days.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {special_days.map((day: any) => (
                        <div
                          key={day.id}
                          className="p-4 border border-rose-200 dark:border-rose-700/30 rounded-lg text-center bg-white/60 dark:bg-rose-900/20 hover:shadow-md transition-shadow"
                        >
                          <p className="font-semibold text-foreground">
                            {day.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(day.date)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <NoDetailsFound sectionName="Special Day" />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <ImageViewer
        image={selectedImage}
        isOpen={isViewerOpen}
        onClose={handleCloseViewer}
      />
    </div>
  );
}
