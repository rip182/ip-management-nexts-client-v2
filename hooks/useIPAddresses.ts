import { useState } from 'react'
import useSWR from 'swr'
import api from '@/lib/axios'
import type { IPAddress } from '@/types/types'

const fetcher = (url: string) => api.get<IPAddress[]>(url).then((res) => res.data)

export const useIPAddresses = () => {
  const { data, error, isLoading } = useSWR('api/internet-protocol-address', fetcher)
  const [currentIP, setCurrentIP] = useState<IPAddress | null>(null)
  
  return {
    ipAddresses: data || [],
    isLoading,
    error,
    currentIP,
    setCurrentIP
  }
}