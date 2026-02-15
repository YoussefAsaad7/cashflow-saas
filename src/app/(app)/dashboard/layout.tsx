import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <DashboardHeader />
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}