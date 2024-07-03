import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import customFetch from "../axios/axios"
import useAuth from "../hooks/useAuth"

let count = 0

export default function VerifyPage() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get("email")
  const token = searchParams.get("token")
  
  const navigate = useNavigate()
  const isLoading = useAuth(state=>state.isLoading)

  console.log({ email, token });
  

  if (!email || !token) {
    console.log('missing email or verification token');
    navigate('/login')
    return null
  }

  const verifyUser = async () => {
    try {
      const { data } = await customFetch.post('/auth/verify-email', {
        email, 
        verificationToken: token
      })
      
      console.log('this is data from verify');
      console.log(data);
      navigate('/login', { replace: true })
    } catch (err) {
      console.log(err);
    } 
  }

  useEffect(() => {
    if (isLoading || count > 1) return
    verifyUser();
    count++
    
  }, [isLoading]);

  return (
    <div>VerifyPage</div>
  )
}