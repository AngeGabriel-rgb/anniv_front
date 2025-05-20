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

export interface Participant {
  id: string
  nom: string
  prenom: string
  email: string
  code_unique?: string
  est_confirme: boolean
  guests?: number
  status?: 'confirmed' | 'pending' | 'declined'
}

export interface Anniversaire {
  id: string
  titre: string
  date: string
  time ?: string
  location?: string
  description?: string
  maxGuests?: number
  participantId?: string
  adminId?: string
  participants?: Participant[]
  isParticipating?: boolean
}

export interface ApiError {
  message: string
  statusCode?: number
  errors?: Record<string, string>
}