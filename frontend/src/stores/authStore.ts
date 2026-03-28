import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthResponse, User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (auth: AuthResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (auth: AuthResponse) => {
        localStorage.setItem('token', auth.token);
        set({
          user: {
            id: auth.id,
            username: auth.username,
            email: auth.email,
            firstName: auth.firstName,
            lastName: auth.lastName,
            role: auth.role as 'ADMIN' | 'DISPATCHER' | 'DRIVER',
            isActive: auth.isActive ?? true, // Default to true if not provided
          },
          token: auth.token,
          isAuthenticated: true,
        });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
