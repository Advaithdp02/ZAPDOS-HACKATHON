
"use client";

import { EmailGenerator } from "@/components/email-generator";
import { PageHeader } from "@/components/page-header";

export default function EmailGeneratorPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Email Generator"
        description="Create professional email templates for any stage of the placement process."
      />
      <EmailGenerator
        stage="Application Received"
        companyName=""
        role=""
        studentName=""
      />
    </div>
  );
}

    