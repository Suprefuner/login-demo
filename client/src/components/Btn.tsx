import { cn } from "../lib/utils"

interface BtnProps {
  label: string
  type: 'submit' | 'button'
  onClick: any
  disabled?: boolean
  className?: string
}

export default function Btn({
  label,
  type = 'submit',
  onClick,
  disabled,
  className
}: BtnProps) {
  return (
    <button
      type={type}
      className={cn(
        `w-full !mt-6 py-2 px-4
        bg-blue-500 text-white rounded-md transition
        disabled:bg-slate-500 disabled:text-gray-300
        disabled:cursor-not-allowed`,
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {disabled ? 'Loading...' : label}
    </button>
  )
}