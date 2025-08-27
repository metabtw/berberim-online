export interface Barber {
  id: string;
  name: string;
  rating: number;
  imageUrl: string;
  isPopular: boolean;
  distanceKm: number;
  openHours: {
    [key: string]: { // ISO date string (YYYY-MM-DD)
      start: string; // HH:mm format
      end: string; // HH:mm format
    };
  };
  bookedSlots: {
    [key: string]: string[]; // ISO date -> array of time slots ["09:00", "10:30"]
  };
  services: Service[];
  address: string;
  phone: string;
  images?: string[];
  reviewCount?: number;
  description?: string;
  workingHours?: {
    [key: string]: string; // day -> hours (e.g., "Pazartesi" -> "09:00 - 18:00")
  };
}

export interface Service {
  id: string;
  name: string;
  duration: number; // minutes
  price: number;
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface SearchFilters {
  location: string;
  date: string; // ISO date string
  time: string; // HH:mm format
}

export interface WaitlistRequest {
  barberId: string;
  date: string;
  time: string;
  userId: string;
}

export interface WaitlistResponse {
  success: boolean;
  message: string;
}