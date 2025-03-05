
export type IPAddress = {
    id: string
    ip_address: string
    label: string
    comment?: string
    name: string
    created_at: string
    updated_at: string
    user: UserDetails
  }
  
  export type UserDetails = {
    id: number
    name: string
    email: string
    email_verified_at: string | null
    created_at: string
    updated_at: string
  }
  
  export type User = {
    email: string
    role: string
  }