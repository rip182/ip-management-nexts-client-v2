"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useState } from "react"
import useSWR from "swr"
import api from "@/lib/axios"
import { AuditLog,PaginatedResponse } from "@/types/types"
import { useAuth, } from "@/context/authProvider"

export default function Dashboard() {
  const [page] = useState(1); 

  const { role, isAuthenticated } = useAuth()
  
  const auditFetcher = (url: string) =>
    api.get<PaginatedResponse<AuditLog>>(url).then((res) => res.data);
  

  const shouldFetch = isAuthenticated && role === "super-admin"
  const { data, error, isLoading } = useSWR(
    shouldFetch ? `/api/audit?page=${page}` : null,
    auditFetcher
  );

  const statsUrl = "/api/stats"
  const fetchStats = async (url: string) => {
    const response = await api.get(url);
    return response.data;
  };

  const { data: stats } = useSWR(statsUrl, fetchStats);

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-blue-500">{stats?.totalIp}</div>
            <div className="text-gray-600 dark:text-gray-400">Total IP Addresses</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-3xl font-bold text-green-500">{stats?.ipsAddedThisMonth}</div>
            <div className="text-gray-600 dark:text-gray-400">Added This Month</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-3xl font-bold text-purple-500">{stats?.activeUsers}</div>
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
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-red-500">
                    Error loading recent activity
                  </td>
                </tr>
              ) : !data?.data.length ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No recent activity
                  </td>
                </tr>
              ) : (
                data.data.slice(0, 3).map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {log.event}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {log.user?.name || log.user?.email || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {log.url || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(log.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}