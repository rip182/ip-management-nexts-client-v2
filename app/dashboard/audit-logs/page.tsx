"use client";

import { useState, useEffect } from "react";
import { Search, Calendar, Download, X, Info } from "lucide-react";
import useSWR from "swr";
import api from "@/lib/axios";
import { User, AuditLog } from "@/types/types";

export type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  path: string;
  from: number;
  to: number;
  links: { url: string | null; label: string; active: boolean }[];
};

const auditFetcher = (url: string) =>
  api.get<PaginatedResponse<AuditLog>>(url).then((res) => res.data);

export default function AuditLogsPage() {
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[] | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [actionFilter, setActionFilter] = useState<string>("all");
  const { data, error, isLoading } = useSWR("/api/audit", auditFetcher);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (!data?.data) {
      setFilteredLogs(undefined);
      return;
    }

    let filtered = [...data.data];

    if (searchTerm) {
      filtered = filtered.filter((log) =>
        [
          log.user.name?.toLowerCase(),
          log.event?.toLowerCase(),
          log.ip_address?.toLowerCase(),
          log.user_agent?.toLowerCase(),
          JSON.stringify(log.new_values)?.toLowerCase(),
          JSON.stringify(log.old_values)?.toLowerCase(),
        ].some((value) => value?.includes(searchTerm.toLowerCase()))
      );
    }

    if (actionFilter !== "all") {
      filtered = filtered.filter((log) => log.event === actionFilter);
    }

    setFilteredLogs(filtered);
  }, [searchTerm, data, actionFilter]);

  const handleExportLogs = () => {
    alert("Exporting logs is not implemented in this demo");
  };

  const getActionColor = (action: string): string => {
    switch (action) {
      case "login":
      case "logout":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "created":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "updated":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "deleted":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const formatValues = (values: Record<string, unknown> | null): string => {
    if (!values || Object.keys(values).length === 0) return "-";
    return Object.entries(values)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold mb-2 text-red-500">Error Loading Audit Logs</h2>
        <p className="text-gray-600 dark:text-gray-400">{error.message}</p>
      </div>
    );
  }

  if (user?.role !== "super-admin") {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          You do not have permission to view the audit logs. This section is only accessible to super administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Audit Logs</h1>
        <button
          onClick={handleExportLogs}
          className="btn btn-secondary flex items-center px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          <Download size={18} className="mr-2" />
          Export Logs
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search logs by user, action, IP, or details..."
              className="input pl-10 w-full border rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchTerm("")}
              >
                <X size={18} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            )}
          </div>
          <div className="md:w-48">
            <select
              className="input w-full border rounded-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="all">All Actions</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>
          <div className="md:w-48">
            <button className="btn btn-secondary w-full flex items-center justify-center px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600">
              <Calendar size={18} className="mr-2" />
              Date Range
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Timestamp
                </th>
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
                  Old Values
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  New Values
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLogs && filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getActionColor(log.event)}`}>
                        {log.event}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {log.user.name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {log.ip_address || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatValues(log.old_values)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatValues(log.new_values)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No audit logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start">
        <Info className="text-blue-500 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" size={20} />
        <div>
          <h3 className="font-medium text-blue-800 dark:text-blue-300">About Audit Logs</h3>
          <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">
            The audit log provides a complete history of all actions performed in the system. This includes user
            logins/logouts, IP address creations, updates, and deletions. Audit logs cannot be modified or deleted by any
            user, ensuring a tamper-proof record of all system activities.
          </p>
        </div>
      </div>
    </div>
  );
}