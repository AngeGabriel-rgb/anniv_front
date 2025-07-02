import type { LoginCredentials, RegisterData, AuthResponse, ApiResponse } from "./types"

// Remplacer l'ancienne URL de l'API par la nouvelle
const API_BASE_URL = "https://idea-r1ff.onrender.com"

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

// Fonction pour décoder un JWT côté client (sans vérification de signature)
function decodeJWT(token: string) {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) {
      return null
    }

    const payload = parts[1]
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))
    return decoded
  } catch (error) {
    console.error("Erreur lors du décodage du token:", error)
    return null
  }
}

// Fonction pour vérifier si un token est expiré
function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeJWT(token)
    if (!decoded || !decoded.exp) {
      return true
    }

    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp < currentTime
  } catch (error) {
    console.error("Erreur lors de la vérification d'expiration:", error)
    return true
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

  // Vérifier le token admin (côté client, sans vérification de signature)
  verifyToken: (token: string): boolean => {
    try {
      if (isTokenExpired(token)) {
        console.log("Token expiré")
        return false
      }

      const decoded = decodeJWT(token)
      console.log("Token décodé:", decoded)

      if (!decoded) {
        console.log("Impossible de décoder le token")
        return false
      }

      // Vérifier que c'est bien un token admin
      const isAdmin = decoded.isAdmin === true || decoded.adminId
      console.log("Est admin:", isAdmin)

      return isAdmin
    } catch (error) {
      console.error("Erreur lors de la vérification du token:", error)
      return false
    }
  },

  // Décoder le token admin
  decodeToken: (token: string) => {
    return decodeJWT(token)
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
      if (isTokenExpired(token)) {
        return false
      }

      const decoded = decodeJWT(token)
      if (!decoded) {
        return false
      }

      // Vérifier que c'est bien un token participant (pas admin)
      return decoded.userId && !decoded.isAdmin
    } catch (error) {
      console.error("Erreur lors de la vérification du token participant:", error)
      return false
    }
  },

  // Décoder le token participant
  decodeToken: (token: string) => {
    return decodeJWT(token)
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
      console.log(`Token ${type} sauvegardé:`, token.substring(0, 50) + "...")
    }
  },

  // Récupérer le token
  getToken: (type: "admin" | "participant" = "participant"): string | null => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(`${type}Token`)
      console.log(`Token ${type} récupéré:`, token ? token.substring(0, 50) + "..." : "null")
      return token
    }
    return null
  },

  // Supprimer le token
  removeToken: (type: "admin" | "participant" = "participant") => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`${type}Token`)
      console.log(`Token ${type} supprimé`)
    }
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: (type: "admin" | "participant" = "participant"): boolean => {
    const token = tokenManager.getToken(type)
    console.log(`Vérification de l'authentification ${type}...`)

    if (!token) {
      console.log("Aucun token trouvé")
      return false
    }

    let isValid = false
    if (type === "admin") {
      isValid = adminAuth.verifyToken(token)
    } else {
      isValid = participantAuth.verifyToken(token)
    }

    console.log(`Authentifié (${type}):`, isValid)
    return isValid
  },

  // Déconnexion
  logout: (type: "admin" | "participant" = "participant") => {
    console.log(`Déconnexion ${type}...`)
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
