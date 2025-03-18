import { useState, useEffect, FormEvent } from "react";
import { IPAddress } from "@/types/types";

type IPFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ip: IPAddress) => Promise<void>; // Updated to return a Promise
  ip: IPAddress| null;
};

export function IPFormModal({ isOpen, onClose, onSave, ip, }: IPFormModalProps) {
  const [formData, setFormData] = useState({ id: "", address: "", label: "", comment: "" });
  const [formErrors, setFormErrors] = useState({ address: "", label: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (ip) {
      setFormData({ id: ip.id, address: ip.ip_address, label: ip.label, comment: ip.comment || "" });
    } else {
      setFormData({ id: "", address: "", label: "", comment: "" });
    }
    setFormErrors({ address: "", label: "" });
  }, [ip]);

  const validateIPAddress = (ip: string): boolean => {
    const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const ipv4Match = ip.match(ipv4Pattern);
    const ipv6Pattern = /^(?:(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?=(?:[0-9a-fA-F]{0,4}:){0,7}[0-9a-fA-F]{0,4}$)(([0-9a-fA-F]{1,4}:){1,7}|:)((:[0-9a-fA-F]{1,4}){1,7}|:)|::1|::)$/;
    const ipv6Match = ip.match(ipv6Pattern);
    if (ipv4Match) {
      return ipv4Match.slice(1).every((octet) => Number.parseInt(octet) <= 255);
    }
    if (ipv6Match) {
      if (ip === "::" || ip === "::1") return true;
      const groups = ip.split(":");
      if (groups.some((g) => !/^[0-9a-fA-F]{0,4}$/.test(g))) return false;
      const emptyCount = groups.filter((g) => g === "").length;
      if (emptyCount > 1) return false;
      const nonEmptyGroups = groups.length - emptyCount;
      if (emptyCount === 1 && nonEmptyGroups > 7) return false;
      if (emptyCount === 0 && groups.length !== 8) return false;
      return groups.every((g) => g === "" || (parseInt(g, 16) >= 0 && parseInt(g, 16) <= 65535));
    }
    return false;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = { address: "", label: "" };

    if (!formData.address) {
      errors.address = "IP address is required";
    } else if (!validateIPAddress(formData.address)) {
      errors.address = "Invalid IP address format";
    }
    if (!formData.label) {
      errors.label = "Label is required";
    }
    if (errors.address || errors.label) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const newIP: IPAddress = {
        id: formData.id,
        ip_address: formData.address,
        label: formData.label,
        comment: formData.comment,
        user: {
          id: 0,
          name: "",
          email: "",
          email_verified_at: null,
          created_at: "",
          updated_at: ""
        },
        user_id: 0
      };
      await onSave(newIP);
      onClose();
    } catch (error) {
      console.error("Error saving IP address:", error);
      setFormErrors({ address: "Failed to save IP address", label: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 opacity-75 transition-opacity" aria-hidden="true" />
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
        </span>
        <div className="inline-block w-full transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:max-w-lg sm:align-middle">
          <form onSubmit={handleSubmit}>
            <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="w-full text-center sm:text-left">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {ip ? "Edit IP Address" : "Add New IP Address"}
                  </h3>
                  <div className="mt-6 space-y-6">
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="ip-address" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        IP Address
                      </label>
                      <input
                        type="text"
                        id="ip-address"
                        className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.address ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="e.g. 192.168.1.1 or 2001:db8::7334"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                      {formErrors.address && <p className="text-sm text-red-500">{formErrors.address}</p>}
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="label" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Label
                      </label>
                      <input
                        type="text"
                        id="label"
                        className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          formErrors.label ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                        }`}
                        placeholder="e.g. Office Router"
                        value={formData.label}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      />
                      {formErrors.label && <p className="text-sm text-red-500">{formErrors.label}</p>}
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label htmlFor="comment" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Comment (Optional)
                      </label>
                      <textarea
                        id="comment"
                        rows={3}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600"
                        placeholder="Add any additional information about this IP address"
                        value={formData.comment}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex w-full justify-center rounded-md px-4 py-2 text-base font-medium text-white shadow-sm sm:ml-3 sm:w-auto sm:text-sm ${
                  isSubmitting 
                    ? "cursor-not-allowed bg-gray-400" 
                    : "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                }`}
              >
                {isSubmitting ? "Saving..." : ip ? "Update" : "Add"}
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}