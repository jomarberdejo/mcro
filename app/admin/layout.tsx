import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { HeaderCarousel } from "@/components/header-carousel";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        <header className="fixed top-0 left-0 right-0 z-50 w-full flex flex-col shrink-0 overflow-hidden bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 shadow-sm border-b border-slate-200">
          <div className="flex items-center gap-4 px-4 h-16">
            <SidebarTrigger className="-ml-1 text-slate-700 hover:bg-slate-200/50" />
            <HeaderCarousel />
          </div>
        </header>
        <div className="pt-16">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
