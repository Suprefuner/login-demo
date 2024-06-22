
import { Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

interface ProtectedRouteProps {
  children: React.ReactNode 
}

const ProtectedRoute = ({ children }:ProtectedRouteProps) => {
  const userId = useAuth(state => state.userId)
  if (!userId) return <Navigate to="/login" />
  return children
}

export default ProtectedRoute