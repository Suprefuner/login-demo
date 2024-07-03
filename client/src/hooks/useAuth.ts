import { create } from 'zustand'

interface useAuthType {
  userId: string | null
  setUserId: (userId: string | null) => void
  isLoading: boolean,
  setIsLoading: (isLoading: boolean) => void
}

const useAuth = create<useAuthType>((set) => ({
  userId: null,
  setUserId: (userId) => set({ userId }),
  isLoading: true,
  setIsLoading: (isLoading) => set({isLoading})
}))

export default useAuth