"use client";

import { useAuth } from "@/hooks/use-auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, FileText, ArrowRight } from "lucide-react";

export default function StudentToolsPage() {
  const { user } = useAuth();

  if (!user || user.role !== "student") {
    notFound();
  }

  const tools = [
    {
      title: "Email Template Creator",
      description: "Generate professional emails for interviews, follow-ups, and more.",
      icon: Mail,
      href: "/tools/student-email-generator",
    },
    {
      title: "Resume Template Builder",
      description: "Format your skills and experience into a clean, professional resume.",
      icon: FileText,
      href: "/tools/resume-builder",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI-Powered Tools"
        description="Leverage AI to assist you in your job search."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {tools.map((tool) => (
          <Link href={tool.href} key={tool.title} className="block">
            <Card className="hover:bg-muted/50 transition-colors h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{tool.title}</CardTitle>
                  <CardDescription className="mt-2">{tool.description}</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <tool.icon className="h-8 w-8 text-muted-foreground" />
                  <ArrowRight className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
