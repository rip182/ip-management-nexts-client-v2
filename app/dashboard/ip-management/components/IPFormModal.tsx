import { useState, useEffect, FormEvent } from "react"
import {IPAddress,User,IPAddressPostPayload} from "@/types/types"
// type IPAddress = {
//   id: string
//   address: string
//   label: string
//   comment?: string
//   createdBy: string
//   createdAt: string
//   updatedAt: string
// }

// type User = {
//   email: string
//   role: string
// }

type IPFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (ip: IPAddress) => void
  ip: IPAddress | null
  user?: User | null
  isSubmitting:boolean
}

export function IPFormModal({ isOpen, onClose, onSave, ip, isSubmitting }: IPFormModalProps) {
  const [formData, setFormData] = useState({id:"", address: "", label: "", comment: "" })
  const [formErrors, setFormErrors] = useState({ address: "", label: "" })

  useEffect(() => {
    if (ip) {
      setFormData({id:ip.id, address: ip.ip_address, label: ip.label, comment: ip.comment || "" })
    } else {
      setFormData({id:"", address: "", label: "", comment: "" })
    }
    setFormErrors({ address: "", label: "" })
  }, [ip])

  const validateIPAddress = (ip: string): boolean => {
    const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
    const ipv4Match = ip.match(ipv4Pattern)
    if (ipv4Match) {
      return ipv4Match.slice(1).every((octet) => Number.parseInt(octet) <= 255)
    }
    const ipv6Pattern =
      /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,7}:|^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$|^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$|^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$|^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$|^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$|^:((:[0-9a-fA-F]{1,4}){1,7}|:)$/
    return ipv6Pattern.test(ip)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const errors = { address: "", label: "" }

    if (!formData.address) {
      errors.address = "IP address is required"
    } else if (!validateIPAddress(formData.address)) {
      errors.address = "Invalid IP address format"
    }
    if (!formData.label) {
      errors.label = "Label is required"
    }
    if (errors.address || errors.label) {
      setFormErrors(errors)
      return
    }

    const newIP: IPAddress = {
      id:formData.id,
      ip_address: formData.address,
      label: formData.label,
      comment: formData.comment,
    }
    onSave(newIP)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          ​
        </span>
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                    {ip ? "Edit IP Address" : "Add New IP Address"}
                  </h3>
                  <div className="mt-6 space-y-4">
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="ip-address" className="label text-sm font-medium text-white-700">
                        IP Address:
                      </label>
                      <input
                        type="text"
                        id="ip-address"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.address ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="e.g. 192.168.1.1 or 2001:db8::7334"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        // disabled={!!ip}
                      />
                      {formErrors.address && (
                        <p className="text-sm text-red-500">{formErrors.address}</p>
                      )}
                  </div>

                    <div>
                      <label htmlFor="label" className="label">
                        Label
                      </label>
                      <input
                        type="text"
                        id="label"
                        className={`input ${formErrors.label ? "border-red-500" : ""}`}
                        placeholder="e.g. Office Router"
                        value={formData.label}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      />
                      {formErrors.label && <p className="mt-1 text-sm text-red-500">{formErrors.label}</p>}
                    </div>
                    <div>
                      <label htmlFor="comment" className="label">
                        Comment (Optional)
                      </label>
                      <textarea
                        id="comment"
                        rows={3}
                        className="input"
                        placeholder="Add any additional information about this IP address"
                        value={formData.comment}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 
                  text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm
                  ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"}`}
              >                
               {isSubmitting ? "Saving..." : ip ? "Update" : "Add"}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}