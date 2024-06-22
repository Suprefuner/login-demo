import { create } from 'zustand'

interface useAuthType {
  userId: string | null
  setUserId: (userId: string | null) => void
}

const useAuth = create<useAuthType>((set) => ({
  userId: null,
  setUserId: (userId)=>set({userId})
}))

export default useAuth