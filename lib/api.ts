import type { Admin, Participant, Anniversaire, ApiResponse, LoginCredentials, RegisterData } from "@/lib/types"

const API_BASE_URL = "https://anniversaire-9n5a.onrender.com"

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

// Fonction utilitaire pour les requêtes authentifiées
async function authenticatedRequest<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })
}

// ==================== AUTHENTIFICATION ====================

export const authApi = {
  // Inscription administrateur
  adminRegister: async (userData: RegisterData): Promise<ApiResponse<{ message: string; token: string }>> => {
    return apiRequest("/auths/admin/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  // Connexion administrateur
  adminLogin: async (credentials: LoginCredentials): Promise<ApiResponse<{ token: string }>> => {
    return apiRequest("/auths/admin/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  },

  // Connexion super administrateur
  userLogin: async (credentials: LoginCredentials): Promise<ApiResponse<{ token: string }>> => {
    return apiRequest("/auths/user/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  },

  // Inscription participant
  participantRegister: async (userData: RegisterData): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest("/auths/participants/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  // Connexion participant
  participantLogin: async (credentials: LoginCredentials): Promise<ApiResponse<{ token: string }>> => {
    return apiRequest("/auths/participants/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  },

  // Confirmer l'email d'un participant
  confirmEmail: async (token: string): Promise<ApiResponse<{ message: string }>> => {
    return apiRequest(`/auths/participants/confirm-email?token=${token}`, {
      method: "GET",
    })
  },
}

// ==================== GESTION DES ADMINS ====================

export const adminApi = {
  // Récupérer tous les administrateurs
  getAll: (token: string): Promise<ApiResponse<Admin[]>> => {
    return authenticatedRequest<Admin[]>("/admin", token, { method: "GET" })
  },

  // Créer un nouvel administrateur
  create: (token: string, adminData: Omit<Admin, "id" | "createdAt" | "updatedAt">): Promise<ApiResponse<Admin>> => {
    return authenticatedRequest<Admin>("/admin", token, {
      method: "POST",
      body: JSON.stringify(adminData),
    })
  },

  // Mettre à jour un administrateur
  update: (token: string, id: number, adminData: Partial<Admin>): Promise<ApiResponse<Admin>> => {
    return authenticatedRequest<Admin>(`/admin/${id}`, token, {
      method: "PUT",
      body: JSON.stringify(adminData),
    })
  },

  // Supprimer un administrateur
  delete: (token: string, id: number): Promise<ApiResponse<{ message: string }>> => {
    return authenticatedRequest<{ message: string }>(`/admin/${id}`, token, {
      method: "DELETE",
    })
  },
}

// ==================== GESTION DES PARTICIPANTS ====================

export const participantApi = {
  // Récupérer tous les participants
  getAll: (token: string): Promise<ApiResponse<Participant[]>> => {
    return authenticatedRequest<Participant[]>("/participants", token, { method: "GET" })
  },

  // Récupérer un participant par ID
  getById: (token: string, id: number): Promise<ApiResponse<Participant>> => {
    return authenticatedRequest<Participant>(`/participants/${id}`, token, { method: "GET" })
  },

  // Créer un nouveau participant
  create: (
    token: string,
    participantData: Omit<Participant, "id" | "createdAt" | "updatedAt" | "code_unique">,
  ): Promise<ApiResponse<Participant>> => {
    return authenticatedRequest<Participant>("/participants", token, {
      method: "POST",
      body: JSON.stringify(participantData),
    })
  },

  // Mettre à jour un participant
  update: (token: string, id: number, participantData: Partial<Participant>): Promise<ApiResponse<Participant>> => {
    return authenticatedRequest<Participant>(`/participants/${id}`, token, {
      method: "PUT",
      body: JSON.stringify(participantData),
    })
  },

  // Supprimer un participant
  delete: (token: string, id: number): Promise<ApiResponse<{ message: string }>> => {
    return authenticatedRequest<{ message: string }>(`/participants/${id}`, token, {
      method: "DELETE",
    })
  },

  // Régénérer le code unique d'un participant
  regenerateCode: (token: string, id: number): Promise<ApiResponse<{ message: string }>> => {
    return authenticatedRequest<{ message: string }>(`/participants/${id}/regenerate-code`, token, {
      method: "POST",
    })
  },
}

// ==================== GESTION DES ANNIVERSAIRES ====================

export const anniversaireApi = {
  // Récupérer tous les anniversaires
  getAll: (token: string): Promise<ApiResponse<Anniversaire[]>> => {
    return authenticatedRequest<Anniversaire[]>("/anniversaires", token, { method: "GET" })
  },

  // Récupérer un anniversaire par ID
  getById: (token: string, id: number): Promise<ApiResponse<Anniversaire>> => {
    return authenticatedRequest<Anniversaire>(`/anniversaires/${id}`, token, { method: "GET" })
  },

  // Créer un nouvel anniversaire
  create: (
    token: string,
    anniversaireData: Omit<Anniversaire, "id" | "createdAt" | "updatedAt" | "currentParticipants">,
  ): Promise<ApiResponse<Anniversaire>> => {
    return authenticatedRequest<Anniversaire>("/anniversaires", token, {
      method: "POST",
      body: JSON.stringify(anniversaireData),
    })
  },

  // Mettre à jour un anniversaire
  update: (token: string, id: number, anniversaireData: Partial<Anniversaire>): Promise<ApiResponse<Anniversaire>> => {
    return authenticatedRequest<Anniversaire>(`/anniversaires/${id}`, token, {
      method: "PUT",
      body: JSON.stringify(anniversaireData),
    })
  },

  // Supprimer un anniversaire
  delete: (token: string, id: number): Promise<ApiResponse<{ message: string }>> => {
    return authenticatedRequest<{ message: string }>(`/anniversaires/${id}`, token, {
      method: "DELETE",
    })
  },

  // Ajouter un participant à un anniversaire
  addParticipant: (
    token: string,
    anniversaireId: number,
    participantId: number,
  ): Promise<ApiResponse<Anniversaire>> => {
    return authenticatedRequest<Anniversaire>(`/anniversaires/${anniversaireId}/participants`, token, {
      method: "POST",
      body: JSON.stringify({ participantId }),
    })
  },

  // Retirer un participant d'un anniversaire
  removeParticipant: (
    token: string,
    anniversaireId: number,
    participantId: number,
  ): Promise<ApiResponse<Anniversaire>> => {
    return authenticatedRequest<Anniversaire>(`/anniversaires/${anniversaireId}/participants/${participantId}`, token, {
      method: "DELETE",
    })
  },
}

// ==================== GESTION DU TOKEN CÔTÉ CLIENT ====================

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

  // Déconnexion
  logout: (type: "admin" | "participant" = "participant") => {
    tokenManager.removeToken(type)
    if (typeof window !== "undefined") {
      window.location.href = type === "admin" ? "/admin/login" : "/login"
    }
  },
}

// ==================== FONCTIONS UTILITAIRES ====================

// Export des données en CSV
export const exportData = {
  exportParticipants: async (token: string): Promise<void> => {
    const response = await participantApi.getAll(token)
    if (response.success && response.data) {
      const csvContent = [
        ["Prénom", "Nom", "Email", "Statut", "Accompagnants", "Date d'inscription"],
        ...response.data.map((p) => [
          p.prenom,
          p.nom,
          p.email,
          p.est_confirme ? "Confirmé" : "En attente",
          p.guests?.toString() || "0",
          new Date(p.createdAt).toLocaleDateString(),
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "participants.csv"
      a.click()
      window.URL.revokeObjectURL(url)
    }
  },
}

// Hook personnalisé pour l'authentification
export const useAuth = (type: "admin" | "participant" = "participant") => {
  const token = tokenManager.getToken(type)
  const isAuthenticated = !!token

  const login = async (credentials: LoginCredentials) => {
    const response =
      type === "admin" ? await authApi.adminLogin(credentials) : await authApi.participantLogin(credentials)

    if (response.success && response.data?.token) {
      tokenManager.setToken(response.data.token, type)
      return response
    }
    return response
  }

  const logout = () => {
    tokenManager.logout(type)
  }

  return {
    token,
    isAuthenticated,
    login,
    logout,
    setToken: (newToken: string) => tokenManager.setToken(newToken, type),
  }
}
