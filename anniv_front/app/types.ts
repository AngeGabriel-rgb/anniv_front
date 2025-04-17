export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  guests: number;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface Anniversaire {
  id: string;
  title: string;
  date: string;
  location: string;
  maxGuests: number;
  description: string;
  createdAt: string;
}

export interface Participant {
  id: string;
  anniversaireId: string;
  name: string;
  email: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'declined';
  createdAt: string;
}

export interface Admin {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  token?: string;
  message?: string;
}

export interface AdminRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ParticipantRegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}