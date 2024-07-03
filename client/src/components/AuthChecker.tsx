import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import customFetch from "../axios/axios";
import useAuth from "../hooks/useAuth";

interface AuthCheckerProps {
  children: React.ReactNode
}

export default function AuthChecker({ children }: AuthCheckerProps) {
  const { isLoading, setIsLoading, setUserId } = useAuth()

  const navigate = useNavigate()
  
  const checkIsAuth = async () => {
    try {
      const { data } = await customFetch('/auth')
      if (!data.user) return
      setUserId(data.user.id)
      navigate('/')
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    checkIsAuth()
  }, []);

  if (isLoading) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return children
}