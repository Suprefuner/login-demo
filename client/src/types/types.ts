export type formType = "register" | "login" | "forgot-password" | "reset-password"

export interface FormComponentProps {
  setFormType: (type: formType) => void
}

export interface messageType {
  type: 'success' | 'error'
  message: string
}

interface FormFieldValue {
  value: string;
  isValid: boolean;
}

export interface formDataKeyValueType {
  [key: string]: FormFieldValue | undefined
}

export interface formDataType extends formDataKeyValueType {
  email?: {
    value: string,
    isValid: boolean
  }
  password?: {
    value: string,
    isValid: boolean
  }
  passwordConfirm?: {
    value: string,
    isValid: boolean
  }
}

export interface UserType {
  _id: string
  email: string, 
  role: 'user' | 'admin',
}