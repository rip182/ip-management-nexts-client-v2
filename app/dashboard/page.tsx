"use client"

import { useEffect } from "react";
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useAuth } from "@/context/authProvider";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-2">IP Management</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Manage your IP addresses, add new ones, and update existing records.
          </p>
          <Link
            href="/dashboard/ip-management"
            className="flex items-center text-blue-500 hover:text-blue-600 font-medium"
          >
            Go to IP Management
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-2">Audit Logs</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            View the audit trail of all actions performed in the system.
          </p>
          <Link
            href="/dashboard/audit-logs"
            className="flex items-center text-blue-500 hover:text-blue-600 font-medium"
          >
            View Audit Logs
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Manage users and their permissions within the system.</p>
          <Link href="/dashboard/users" className="flex items-center text-blue-500 hover:text-blue-600 font-medium">
            Manage Users
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-blue-500">127</div>
            <div className="text-gray-600 dark:text-gray-400">Total IP Addresses</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-green-500">24</div>
            <div className="text-gray-600 dark:text-gray-400">Added This Month</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-purple-500">8</div>
            <div className="text-gray-600 dark:text-gray-400">Active Users</div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">Added IP</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  admin@example.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">192.168.1.1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  2023-03-05 14:30
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">Modified Label</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  user@example.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">10.0.0.1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  2023-03-04 09:15
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">Deleted IP</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  admin@example.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">172.16.0.1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  2023-03-03 16:45
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

