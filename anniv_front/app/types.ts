// Admin types
export interface Admin {
  id: string
  nom: string
  prenom: string
  email: string
  role: string
}

export interface AdminRegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  username: string
}

// Participant types
export type Participant = {
  id: string
  nom: string
  prenom: string
  email: string
  code_unique: string
  est_confirme: boolean // Added the missing property
};
export interface RegisterFormData {
  name: string
  email: string
  password: string
  guests?: number
}

export interface LoginFormData {
  email: string
  password: string
}

// API response types
export interface ApiResponse<T> {
  success?: boolean
  data?: T
  token?: string
  message?: string
  error?: string
}

export type Anniversaire = {
  id: string
  date: string
titre: string
  description: string
  participants: Participant[]

}