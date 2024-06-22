import { cn } from "../lib/utils"

interface BtnProps {
  label: string
  type: 'submit' | 'button'
  onClick: any
  className?: string
}

export default function Btn({ label, type = 'submit', onClick,className }: BtnProps) {
  return (
    <button
      type={type}
      className={ cn("w-full !mt-6 py-2 px-4 bg-blue-500 text-white rounded-md", className)}
      onClick={onClick}
    >
      {label}
    </button>
  )
}