import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@radix-ui/react-separator";
import { MapPin, FileText, Cross, Heart, Building2, ClipboardList } from "lucide-react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="relative flex flex-col h-32 shrink-0 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 shadow-sm border-b border-slate-200">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-light" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-light)" className="text-slate-900" />
            </svg>
          </div>

          {/* Top Section with Sidebar Trigger and Status */}
          <div className="relative flex items-center gap-4 px-4 py-3 w-full">
            <SidebarTrigger className="-ml-1 text-slate-700 hover:bg-slate-200/50" />
            
            <Separator
              orientation="vertical"
              className="h-8 w-px bg-slate-300"
            />
            
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center gap-2 text-slate-600 text-sm animate-fade-in-up">
                <MapPin className="w-4 h-4 text-blue-600 animate-pulse" />
                <span className="font-semibold">LGU Carigara, Leyte</span>
              </div>
              
              <span className="text-slate-400 text-xs">•</span>
              
              <div className="text-slate-600 text-sm flex items-center gap-1.5 animate-fade-in-up animation-delay-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold">System Online</span>
              </div>
            </div>

            {/* Animated Icon Badge */}
            <div className="hidden md:flex items-center gap-3 animate-fade-in-up animation-delay-500">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-300/30 rounded-full blur-md animate-pulse"></div>
                <div className="relative bg-white backdrop-blur-sm rounded-full p-2 border-2 border-blue-200 shadow-sm">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling Banner */}
          <div className="relative flex-1 flex items-center overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-inner">
            <div className="absolute inset-0 flex animate-scroll-left whitespace-nowrap">
              <div className="flex items-center gap-6 px-8">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-white" />
                  <span className="text-white text-lg font-bold drop-shadow-sm">Welcome to Civil Registrar Office</span>
                </div>
                <span className="text-blue-100">•</span>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-white/95" />
                  <span className="text-white/95 text-lg drop-shadow-sm">Birth Certificates</span>
                </div>
                <span className="text-blue-100">•</span>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-white/95" />
                  <span className="text-white/95 text-lg drop-shadow-sm">Marriage Certificates</span>
                </div>
                <span className="text-blue-100">•</span>
                <div className="flex items-center gap-2">
                  <Cross className="w-5 h-5 text-white/95" />
                  <span className="text-white/95 text-lg drop-shadow-sm">Death Certificates</span>
                </div>
                <span className="text-blue-100">•</span>
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-white/95" />
                  <span className="text-white/95 text-lg drop-shadow-sm">Application for Marriage Certificate</span>
                </div>
                <span className="text-blue-100">•</span>
              </div>
              <div className="flex items-center gap-6 px-8">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-white" />
                  <span className="text-white text-lg font-bold drop-shadow-sm">Welcome to Civil Registrar Office</span>
                </div>
                <span className="text-blue-100">•</span>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-white/95" />
                  <span className="text-white/95 text-lg drop-shadow-sm">Birth Certificates</span>
                </div>
                <span className="text-blue-100">•</span>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-white/95" />
                  <span className="text-white/95 text-lg drop-shadow-sm">Marriage Certificates</span>
                </div>
                <span className="text-blue-100">•</span>
                <div className="flex items-center gap-2">
                  <Cross className="w-5 h-5 text-white/95" />
                  <span className="text-white/95 text-lg drop-shadow-sm">Death Certificates</span>
                </div>
                <span className="text-blue-100">•</span>
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-white/95" />
                  <span className="text-white/95 text-lg drop-shadow-sm">Application for Marriage Certificate</span>
                </div>
                <span className="text-blue-100">•</span>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}



ISSUE OF NOT INIFINITE IT GO BACK WHEN SLIDING