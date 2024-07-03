import { useState } from "react";
import { useLocation } from "react-router-dom";
import { formType } from "../types/types";
import Form from "../components/form/Form";

const routeToForm: {
  [key: string]: formType
} = {
  '/login': 'login',
  '/register' : 'register',
  '/forgot-password' : 'forgot-password',
  '/reset' : 'reset-password',
}

export default function FormPage() {
  const location = useLocation()
  const [formType, setFormType] = useState<formType>(routeToForm[location.pathname]);
  
  return (
    <div className="h-screen flex justify-center items-start pt-48 bg-gray-200 relative">
        <Form
          formType={formType}
          setFormType={setFormType}
        />
    </div>
  )
}