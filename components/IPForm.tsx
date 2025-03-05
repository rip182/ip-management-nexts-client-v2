// components/IPForm.tsx
import { AlertCircle } from 'lucide-react'
import type { IPAddress } from '@/types/types'

interface IPFormProps {
  ip?: IPAddress
  errors: { address: string; label: string }
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

const IPForm = ({ ip, errors, onSubmit, onCancel }: IPFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      {/* Form fields */}
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="submit"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          {ip ? "Update" : "Add"}
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default IPForm