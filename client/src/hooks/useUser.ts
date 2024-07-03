import { create } from "zustand";
import { UserType } from "../types/types";

interface useUserType {
  users: UserType[],
  setUsers: (users: UserType[]) => void
}

const useUser = create<useUserType>((set) => ({
  users: [],
  setUsers: (users) => set({users})
}))

export default useUser