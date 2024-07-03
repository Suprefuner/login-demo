import { useState } from "react";
import { 
  Link, 
  useNavigate, 
  useSearchParams
} from "react-router-dom";
import customFetch from '../../axios/axios';

import {
  FormComponentProps,
  formDataType,
  messageType
} from "../../types/types";

import { 
  checkFormIsFilled, 
  createDefaultFormDataValue, 
  createUserFormData, 
  validateFormData
} from "../../lib/form";

import Btn from "../Btn";
import FormMessage from "./FormMessage";
import FormRow from "./FormRow";
import useAuth from "../../hooks/useAuth";

const requiredFields = ['password', 'passwordConfirm']

const defaultFormDataValue = createDefaultFormDataValue(requiredFields)

const defaultMessageValue: messageType = {
  type: 'success',
  message: ''
}

export default function ResetPasswordForm({
  setFormType
}: FormComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<formDataType>(defaultFormDataValue);
  const [message, setMessage] = useState<messageType>(defaultMessageValue);

  const [searchParams] = useSearchParams()
  const email = searchParams.get("email")
  const token = searchParams.get("token")

  const userId = useAuth(state => state.userId)
  const navigate = useNavigate()

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const isFormFilled = checkFormIsFilled({
      fields: requiredFields,
      formData,
      setFormData,
    })

    if (!isFormFilled) {
      return setMessage({
        type: 'error',
        message: 'please fill all the fields to submit'
      })
    }

    const isAllValid = validateFormData(formData, setFormData)

    if (!isAllValid) {
      return setMessage({
        type: 'error',
        message: 'please fill all the fields to submit'
      })
    }

    setFormData(prev => {
      let updateFormData: any = {}
      for (const field in prev) {
        updateFormData[field] = { ...prev[field], isValid: true }
      }

      return updateFormData
    })

    setIsLoading(true)

    try {
      const userFormData = createUserFormData(requiredFields, formData)

      let apiEndPoint = ''

      if (!email && !token) {
        apiEndPoint = `/user/reset-password/${userId}`
      } else if (!email || !token) {
        setFormType('login')
        navigate('/login')
        return
      } else {
        apiEndPoint = '/auth/reset-forgot-password'
        userFormData.email = email!
        userFormData.resetToken = token!
      }

      const { data } = await customFetch.post(`${apiEndPoint}`, userFormData)

      setFormData(defaultFormDataValue)
      setMessage({
        type: 'success',
        message: `${data.message}. Will redirect to login page`
      })

      setTimeout(() => {
        setFormType('login')
        navigate('/login')
      }, 3000)

    } catch (err: any) {
      console.log(err);
      console.log(`something went wrong from reset forgot password`);
      setMessage({
        type: 'error',
        message: err.response.data.msg || err.message
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="space-y-6">
      <FormRow
        fieldName="password"
        value={formData.password!.value}
        isValid={formData.password!.isValid}
        handleChange={setFormData} />

      <FormRow
        fieldName="passwordConfirm"
        value={formData?.passwordConfirm?.value}
        isValid={formData?.passwordConfirm?.isValid}
        handleChange={setFormData} />

      <Link
        to="/login"
        className="inline-block"
        onClick={() => {
          setFormType('login')
          setFormData(defaultFormDataValue)
          setMessage(defaultMessageValue)
        }}
      >
        change your mind?
      </Link>

      <Btn
        label="Submit"
        type="submit"
        onClick={handleSubmit}
        disabled={isLoading}
      />

      {!!message.message && (
        <FormMessage
          type={message.type}
          message={message.message}
        />
      )}
    </form>
  )
}