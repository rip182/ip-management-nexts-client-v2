"use client"

import { useState } from "react"
import { Plus,Info } from "lucide-react"
import IPTable  from "./components/IPTable"
import { IPFormModal } from "./components/IPFormModal"
import { DeleteConfirmationModal } from "./components/DeleteConfirmationModal"
import useSWR from "swr"
import api,{request} from "@/lib/axios"
import type { IPAddress, PaginatedResponse } from '@/types/types'
import { useAuth } from "@/context/authProvider";;
import "toastify-js/src/toastify.css"; 



export default function IPManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentIP, setCurrentIP] = useState<IPAddress | null>(null);
  
  const [page, setPage] = useState(1);
  const IPAddressUrl = `/api/internet-protocol-address?=${page}`
  const IpFetcher = (url: string) => api.get<PaginatedResponse<IPAddress>>(url).then((res) => res.data)
  const { user,role} = useAuth();
  const { data, isLoading,mutate } = useSWR(IPAddressUrl, IpFetcher)


  const handleOpenModal = (IpDetailsData?: IPAddress):void => {
    setCurrentIP(IpDetailsData || null)
    setIsModalOpen(true)
  }

  const handleAddIPClickEvent = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Optional: Prevents default behavior if needed
    handleOpenModal(); // Call without an IPAddress for "create" mode
  };

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setCurrentIP(null)
  }

  const handleOpenDeleteModal = (ip: IPAddress) => {
    setCurrentIP(ip)
    setIsDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setCurrentIP(null)
  }
  
  const handleSubmit = async (newIP: IPAddress) => {
    const  AddressUrl = '/api/internet-protocol-address'
    try {
      const method = newIP.id ? "PUT" : "POST";
      const endpoint = newIP.id ? `${AddressUrl}/${newIP.id}` : `${AddressUrl}`;
      const data = newIP;
  
      const response = await request({ endpoint, method, data });
  
      if (response) {
        await mutate(); 
        handleCloseModal(); 
      }
    } catch (error) {
      console.error("Edit failed:", error);
  }};

  const handleDeleteIP = async (id: string) => {
    const  AddressUrl = '/api/internet-protocol-address'
    try {
      const method = 'DELETE'
      const endpoint =`${AddressUrl}/`+id
      const data = id;

    const response = await request({ endpoint, method, data });
  
      if (response) {
        await mutate(); 
        handleCloseModal(); 
      }
    } catch (error) {
      console.error("Edit failed:", error);
     
    } finally {
      console.log('enableButton')
    }
    handleCloseDeleteModal()
  }

  const canModify = (ip: IPAddress): boolean => {
    if (role === "super-admin"){
      return true
    }
    
    return ip.user_id === user?.id
  }

  const canDelete = (): boolean => {
    return role === "super-admin"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">IP Address Management</h1>
        <button onClick={handleAddIPClickEvent} className="btn btn-primary flex items-center">
          <Plus size={18} className="mr-2" />
          Add New IP
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        { data && (
          <IPTable
          ips={data?.data ?? []}
          onEdit={handleOpenModal}
          onDelete={handleOpenDeleteModal}
          canModify={canModify}
          canDelete={canDelete}
          currentPage={data?.current_page}
          lastPage={data.last_page}
          prevPageUrl={data.prev_page_url}
          nextPageUrl={data.next_page_url}
          onPrevPage={() => setPage((prev) => Math.max(prev - 1, 1))}
            onNextPage={() =>
              setPage((prev) => (data && data.current_page < data.last_page ? prev + 1 : prev))
            }
            />
        )}
      </div>

      <IPFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSubmit}
        ip={currentIP}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteIP}
        ip={currentIP}
      />

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start">
        <Info className="text-blue-500 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" size={20} />
        <div>
          <h3 className="font-medium text-blue-800 dark:text-blue-300">IP Management Rules</h3>
          <ul className="mt-2 text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Regular users can add and modify their own IP addresses but cannot delete them.</li>
            <li>• Super admins can add, modify, and delete any IP address.</li>
            <li>• All changes are logged in the audit trail for accountability.</li>
            <li>• Both IPv4 and IPv6 addresses are supported.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}