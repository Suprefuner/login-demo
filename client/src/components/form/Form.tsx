import { formatFormTitle } from "../../lib/form";
import { formType } from "../../types/types";

import ForgotPasswordForm from "./ForgotPasswordForm";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ResetPasswordForm from './ResetPasswordForm';

interface FormProps {
  formType: formType
  setFormType: (type: formType) => void
}

export default function Form({
  formType,
  setFormType
}: FormProps) {

  return (
    <div className="w-96 mx-auto p-8 space-y-4 relative bg-white rounded-2xl border border-gray-200 shadow-xl">

      <h1 className="text-3xl font-bold text-center">
        {formatFormTitle(formType)}
      </h1>

      {formType === 'register' && (
        <RegisterForm setFormType={setFormType} />
      )}

      {formType === 'login' && (
        <LoginForm setFormType={setFormType} />
      )}

      {formType === 'forgot-password' && (
        <ForgotPasswordForm setFormType={setFormType} />
      )}

      {formType === 'reset-password' && (
        <ResetPasswordForm setFormType={setFormType} />
      )}

    </div>
  )
}