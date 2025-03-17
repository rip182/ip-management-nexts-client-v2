import { Edit, Trash2 } from "lucide-react"
import type { IPAddress } from "@/types/types"

type IPTableProps = {
  ips: IPAddress[]
  onEdit: (ip: IPAddress) => void
  onDelete: (ip: IPAddress) => void
  canModify: (ip: IPAddress) => boolean
  canDelete: (ip: IPAddress) => boolean
  currentPage:number
  lastPage:number
  prevPageUrl:string|null
  nextPageUrl:string|null
  onPrevPage: () => void;
  onNextPage: () => void;
}

export default function  IPTable({
   ips, 
   onEdit, 
   onDelete, 
   canModify, 
   canDelete,
   currentPage,
   lastPage,
   prevPageUrl,
   nextPageUrl,
   onPrevPage,
   onNextPage
  }: IPTableProps) {
  return (
    <>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              IP Address
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Label
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Comment
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Created By
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Last Updated
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {ips?.length > 0 ? (
            ips.map((ip) => (
              <tr key={ip.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">
                  {ip.ip_address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {ip.label}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                  {ip.comment || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {ip.user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(ip.updated_at ?? "").toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(ip)}
                      disabled={!canModify(ip)}
                      className={`p-1.5 rounded-md ${
                        canModify(ip)
                          ? "text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/20"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                      title={canModify(ip) ? "Edit" : "You cannot edit this IP"}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(ip)}
                      disabled={!canDelete(ip)}
                      className={`p-1.5 rounded-md ${
                        canDelete(ip)
                          ? "text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                      title={canDelete(ip) ? "Delete" : "Only super-admins can delete IPs"}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                No IP addresses found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    {/* Pagination Controls */}
    <div className="flex items-center justify-between mt-4">
    <button
      onClick={onPrevPage}
      disabled={!prevPageUrl}
      className="btn btn-secondary flex items-center px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
    >
      Previous
    </button>
    <span>
      Page {currentPage} of {lastPage}
    </span>
    <button
      onClick={onNextPage}
      disabled={!nextPageUrl}
      className="btn btn-secondary flex items-center px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
    >
      Next
    </button>
  </div>
  </>
  )
}