import { useState } from "react";
import { authFormErrorMessages } from "../../lib/constants"
import { cn } from "../../lib/utils"
import { formDataType } from "../../types/types"
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

interface FormRowProps {
  fieldName: string
  value: string | undefined
  handleChange: React.Dispatch<React.SetStateAction<formDataType>>
  isRequired?: boolean
  isValid?: boolean
}

export default function FormRow({
  fieldName,
  value,
  handleChange,
  isRequired = true,
  isValid = false,
}: FormRowProps) {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const onChange = (e: any) => {
    handleChange(prev => ({
      ...prev,
      [fieldName]: {
        value: e.target.value,
        isValid: prev[fieldName]!.isValid
      }
    }))
  }

  const toggleShowPassword = () => {
    setIsShowPassword(prev => !prev)
  }

  return (
    <div className="space-y-1 relative">
      <label htmlFor={fieldName}>{fieldName}</label>
      <div className="relative">
        <input
          type={
            !fieldName.includes('password') ||
              (fieldName.includes('password') && isShowPassword)
              ? 'text'
              : 'password'
          }
          id={fieldName}
          className={cn(
            "w-full p-2 border rounded-lg shadow-inner focus:outline focus:outline-gray-400 transition-all outline outline-transparent",
            !isValid && 'border-rose-500'
          )}
          name={fieldName}
          value={value}
          onChange={onChange}
          required={isRequired}
        />

        {
          fieldName.includes('password') && isShowPassword &&
          <IoMdEyeOff
            className="size-6 absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
            onClick={toggleShowPassword}
          />
        }
        {
          fieldName.includes('password') && !isShowPassword &&
          <IoMdEye
            className="size-6 absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
            onClick={toggleShowPassword}
          />
        }
        
      </div>
      <p className={cn(
        "absolute bottom-0 left-0 translate-y-full text-sm text-rose-500",
        isValid && 'hidden'
      )}>
        {/* @ts-ignore */}
        {authFormErrorMessages[fieldName]}
      </p>
    </div>
  )
}