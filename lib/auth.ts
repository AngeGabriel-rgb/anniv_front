import type { Admin, AdminRegisterData, ApiResponse, RegisterFormData, LoginFormData } from "@/app/types"

const URL_API = "https://anniversaire-9n5a.onrender.com";

// Inscription d'un administrateur
export async function registerAdmin(data: AdminRegisterData): Promise<ApiResponse<Admin>> {
  const apiData = {
    nom: data.lastName,
    prenom: data.firstName,
    email: data.email,
    password: data.password,
  }

  const response = await fetch(`${URL_API}/auths/admin/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(apiData),
  })

  const responseData = await response.json()

  if (!response.ok) {
    throw new Error(responseData.message || "Vous avez déjà un compte")
  }

  if (responseData.token) {
    localStorage.setItem("adminToken", responseData.token)
  }

  return responseData
}

// Connexion d'un administrateur
export async function loginAdmin(email: string, password: string): Promise<ApiResponse<Admin>> {
  const response = await fetch(`${URL_API}/auths/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Échec de la connexion")
  }

  if (data.token) {
    localStorage.setItem("adminToken", data.token)
  }

  return data
}

// Inscription d'un participant
export async function registerParticipant(data: RegisterFormData): Promise<ApiResponse<void>> {
  const apiData = {
    nom: data.name.split(" ")[0] || data.name,
    prenom: data.name.split(" ")[1] || "",
    email: data.email,
    password: data.password,
  }

  const response = await fetch(`${URL_API}/auths/participants/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(apiData),
  })

  const responseData = await response.json()

  if (!response.ok) {
    throw new Error(responseData.message || "Échec de l'inscription")
  }

  return responseData
}

// Connexion d'un participant
export async function loginParticipant(data: LoginFormData): Promise<ApiResponse<void>> {
  const response = await fetch(`${URL_API}/auths/participants/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: data.email, password: data.password }),
  })

  const responseData = await response.json()

  if (!response.ok) {
    throw new Error(responseData.message || "Échec de la connexion")
  }

  if (responseData.token) {
    localStorage.setItem("participantToken", responseData.token)
  }

  return responseData
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("adminToken")
  }
  return null
}

export function getParticipantToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("participantToken")
  }
  return null
}

export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

export function isParticipantAuthenticated(): boolean {
  return !!getParticipantToken()
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminToken")
    window.location.href = "/auths/admin/login"
  }
}

export function logoutParticipant(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("participantToken")
    window.location.href = "/"
  }
}