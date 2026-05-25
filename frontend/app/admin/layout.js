"use client";

import AdminSidebar from "@/app/components/admin/AdminSidebar";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
console.log("user",user)
  useEffect(() => {
    if (!loading && !user?.isAdmin) {
      router.push("/");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 transform bg-[#f8fafc] lg:bg-transparent
          ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
          lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out
          w-[280px] lg:w-[300px] h-full overflow-y-auto
        `}
      >
         <AdminSidebar closeSidebar={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header for Hamburger */}
        <div className="lg:hidden bg-white shadow-sm px-5 py-4 flex items-center justify-between z-10 sticky top-0">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-blue-red flex items-center justify-center font-bold text-white shadow-sm">
                T
             </div>
             <h1 className="font-bold text-lg text-[#0f172a]">Admin Panel</h1>
           </div>
           <button 
             onClick={() => setSidebarOpen(true)} 
             className="p-2 -mr-2 text-gray-600 hover:text-primary-blue hover:bg-blue-50 rounded-lg transition"
           >
             <FaBars size={22} />
           </button>
        </div>

        <main className="p-4 sm:p-6 lg:py-8 lg:px-10 flex-1 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}