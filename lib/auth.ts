import jwt from "jsonwebtoken"
import type { LoginCredentials, RegisterData, AuthResponse, ApiResponse } from "./types"

const API_BASE_URL = "https://anniversaire-9n5a.onrender.com"
const JWT_SECRET = process.env.JWT_SECRET || "anniversaire"

// Fonction utilitaire pour les requêtes API
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Une erreur est survenue",
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    return {
      success: false,
      error: "Erreur de connexion au serveur",
    }
  }
}

// Authentification Admin
export const adminAuth = {
  // Inscription admin
  register: async (userData: RegisterData): Promise<ApiResponse<AuthResponse>> => {
    return apiRequest<AuthResponse>("/auths/admin/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  // Connexion admin
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    return apiRequest<AuthResponse>("/auths/admin/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  },

  // Vérifier le token admin
  verifyToken: (token: string): boolean => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      return decoded.isAdmin === true
    } catch {
      return false
    }
  },

  // Décoder le token admin
  decodeToken: (token: string) => {
    try {
      return jwt.verify(token, JWT_SECRET)
    } catch {
      return null
    }
  },
}

// Authentification Participant
export const participantAuth = {
  // Inscription participant
  register: async (userData: RegisterData): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest<{ message: string }>("/auths/participants/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  // Connexion participant
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    return apiRequest<AuthResponse>("/auths/participants/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  },

  // Vérifier le token participant
  verifyToken: (token: string): boolean => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      return decoded.userId && !decoded.isAdmin
    } catch {
      return false
    }
  },

  // Décoder le token participant
  decodeToken: (token: string) => {
    try {
      return jwt.verify(token, JWT_SECRET)
    } catch {
      return null
    }
  },
}

// Confirmation d'email
export const confirmEmail = async (token: string): Promise<ApiResponse<{ message: string }>> => {
  return apiRequest<{ message: string }>(`/auths/participants/confirm-email?token=${token}`, {
    method: "GET",
  })
}

// Gestion du token côté client
export const tokenManager = {
  // Sauvegarder le token
  setToken: (token: string, type: "admin" | "participant" = "participant") => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`${type}Token`, token)
    }
  },

  // Récupérer le token
  getToken: (type: "admin" | "participant" = "participant"): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`${type}Token`)
    }
    return null
  },

  // Supprimer le token
  removeToken: (type: "admin" | "participant" = "participant") => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`${type}Token`)
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: (type: "admin" | "participant" = "participant"): boolean => {
    const token = tokenManager.getToken(type)
    if (!token) return false

    if (type === "admin") {
      return adminAuth.verifyToken(token)
    } else {
      return participantAuth.verifyToken(token)
    }
  },

  // Déconnexion
  logout: (type: "admin" | "participant" = "participant") => {
    tokenManager.removeToken(type)
    if (typeof window !== "undefined") {
      window.location.href = type === "admin" ? "/admin/login" : "/login"
    }
  },
}

// Hook pour l'authentification (à utiliser dans les composants)
export const useAuth = (type: "admin" | "participant" = "participant") => {
  const isAuthenticated = tokenManager.isAuthenticated(type)
  const token = tokenManager.getToken(type)

  return {
    isAuthenticated,
    token,
    login: type === "admin" ? adminAuth.login : participantAuth.login,
    logout: () => tokenManager.logout(type),
    setToken: (token: string) => tokenManager.setToken(token, type),
  }
}
