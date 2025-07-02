import type { Participant, Anniversaire } from "./types"

// URL de l'API mise à jour
const API_URL = "https://idea-r1ff.onrender.com"

// Fonction utilitaire pour récupérer le token d'authentification
function getAuthToken(type: "admin" | "participant" = "admin"): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(`${type}Token`)
  }
  return null
}

// ==================== GESTION DES PARTICIPANTS ====================

// Récupérer tous les participants
export async function fetchParticipants(): Promise<Participant[]> {
  const token = getAuthToken("admin")

  if (!token) {
    throw new Error("Vous n'êtes pas authentifié")
  }

  try {
    const response = await fetch(`${API_URL}/participants`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Erreur lors de la récupération des participants")
    }

    const data = await response.json()
    return data
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération des participants:", error)
    throw error
  }
}

// Récupérer un participant par ID
export async function fetchParticipantById(id: string): Promise<Participant> {
  const token = getAuthToken("admin")

  if (!token) {
    throw new Error("Vous n'êtes pas authentifié")
  }

  try {
    const response = await fetch(`${API_URL}/participants/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Erreur lors de la récupération du participant")
    }

    const data = await response.json()
    return data
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération du participant:", error)
    throw error
  }
}

// Créer un nouveau participant
export async function createParticipant(participantData: {
  nom: string
  prenom: string
  email: string
  guests?: number
}): Promise<Participant> {
  const token = getAuthToken("admin")

  if (!token) {
    throw new Error("Vous n'êtes pas authentifié")
  }

  try {
    const response = await fetch(`${API_URL}/participants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(participantData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Erreur lors de la création du participant")
    }

    const data = await response.json()
    return data
  } catch (error: unknown) {
    console.error("Erreur lors de la création du participant:", error)
    throw error
  }
}

// Mettre à jour un participant
export async function updateParticipant(
  participantId: string,
  updateData: {
    nom?: string
    prenom?: string
    email?: string
    est_confirme?: boolean
    guests?: number
  },
): Promise<Participant> {
  const token = getAuthToken("admin")

  if (!token) {
    throw new Error("Vous n'êtes pas authentifié")
  }

  try {
    const response = await fetch(`${API_URL}/participants/${participantId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Erreur lors de la modification du participant")
    }

    const data = await response.json()
    return data
  } catch (error: unknown) {
    console.error("Erreur lors de la modification du participant:", error)
    throw error
  }
}

// Supprimer un participant
export async function deleteParticipant(id: string): Promise<void> {
  const token = getAuthToken("admin")

  if (!token) {
    throw new Error("Vous n'êtes pas authentifié")
  }

  try {
    const response = await fetch(`${API_URL}/participants/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Erreur lors de la suppression du participant")
    }
  } catch (error: unknown) {
    console.error("Erreur lors de la suppression du participant:", error)
    throw error
  }
}

// Régénérer le code unique d'un participant
export async function regenerateParticipantCode(id: string): Promise<{ message: string }> {
  const token = getAuthToken("admin")

  if (!token) {
    throw new Error("Vous n'êtes pas authentifié")
  }

  try {
    const response = await fetch(`${API_URL}/participants/${id}/regenerate-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Erreur lors de la régénération du code")
    }

    const data = await response.json()
    return data
  } catch (error: unknown) {
    console.error("Erreur lors de la régénération du code:", error)
    throw error
  }
}

// ==================== GESTION DES ANNIVERSAIRES ====================

// Récupérer tous les anniversaires
export async function fetchAnniversaires(): Promise<Anniversaire[]> {
  const token = getAuthToken("admin")

  if (!token) {
    throw new Error("Vous n'êtes pas authentifié")
  }

  try {
    const response = await fetch(`${API_URL}/anniversaires`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Erreur lors de la récupération des anniversaires")
    }

    const data = await response.json()
    return data
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération des anniversaires:", error)
    throw error
  }
}

// Récupérer un anniversaire par ID
export async function fetchAnniversaireById(id: string): Promise<Anniversaire> {
  const token = getAuthToken("admin")

  if (!token) {
    throw new Error("Vous n'êtes pas authentifié")
  }

  try {
    const response = await fetch(`${API_URL}/anniversaires/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Erreur lors de la récupération de l'anniversaire")
    }

    const data = await response.json()
    return data
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération de l'anniversaire:", error)
    throw error
  }
}

// Créer un nouvel anniversaire
export async function createAnniversaire(anniversaireData: {
  date: string
  description?: string
  participantId: number
  adminId: number
}): Promise<Anniversaire> {
  const token = getAuthToken("admin")

  if (!token) {
    throw new Error("Vous n'êtes pas authentifié")
  }

  try {
    console.log("Envoi des données à l'API:", anniversaireData)

    const response = await fetch(`${API_URL}/anniversaires`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(anniversaireData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Erreur API:", errorData)
      throw new Error(errorData.message || "Erreur lors de la création de l'anniversaire")
    }

    const data = await response.json()
    console.log("Réponse API:", data)
    return data
  } catch (error: unknown) {
    console.error("Erreur lors de la création de l'anniversaire:", error)
    throw error
  }
}

// Modifier un anniversaire
export async function updateAnniversaire(
  anniversaireId: string,
  anniversaireData: {
    date?: string
    description?: string
    participantId?: number
  },
): Promise<Anniversaire> {
  const token = getAuthToken("admin")

  if (!token) {
    throw new Error("Vous n'êtes pas authentifié")
  }

  try {
    console.log("Modification anniversaire:", anniversaireId, anniversaireData)

    const response = await fetch(`${API_URL}/anniversaires/${anniversaireId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(anniversaireData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Erreur modification:", errorData)
      throw new Error(errorData.message || "Erreur lors de la modification de l'anniversaire")
    }

    const data = await response.json()
    return data
  } catch (error: unknown) {
    console.error("Erreur lors de la modification de l'anniversaire:", error)
    throw error
  }
}

// Supprimer un anniversaire
export async function deleteAnniversaire(id: string): Promise<void> {
  const token = getAuthToken("admin")

  if (!token) {
    throw new Error("Vous n'êtes pas authentifié")
  }

  try {
    console.log("Suppression anniversaire:", id)

    const response = await fetch(`${API_URL}/anniversaires/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Erreur suppression:", errorData)
      throw new Error(errorData.message || "Erreur lors de la suppression de l'anniversaire")
    }
  } catch (error: unknown) {
    console.error("Erreur lors de la suppression de l'anniversaire:", error)
    throw error
  }
}

// ==================== AUTHENTIFICATION ====================

// Inscription participant
export async function registerParticipant(userData: {
  nom: string
  prenom: string
  email: string
  password: string
  guests?: number
}): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_URL}/auths/participants/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Erreur lors de l'inscription")
    }

    const data = await response.json()
    return data
  } catch (error: unknown) {
    console.error("Erreur lors de l'inscription du participant:", error)
    throw error
  }
}

// Connexion admin
export async function loginAdmin(credentials: {
  email: string
  password: string
}): Promise<{ token: string }> {
  try {
    const response = await fetch(`${API_URL}/auths/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Erreur lors de la connexion")
    }

    const data = await response.json()
    return data
  } catch (error: unknown) {
    console.error("Erreur lors de la connexion admin:", error)
    throw error
  }
}

// Inscription admin
export async function registerAdmin(userData: {
  nom: string
  prenom: string
  email: string
  password: string
}): Promise<{ message: string; token: string }> {
  try {
    const response = await fetch(`${API_URL}/auths/admin/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Erreur lors de l'inscription")
    }

    const data = await response.json()
    return data
  } catch (error: unknown) {
    console.error("Erreur lors de l'inscription admin:", error)
    throw error
  }
}

// ==================== FONCTIONS UTILITAIRES ====================

// Export des données en CSV
export async function exportParticipantsCSV(): Promise<void> {
  try {
    const participants = await fetchParticipants()

    const csvContent = [
      ["Prénom", "Nom", "Email", "Statut", "Accompagnants", "Date d'inscription"],
      ...participants.map((p) => [
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
  } catch (error) {
    console.error("Erreur lors de l'export CSV:", error)
    throw error
  }
}

// Gestion du token côté client
export const tokenManager = {
  setToken: (token: string, type: "admin" | "participant" = "admin") => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`${type}Token`, token)
    }
  },

  getToken: (type: "admin" | "participant" = "admin"): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(`${type}Token`)
    }
    return null
  },

  removeToken: (type: "admin" | "participant" = "admin") => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`${type}Token`)
    }
  },

  logout: (type: "admin" | "participant" = "admin") => {
    tokenManager.removeToken(type)
    if (typeof window !== "undefined") {
      window.location.href = type === "admin" ? "/admin/login" : "/login"
    }
  },
}
