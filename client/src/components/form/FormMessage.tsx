import { cn } from "../../lib/utils"
import { messageType } from "../../types/types"

export default function FormMessage({ type, message }: messageType) {
  return (
    <p className={cn("text-center",
      type === 'success'
        ? 'text-green-500'
        : 'text-rose-500')}
    >
      {message}
    </p>
  )
}