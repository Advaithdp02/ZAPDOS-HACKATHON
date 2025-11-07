"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  User,
  BookUser,
  BarChart,
  Mail,
  FileSearch,
  Users,
} from "lucide-react";
import type { UserRole } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const roleNavLinks: Record<
  UserRole,
  { href: string; label: string; icon: React.ElementType }[]
> = {
  tpo: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/drives", label: "Drives", icon: Briefcase },
    { href: "/reports", label: "Reports", icon: BarChart },
    { href: "/tools/resume-filter", label: "Resume Filter", icon: FileSearch },
    { href: "/tools/email-generator", label: "Email Generator", icon: Mail },
  ],
  hod: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/approvals", label: "Approvals", icon: Users },
    { href: "/reports", label: "Reports", icon: BarChart },
  ],
  student: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/drives", label: "Drives", icon: Briefcase },
    { href: "/profile", label: "Profile", icon: User },
  ],
};

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean;
}

export function MainNav({ className, isCollapsed, ...props }: MainNavProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const navLinks = roleNavLinks[user.role];

  return (
    <nav
      className={cn("flex flex-col space-y-2", className)}
      {...props}
    >
      {navLinks.map((link) => 
        isCollapsed ? (
          <Tooltip key={link.href} delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                href={link.href}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-primary md:h-8 md:w-8",
                   (pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))) &&
                    "bg-muted text-primary"
                )}
              >
                <link.icon className="h-5 w-5" />
                <span className="sr-only">{link.label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-4">
              {link.label}
            </TooltipContent>
          </Tooltip>
        ) : (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            (pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))) &&
              "bg-muted text-primary"
          )}
        >
          <link.icon className="h-4 w-4" />
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
