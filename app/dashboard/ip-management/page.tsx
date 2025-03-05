"use client"

import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { SearchBar } from "./components/SearhBar"
import IPTable  from "./components/IPTable"
import { IPFormModal } from "./components/IPFormModal"
import { DeleteConfirmationModal } from "./components/DeleteConfirmationModal"
import IPFilter from "./components/IPFilter"
import useSWR from "swr"
import api from "@/lib/axios"
import type { IPAddress, User,IPAddressPostPayload,IPAddressPutPayload } from '@/types/types'

// Type definitions (unchanged from original)
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

// Mock data (unchanged from original)
// const mockIPs: IPAddress[] = [
//   // ... (mock data remains the same as in the original query)
// ]

const IpFetcher = (url: string) => api.get<IPAddress[]>(url).then((res) => res.data)

export default function IPManagement() {
  const [IpAddresses, setIpAddresses] = useState<IPAddress[]>([])
  const [filteredIPs, setFilteredIPs] = useState<IPAddress[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentIP, setCurrentIP] = useState< IPAddress| null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(true)

  const { data, error, isLoading,mutate } = useSWR('api/internet-protocol-address', IpFetcher)
  
  const IPAddressUrl = '/api/internet-protocol-address'
  // useEffect(()=>{
  //   console.log(currentIP)
  // },[currentIP])
  // useEffect(() => {
  //   setIpAddresses(mockIPs)
  //   setFilteredIPs(mockIPs)
  //   const userData = localStorage.getItem("user")
  //   if (userData) {
  //     setUser(JSON.parse(userData))
  //   }
  //   setIsLoading(false)
  // }, [])

  // useEffect(() => {
  //   if (searchTerm) {
  //     const filtered = data.filter(
  //       (ip) =>
  //         ip.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         ip.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         (ip.comment && ip.comment.toLowerCase().includes(searchTerm.toLowerCase()))
  //     )
  //     setFilteredIPs(filtered)
  //   } else {
  //     setFilteredIPs(data)
  //   }
  // }, [searchTerm, data])

  const handleSubmit = async <T, R = unknown>({ endpoint, method, data, params=null }: RequestOptions<T>): Promise<R | void> => {

    try {
      const response = await api.request<R>({
        url: endpoint,
        method,
        data,
        params,
      });
      console.log("Success:", response.data);
      return response.data;
    } catch (error) {
      console.log(error)
    }

  };

  

  const handleOpenModal = (IpDetailsData: IPAddress) => {
    setCurrentIP(IpDetailsData || null)
    setIsModalOpen(true)
  }

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

  // const handleEditSubmit = (newIP: IPAddress) => {
  //   const method = 'PUT'
  //   const endpoint = IPAddressUrl+`/${newIP.id}`;
  //   const data = newIP

  //   handleSubmit({endpoint,method,data})
  //   //isloading if 200 then close modal if errors ont close the modal
  //   // handleCloseModal()
  // }
  const handleEditSubmit = async (newIP: IPAddress) => {
    console.log('disableButton')
    setIsSubmitting(true); 
  
    try {
      const method = "PUT";
      const endpoint = `${IPAddressUrl}/${newIP.id}`;
      const data = newIP;
  
      const response = await handleSubmit({ endpoint, method, data });
  
      if (response) {
        await mutate(); 
        handleCloseModal(); 
      }
    } catch (error) {
      console.error("Edit failed:", error);
     
    } finally {
      console.log('enableButton')
      setIsSubmitting(false);
    }
  };

  const handleDeleteIP = (id: string) => {
    setIpAddresses(data.filter((ip) => ip.id !== id))
    handleCloseDeleteModal()
  }

  const canModify = (ip: IPAddress): boolean => {
    if (user?.role === "super-admin") return true
    return ip.createdBy === user?.email
  }

  const canDelete = (ip: IPAddress): boolean => {
    return user?.role === "super-admin"
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
        {/* <button onClick={() => handleOpenModal()} className="btn btn-primary flex items-center">
          <Plus size={18} className="mr-2" />
          Add New IP
        </button> */}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <div className="md:w-48">
            <button className="btn btn-secondary w-full flex items-center justify-center">
              {/* <IPFilter onFilterApply={setFilteredIPs} /> */}
              Filter
            </button>
          </div>
        </div>
        <IPTable
          ips={data ?? []}
          onEdit={handleOpenModal}
          onDelete={handleOpenDeleteModal}
          canModify={canModify}
          canDelete={canDelete}
        />
      </div>

      <IPFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleEditSubmit}
        ip={currentIP}
        isSubmitting={isSubmitting}
        // user={user}
      />

      {/* <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteIP}
        ip={currentIP}
      /> */}

      {/* <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start">
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
      </div> */}
    </div>
  )
}