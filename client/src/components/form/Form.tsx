import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import customFetch from '../../axios/axios';
import Btn from "../Btn";
import FormRow from "./FormRow";
import useAuth from "../../hooks/useAuth";


interface FormProps {
  formType: string
  toggleFormType: ()=>void
}

export default function Form({
  formType, 
  toggleFormType
}: FormProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const navigate = useNavigate()
  const setUserId = useAuth(state=>state.setUserId)

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    formType === 'register' ? handleRegister() : handleLogin()
  }

  const handleLogin = async() => {
    const isFormFilled = !!(email && password)
    
    if (!isFormFilled) {
      return console.log('empty field, cannot submit');
    }

    try {
      let formData = { email, password }

      const { data } = await customFetch.post('/auth/login', formData)
      setMessage(data.message)

      if (data.success) {
        setEmail('')
        setPassword('')
        setUserId(data.user)
        return navigate('/')
      }
    } catch (err) {
      console.log(err);
      console.log('something went wrong from register');
    }
  }

  const handleRegister = async () => {
    const isFormFilled = !!(email && password && passwordConfirm)
    
    if (!isFormFilled) {
      return console.log('empty field, cannot submit');
    }
      
    try {
      let formData = { email, password, passwordConfirm }

      const { data } = await customFetch.post('/auth/register', formData)
      
      setMessage(data.message)

      if (data.success) {
        toggleFormType()
        setEmail('')
        setPassword('')
        setPasswordConfirm('')
      }
      
    } catch (err) {
      console.log(err);
      console.log('something went wrong from register');
    }
  }

  return (
    <form className="space-y-4">
      <FormRow 
        fieldName="email" 
        value={email} 
        handleChange={setEmail} />
      
      <FormRow 
        fieldName="password" 
        value={password} 
        handleChange={setPassword} />
      
      {formType === 'register' && (
        <FormRow 
          fieldName="passwordConfirm" 
          value={passwordConfirm} 
          handleChange={setPasswordConfirm} />
      )}

      <Link
        to={formType === 'register' ? "/login" : "/register"} className="inline-block"
        onClick={toggleFormType}>
        {formType === 'register' ? 'have an account already?' : 'create an account'}
      </Link>

      <Btn
        label="Submit"
        type="submit" 
        onClick={handleSubmit}
      />

      {message && <p>{message}</p>}
    </form>
  )
}