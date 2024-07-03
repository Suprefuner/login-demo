import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const requiredFields = ['email']

const defaultFormDataValue = createDefaultFormDataValue(requiredFields)

const defaultMessageValue: messageType = {
  type: 'success',
  message: ''
}

export default function ForgotPasswordForm({
  setFormType
}: FormComponentProps) {

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<formDataType>(defaultFormDataValue);
  const [message, setMessage] = useState<messageType>(defaultMessageValue);

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

      const { data } = await customFetch.post(`/auth/forgot-password`, userFormData)
      
      setMessage({
        type: 'success',
        message: data.message
      })

      setFormData(defaultFormDataValue)
      setTimeout(() => navigate('/login'), 3000)

    } catch (err: any) {
      console.log(err);
      console.log(`something went wrong from forgot password`);
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
        fieldName="email"
        value={formData.email!.value}
        isValid={formData.email!.isValid}
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
        remember now?
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