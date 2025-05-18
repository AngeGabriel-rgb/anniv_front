import type { Participant, Anniversaire } from "@/app/types"
import { getAuthToken } from "@/lib/auth"

const API_URL = "http://localhost:8000"

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
  } catch (error: any) {
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
  } catch (error: any) {
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
      resolve([
        {
          id: "1",
          titre: "Anniversaire de Marie",
          date: "2024-05-15T19:00:00",
          location: "Restaurant Le Doré, Paris",
          maxGuests: 30,
          description: "Venez célébrer les 30 ans de Marie dans une ambiance festive et conviviale !",
          isParticipating: true,
        },
        {
          id: "2",
          titre: "Anniversaire de Thomas",
          date: "2024-06-22T20:00:00",
          location: "Salle des fêtes, Lyon",
          maxGuests: 50,
          description: "Thomas fête ses 40 ans ! Buffet, musique et surprises au programme.",
          isParticipating: false,
        },
        {
          id: "3",
          titre: "Anniversaire de Sophie",
          date: "2024-04-10T18:30:00",
          location: "Jardin Botanique, Bordeaux",
          maxGuests: 25,
          description: "Un anniversaire en plein air pour célébrer le printemps et les 35 ans de Sophie.",
          isParticipating: false,
        },
        {
          id: "4",
          titre: "Anniversaire de Lucas",
          date: "2023-12-05T19:00:00",
          location: "Chalet de montagne, Chamonix",
          maxGuests: 15,
          description: "Un week-end à la montagne pour fêter l'anniversaire de Lucas.",
          isParticipating: true,
        },
      ])
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
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
    console.error("Erreur lors de la suppression du participant de l'anniversaire:", error)
    throw error
  }
}
