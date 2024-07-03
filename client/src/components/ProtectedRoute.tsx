
import { Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

interface ProtectedRouteProps {
  children: React.ReactNode 
}

const ProtectedRoute = ({ children }:ProtectedRouteProps) => {
  const userId = useAuth(state => state.userId)

  return !userId
    ? <Navigate to="/login" />
    : children
}

export default ProtectedRoute