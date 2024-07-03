import { formDataKeyValueType, formDataType } from "../types/types";
import { isValidateEmail, isValidatePassword } from "./utils";

const formatFormTitle = (title: string): string => {
  return title[0].toUpperCase() + title.substring(1).replace('-', ' ')
}

const createDefaultFormDataValue = (
  fields: string[]
): formDataKeyValueType => {
  const defaultFormDataValue: formDataKeyValueType = {};
  
  fields.forEach(field => {
    defaultFormDataValue[field] = {
      value: "",
      isValid: true
    };
  });

  return defaultFormDataValue;
};

interface checkFormIsFilledProps {
  fields: string[], 
  formData:formDataType, 
  setFormData:React.Dispatch<React.SetStateAction<formDataType>>,
}

const checkFormIsFilled = ({
  fields, 
  formData, 
  setFormData, 
}:checkFormIsFilledProps):boolean => {
  const emptyFields = fields.filter(field => !formData[field]?.value)

  if (emptyFields.length) {
    emptyFields.forEach(field => {
      setFormData(prev => ({
        ...prev,
        [field]: {
          value: prev[field]?.value || '',
          isValid: false
        }
      }))
    })

    return false
  }

  return true
}

const validateFormData = (
  formData: formDataType,
  setFormData: React.Dispatch<React.SetStateAction<formDataType>>
): boolean => {
  const fields = Object.keys(formData)
  let isAllValid = true

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i]
    if (
      (field === 'email' && !isValidateEmail(formData[field]!.value)) ||
      (field === 'password' && !isValidatePassword(formData.password!.value)) ||
      (field === 'passwordConfirm' && formData.passwordConfirm && formData.password!.value !== formData.passwordConfirm.value)
    ) {

      setFormData(prev => ({
        ...prev,
        [field]: {
          value: formData[field]?.value || '',
          isValid: false
        }
      }))
      isAllValid = false
    }
  }
  return isAllValid
}

const createUserFormData = (
  fields: string[],
  formData: formDataType
) => {
  let userFormData: { [key: string]: string } = {}
  
  fields.forEach(field =>
    userFormData[field] = formData[field]!.value
  )

  return userFormData
}

export {
  checkFormIsFilled, 
  createDefaultFormDataValue, 
  createUserFormData,
  validateFormData,
  formatFormTitle
};
