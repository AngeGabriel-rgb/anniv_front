export interface Admin {
  id: number
  nom: string
  prenom: string
  email: string
  role: string
  emailConfirmed: boolean
  est_confirme: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Participant {
  id: number
  nom: string
  prenom: string
  email: string
  code_unique: string
  est_confirme: boolean
  emailConfirmed: boolean
  guests?: number
  createdAt: Date
  updatedAt: Date
}

export interface Anniversaire {
  id: number
  titre: string
  description?: string
  date: Date
  time?: string
  location?: string
  maxParticipants: number
  currentParticipants: number
  status: "active" | "draft" | "completed"
  participantId: number
  adminId: number
  // Relations optionnelles pour les jointures
  participant?: Participant
  admin?: Admin
  createdAt?: Date
  updatedAt?: Date
}

export interface AuthResponse {
  token: string
  message?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  nom: string
  prenom: string
  email: string
  password: string
  guests?: number
}
