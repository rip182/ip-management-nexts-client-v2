"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Network,
  ClipboardList,
  LogOut,

} from "lucide-react";
import { useAuth } from "@/context/authProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {


  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, role, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading || user === undefined) return;
    if(isAuthenticated && role != 'super-admin') {
      router.push('dashboard/ip-management')
    }
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router,user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  const userRole = role;


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className= "fixed md:relative inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-md transition-transform duration-300 ease-in-out md:translate-x-0 h-screen"
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
            <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center mr-3">
              <Network className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold">IP Management</h1>
          </div>

          <nav className="p-4 space-y-1">
          {userRole === "super-admin" && (
            <Link
              href="/dashboard"
              className={`flex items-center p-2 rounded-md ${
                isActive("/dashboard") && !isActive("/dashboard/ip-management") && !isActive("/dashboard/audit-logs")
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <LayoutDashboard size={20} className="mr-3" />
              Dashboard
            </Link>
          )}
            <Link
              href="/dashboard/ip-management"
              className={`flex items-center p-2 rounded-md ${
                isActive("/dashboard/ip-management")
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Network size={20} className="mr-3" />
              IP Management
            </Link>

            {userRole === "super-admin" && (
              <>
                <Link
                  href="/dashboard/audit-logs"
                  className={`flex items-center p-2 rounded-md ${
                    isActive("/dashboard/audit-logs")
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <ClipboardList size={20} className="mr-3" />
                  Audit Logs
                </Link>

              </>
            )}
          </nav>

          <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                {user?.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium truncate w-40">{user?.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {userRole}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut size={20} className="mr-3" />
              Sign out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
