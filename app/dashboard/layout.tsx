"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, Network, ClipboardList, Users, Settings, LogOut, Menu, X, ChevronDown } from "lucide-react"

type User = {
  email: string
  role: string
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/login")
      return
    }

    try {
      setUser(JSON.parse(userData))
    } catch (error) {
      console.error("Failed to parse user data:", error)
      router.push("/login")
    }

    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-gray-800 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-lg font-bold">IP Management</h1>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-1 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {user?.email.charAt(0).toUpperCase()}
            </div>
            <ChevronDown size={16} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
              <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{user?.email}</div>
              <div className="px-4 py-1 text-xs text-gray-500 dark:text-gray-400">
                {user?.role === "super-admin" ? "Super Admin" : "Regular User"}
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <LogOut size={16} className="mr-2" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed md:relative inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-md transition-transform duration-300 ease-in-out md:translate-x-0 h-screen`}
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
            <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center mr-3">
              <Network className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold">IP Management</h1>
          </div>

          <nav className="p-4 space-y-1">
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

            {user?.role === "super-admin" && (
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
            )}

            {user?.role === "super-admin" && (
              <Link
                href="/dashboard/users"
                className={`flex items-center p-2 rounded-md ${
                  isActive("/dashboard/users")
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Users size={20} className="mr-3" />
                User Management
              </Link>
            )}

            <Link
              href="/dashboard/settings"
              className={`flex items-center p-2 rounded-md ${
                isActive("/dashboard/settings")
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Settings size={20} className="mr-3" />
              Settings
            </Link>
          </nav>

          <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                {user?.email.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium truncate w-40">{user?.email}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role === "super-admin" ? "Super Admin" : "Regular User"}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
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
  )
}

