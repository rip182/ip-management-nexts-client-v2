// components/IPTable.tsx
import { Trash2, Edit } from 'lucide-react'
import type { IPAddress, User } from '@/types/types'

interface IPTableProps {
  ips: IPAddress[]
  user: User | null
  onEdit: (ip: IPAddress) => void
  onDelete: (ip: IPAddress) => void
}

const IPTable = ({ ips, user, onEdit, onDelete }: IPTableProps) => {
  const canModify = (ip: IPAddress) => user?.role === 'super-admin' || ip.name === user?.email
  const canDelete = (ip: IPAddress) => user?.role === 'super-admin'

  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      {/* Table headers */}
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {ips.map((ip) => (
          <tr key={ip.id}>
            {/* Table cells */}
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
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default IPTable