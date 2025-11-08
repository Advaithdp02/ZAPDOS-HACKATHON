
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import type { StudentProfile, EducationItem, ExperienceItem, CertificationItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Briefcase, Building, Calendar, Check, ShieldQuestion, Award, CheckSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";

function VerificationItem({ 
    studentId,
    item, 
    type, 
    onVerify 
} : { 
    studentId: string;
    item: EducationItem | ExperienceItem | CertificationItem; 
    type: 'education' | 'experience' | 'certification';
    onVerify: (studentId: string, itemId: string, type: 'education' | 'experience' | 'certification') => void;
}) {
    const isEducation = type === 'education';
    const isExperience = type === 'experience';
    const isCertification = type === 'certification';
    
    const eduItem = isEducation ? (item as EducationItem) : null;
    const expItem = isExperience ? (item as ExperienceItem) : null;
    const certItem = isCertification ? (item as CertificationItem) : null;


    return (
        <div className="p-4 border rounded-lg flex items-start justify-between gap-4">
            <div className="space-y-1.5">
                {isEducation && (
                    <>
                        <h4 className="font-semibold">{eduItem!.degree}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-2"><Building className="h-4 w-4" /> {eduItem!.institution}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" /> {eduItem!.startDate} - {eduItem!.endDate}</p>
                        <p className="text-sm">Grade: {eduItem!.grade}</p>
                    </>
                )}
                {isExperience && (
                    <>
                        <h4 className="font-semibold">{expItem!.role}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-2"><Briefcase className="h-4 w-4" /> {expItem!.company}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" /> {expItem!.startDate} - {expItem!.endDate}</p>
                        <p className="text-sm mt-2">{expItem!.description}</p>
                        {expItem!.skillsUsed && expItem!.skillsUsed.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                                {expItem!.skillsUsed.map(skill => (
                                    <span key={skill} className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">{skill}</span>
                                ))}
                            </div>
                        )}
                    </>
                )}
                {isCertification && (
                     <>
                        <h4 className="font-semibold">{certItem!.name}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-2"><Award className="h-4 w-4" /> {certItem!.issuingOrganization}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" /> Issued {certItem!.issueDate}</p>
                        {certItem!.credentialId && <p className="text-sm">ID: {certItem!.credentialId}</p>}
                    </>
                )}
            </div>
            <div className="flex-shrink-0">
                {item.verified ? (
                    <div className="flex items-center gap-2 text-green-600">
                        <BadgeCheck className="h-5 w-5" />
                        <span className="font-medium text-sm">Verified</span>
                    </div>
                ) : (
                    <Button size="sm" onClick={() => onVerify(studentId, item.id, type)}>
                        <Check className="mr-2 h-4 w-4" /> Verify
                    </Button>
                )}
            </div>
        </div>
    );
}

export default function VerificationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && (user.role === 'hod' || user.role === 'tpo')) {
      const department = user.role === 'hod' ? user.department : undefined;
      api.getUnverifiedProfiles(department)
        .then(setProfiles)
        .finally(() => setLoading(false));
    }
  }, [user]);
  
  const handleVerify = async (studentId: string, itemId: string, type: 'education' | 'experience' | 'certification') => {
    let verifyFn;
    switch(type) {
        case 'education':
            verifyFn = api.verifyEducationItem;
            break;
        case 'experience':
            verifyFn = api.verifyExperienceItem;
            break;
        case 'certification':
            verifyFn = api.verifyCertificationItem;
            break;
    }
    
    try {
      const result = await verifyFn(studentId, itemId);
      if (result.success) {
        toast({ title: "Item Verified", description: `The ${type} record has been successfully verified.` });
        
        // Update local state to reflect verification
        setProfiles(prevProfiles => prevProfiles.map(p => {
          if (p.studentId === studentId) {
            const updatedProfile = { ...p };
            if (type === 'education') {
              updatedProfile.education = updatedProfile.education.map(e => e.id === itemId ? { ...e, verified: true } : e);
            } else if (type === 'experience') {
              updatedProfile.experience = updatedProfile.experience.map(e => e.id === itemId ? { ...e, verified: true } : e);
            } else if (type === 'certification') {
               updatedProfile.certifications = updatedProfile.certifications.map(c => c.id === itemId ? { ...c, verified: true } : c);
            }

            // If this was the last unverified item for this student, remove them from the list
            const stillHasUnverified = updatedProfile.education.some(e => !e.verified) || updatedProfile.experience.some(e => !e.verified) || updatedProfile.certifications.some(c => !c.verified);
            return stillHasUnverified ? updatedProfile : null;
          }
          return p;
        }).filter((p): p is StudentProfile => p !== null));

      } else {
        throw new Error("Verification failed");
      }
    } catch (err) {
      toast({ variant: 'destructive', title: "Verification Failed", description: "Could not verify the item." });
    }
  };

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("");

  if (!user || (user.role !== "hod" && user.role !== "tpo")) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile Verifications"
        description="Review and verify student-submitted profile information."
      />
      <Card>
        <CardHeader>
          <CardTitle>Pending Verifications</CardTitle>
          <CardDescription>
            The following students have added or updated information that needs your review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckSquare className="mx-auto h-12 w-12" />
              <p className="mt-4 font-semibold">All profiles are verified!</p>
              <p className="text-sm">There are no pending profile verifications at this time.</p>
            </div>
          ) : (
            <Accordion type="multiple" className="w-full">
              {profiles.map(student => {
                const unverifiedEducation = student.education.filter(e => !e.verified);
                const unverifiedExperience = student.experience.filter(e => !e.verified);
                const unverifiedCertifications = student.certifications.filter(c => !c.verified);
                
                return (
                  <AccordionItem value={student.studentId} key={student.studentId}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={PlaceHolderImages.find(p => p.id === student.studentId)?.imageUrl || `https://picsum.photos/seed/${student.studentId}/40/40`} alt={student.name} />
                          <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{student.name}</div>
                          <div className="text-sm text-muted-foreground text-left">{student.department}</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-4">
                      <div className="space-y-6">
                        {unverifiedEducation.length > 0 && (
                          <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Unverified Education</h3>
                            <div className="space-y-3">
                                {unverifiedEducation.map(item => (
                                    <VerificationItem key={item.id} studentId={student.studentId} item={item} type="education" onVerify={handleVerify} />
                                ))}
                            </div>
                          </div>
                        )}
                        {unverifiedExperience.length > 0 && (
                          <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Unverified Experience</h3>
                             <div className="space-y-3">
                                {unverifiedExperience.map(item => (
                                    <VerificationItem key={item.id} studentId={student.studentId} item={item} type="experience" onVerify={handleVerify} />
                                ))}
                            </div>
                          </div>
                        )}
                        {unverifiedCertifications.length > 0 && (
                          <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Unverified Certifications</h3>
                             <div className="space-y-3">
                                {unverifiedCertifications.map(item => (
                                    <VerificationItem key={item.id} studentId={student.studentId} item={item} type="certification" onVerify={handleVerify} />
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
