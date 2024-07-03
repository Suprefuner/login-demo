import { useNavigate } from "react-router-dom"
import Btn from "../components/Btn"
import useDashboard from "../hooks/routes/useDashboard"

export default function DashboardPage() {
  const { message } = useDashboard()
  const navigate = useNavigate()

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-xl font-bold">
        DashboardPage
      </h2>

      <div>
        <Btn
          type="button"
          label="Change password"
          onClick={() => navigate('/reset')}
          className="w-fit"
        />
      </div>

      <p>
        {message}
      </p>
    </div>
  )
}