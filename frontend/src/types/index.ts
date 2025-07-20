export type Role = "ADMIN" | "MANAGER" | "VIEWER";

export interface User {
  id: number;
  email: string;
  role: Role;
  first_name?: string | null;
  last_name?: string | null;
  partner_id?: number | null;
}

export interface Partner {
  id: number;
  name: string;
  country: string;
  partner_type: string;
  logo_url?: string | null;
  image_url?: string | null;
  partner_group_id: number;
  users?: User[];
}

export interface PartnerGroup {
  id: number;
  name: string;
  partners?: Partner[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
