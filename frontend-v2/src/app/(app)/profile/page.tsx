"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { notFound } from "next/navigation";
import * as api from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/file-upload";
import { useToast } from "@/hooks/use-toast";
import type { StudentProfile } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'student') {
        api.getStudentProfile(user.id)
            .then(data => {
                if (data) {
                    setProfile(data);
                } else {
                    // Handle case where profile is not found
                    toast({ variant: 'destructive', title: 'Error', description: 'Could not load your profile.' });
                }
            })
            .finally(() => setLoading(false));
    }
  }, [user, toast]);


  if (!user || user.role !== "student") {
    notFound();
  }

  const handleFileSelect = (file: File) => {
    toast({
      title: "Resume Uploaded",
      description: `${file.name} has been successfully uploaded.`
    });
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  if (loading) {
    return (
        <div className="space-y-6">
            <PageHeader
                title="My Profile"
                description="View and manage your personal and academic information."
            />
            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-8 w-1/2" />
                        </CardContent>
                    </Card>
                </div>
                 <div className="space-y-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        </div>
    )
  }

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        description="View and manage your personal and academic information."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input value={profile.name} readOnly />
                </div>
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input value={profile.email} readOnly />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Department</Label>
                  <Input value={profile.department} readOnly />
                </div>
                <div className="space-y-1">
                  <Label>CGPA</Label>
                  <Input value={profile.cgpa} readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2">
                    {profile.skills.map(skill => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="flex flex-col items-center text-center p-6">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="text-3xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-muted-foreground">{profile.department}</p>
          </Card>

           <Card>
            <CardHeader>
                <CardTitle>My Résumé</CardTitle>
                <CardDescription>Upload your latest résumé in PDF format.</CardDescription>
            </CardHeader>
            <CardContent>
                <FileUpload onFileSelect={handleFileSelect} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
