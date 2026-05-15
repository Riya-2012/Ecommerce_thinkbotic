"use client";

import AdminSidebar from "@/app/components/admin/AdminSidebar";
import AdminHeader from "@/app/components/admin/AdminHeader";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
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
    <div className="min-h-screen bg-[#f8fafc] flex">
      <AdminSidebar />

      <div className="flex-1 ">


        <main className="p-5 lg:py-5 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}