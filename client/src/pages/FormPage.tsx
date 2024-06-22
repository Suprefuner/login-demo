import { useState } from "react";
import Form from "../components/form/Form";
import { useLocation } from "react-router-dom";

const routeToForm = {
  '/login': 'login',
  '/register' : 'register'
}
export default function FormPage() {
  const location = useLocation()
  const [formType, setFormType] = useState<string>(routeToForm[location.pathname]);

  const toggleFormType = () => {
    setFormType(prev => prev === 'login' ? 'register' : 'login')
  }
  
  return (
    <div className="h-screen flex justify-center items-start pt-48">
      <div className="w-96 mx-auto p-8 space-y-4 rounded-md border border-gray-400">
        <h1 className="text-3xl font-bold text-center">
          {formType[0].toUpperCase()}{formType.substring(1)}
        </h1>

        <Form
          formType={formType}
          toggleFormType={toggleFormType}
        />
      </div>
    </div>
  )
}