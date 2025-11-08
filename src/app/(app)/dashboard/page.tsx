"use client";

import { useAuth } from "@/hooks/use-auth";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { HodDashboard } from "@/components/dashboard/hod-dashboard";
import { TpoDashboard } from "@/components/dashboard/tpo-dashboard";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-1/2" />
            <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
            </div>
            <Skeleton className="h-64" />
        </div>
    );
  }

  if (!user) return null;

  const renderDashboard = () => {
    switch (user.role) {
      case "student":
        return <StudentDashboard />;
      case "hod":
        return <HodDashboard />;
      case "tpo":
        return <TpoDashboard />;
      default:
        return <div>Invalid user role.</div>;
    }
  };

  return <>{renderDashboard()}</>;
}
