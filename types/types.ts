
export type IPAddress = {
    id: string
    ip_address: string
    label: string
    comment?: string
    created_at?: string
    updated_at?: string
    user: UserDetails
    user_id:number
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
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
  role: string; 
};

export type IPAddressPostPayload = {
  ip_address: string
  label:string
  comment:string | null
}

export type IPAddressPutPayload = {
    ip_address: string
    label:string
    comment:string | null
  }

// export  type RequestOptions<T> = {
//     endpoint: string;
//     method?: "get" | "post" | "put" | "patch" | "delete";
//     data?: T;
//     params?: Record<string, unknown>;
//   };

export interface RequestOptions<T> {
    endpoint: string;
    method: string; // Could be more specific, e.g., "GET" | "POST" | "PUT" | etc.
    data: T;
    params?: Record<string, unknown> | null; // Optional params, defaulting to null
  }

  export type AuditLog = {
    id: number;
    user_type: string;
    user_id: number;
    event: string;
    auditable_type: string;
    auditable_id: number;
    old_values: Record<string, unknown> | null;
    new_values: Record<string, unknown> | null;
    url: string;
    ip_address: string;
    user_agent: string;
    tags: string | null;
    created_at: string;
    updated_at: string;
    user: User;
  };

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