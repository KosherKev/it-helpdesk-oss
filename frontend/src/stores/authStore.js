import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@services/api'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      
      login: async (credentials) => {
        const response = await api.post('/auth/login', credentials)
        set({ 
          user: response.data.user, 
          token: response.data.token 
        })
        return response.data
      },

      register: async (userData) => {
        const response = await api.post('/auth/register', userData)
        return response.data
      },

      logout: () => {
        set({ user: null, token: null })
      },

      updateUser: (user) => {
        set({ user })
      }
    }),
    {
      name: 'auth-storage',
    }
  )
)
