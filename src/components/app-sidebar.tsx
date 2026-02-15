"use client";
import type * as React from "react";
import {
    LayoutDashboard,
    Wallet,
    Receipt,
    PiggyBank,
    Calendar,
    Settings,
    HelpCircle,
    TrendingUp,
    CreditCard,
    FileText,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import BrandLogo from "./ui/brand-logo";
import { NavUser } from "./nav-user";
import { useAuthStore } from "@/features/auth/stores/auth.store";

const mainNavItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Transactions",
        url: "/dashboard/transactions",
        icon: Receipt,
    },
    {
        title: "Income",
        url: "/dashboard/income",
        icon: TrendingUp,
    },
    {
        title: "Expenses",
        url: "/dashboard/expenses",
        icon: CreditCard,
    },
    {
        title: "Budgets",
        url: "/dashboard/budgets",
        icon: Wallet,
    },
    {
        title: "Savings Goals",
        url: "/dashboard/savings",
        icon: PiggyBank,
    },
];

const toolsNavItems = [
    {
        title: "Workdays",
        url: "/dashboard/workdays",
        icon: Calendar,
    },
    {
        title: "Reports",
        url: "/dashboard/reports",
        icon: FileText,
    },
];

const settingsNavItems = [
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
    },
    {
        title: "Help",
        url: "/dashboard/help",
        icon: HelpCircle,
    },
];



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname();
    const user = useAuthStore((state) => state.user);

    if (!user) {
        return null;
    }
    const uiUser = {
        name: user.name ?? "User",
        email: user.email,
        avatar: user.image ?? "/avatar.png",
    }

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Cashflow" size="lg" asChild>
                            <Link href="/dashboard">
                                <BrandLogo size="sm" />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Overview</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton tooltip={item.title} isActive={pathname === item.url || pathname.startsWith(item.url + "/")} asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />
                <SidebarGroup>
                    <SidebarGroupLabel>Tools</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {toolsNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton tooltip={item.title} isActive={pathname === item.url} asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarSeparator />
                <SidebarGroup className="mt-auto">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {settingsNavItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton tooltip={item.title} isActive={pathname === item.url} asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={uiUser} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}