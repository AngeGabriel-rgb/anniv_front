import type { Participant, Anniversaire } from "@/app/types"
import { getAuthToken } from "@/lib/auth"

const API_URL = "https://anniversaire-qqem.onrender.com"

// Function to fetch participants
export async function fetchParticipants(): Promise<Participant[]> {
  const token = getAuthToken()

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

// Function to fetch anniversaires
export async function fetchAnniversaires(): Promise<Anniversaire[]> {
  const token = getAuthToken()

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

// Function to fetch anniversaires for a participant
export async function fetchAnniversairesForParticipant(): Promise<Anniversaire[]> {
  // In a real app, this would fetch from the API with the participant's token
  // For now, we'll return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([])
    }, 800)
  })
}

// Function to create a participant
export async function createParticipant(participantData: {
  nom: string
  prenom: string
  email: string
}): Promise<Participant> {
  const token = getAuthToken()

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

// Function to create an anniversaire
export async function createAnniversaire(anniversaireData: {
  date: string
  description: string
  participantId: string
  adminId: string
}): Promise<Anniversaire> {
  const token = getAuthToken()

  if (!token) {
    throw new Error("Vous n'êtes pas authentifié")
  }

  try {
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
      throw new Error(errorData.message || "Erreur lors de la création de l'anniversaire")
    }

    const data = await response.json()
    return data
  } catch (error: unknown) {
    console.error("Erreur lors de la création de l'anniversaire:", error)
    throw error
  }
}

// Function to delete a participant
export async function deleteParticipant(id: string): Promise<void> {
  const token = getAuthToken()

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

// Function to delete an anniversaire
export async function deleteAnniversaire(id: string): Promise<void> {
  const token = getAuthToken()

  if (!token) {
    throw new Error("Vous n'êtes pas authentifié")
  }

  try {
    const response = await fetch(`${API_URL}/anniversaires/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Erreur lors de la suppression de l'anniversaire")
    }
  } catch (error: unknown) {
    console.error("Erreur lors de la suppression de l'anniversaire:", error)
    throw error
  }
}

// Function to add a participant to an anniversaire
export async function addParticipantToAnniversaire(
  anniversaireId: string,
  participantId: string,
): Promise<Anniversaire> {
  const token = getAuthToken()

  if (!token) {
    throw new Error("Vous n'êtes pas authentifié")
  }

  try {
    const response = await fetch(`${API_URL}/anniversaires/${anniversaireId}/participants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ participantId }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Erreur lors de l'ajout du participant à l'anniversaire")
    }

    const data = await response.json()
    return data
  } catch (error: unknown) {
    console.error("Erreur lors de l'ajout du participant à l'anniversaire:", error)
    throw error
  }
}

// Function to remove a participant from an anniversaire
export async function removeParticipantFromAnniversaire(
  anniversaireId: string,
  participantId: string,
): Promise<Anniversaire> {
  const token = getAuthToken()

  if (!token) {
    throw new Error("Vous n'êtes pas authentifié")
  }

  try {
    const response = await fetch(`${API_URL}/anniversaires/${anniversaireId}/participants/${participantId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Erreur lors de la suppression du participant de l'anniversaire")
    }

    const data = await response.json()
    return data
  } catch (error: unknown) {
    console.error("Erreur lors de la suppression du participant de l'anniversaire:", error)
    throw error
  }
}

//modifie le status du participant dans l'anniversaire

export async function updateParticipant(participantId: string, isConfirmed: boolean) {
  try {
    const response = await fetch(`${API_URL}/participants/${participantId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
      },
      body: JSON.stringify({ est_confirme: isConfirmed }),
    })

    if (!response.ok) {
      throw new Error("Erreur lors de la modification du statut")
    }

    return response.json()
  } catch (error) {
    console.error("Erreur API:", error)
    throw error
  }
}

// Modifier un anniversaire
export async function updateAnniversaire(
  anniversaireId: string,
  anniversaire: {
    titre?: string
    date: string
    description?: string
    participantIds: string[]
  },
) {
  try {
    const response = await fetch(`${API_URL}/anniversaires/${anniversaireId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titre: anniversaire.titre,
        date: anniversaire.date,
        description: anniversaire.description,
        participantIds: anniversaire.participantIds,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Erreur lors de la modification de l'anniversaire")
    }

    return response.json()
  } catch (error) {
    console.error("Erreur API:", error)
    throw error
  }
}
