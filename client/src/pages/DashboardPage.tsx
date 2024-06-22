import { useState } from "react";
import { useNavigate } from "react-router-dom";
import customFetch from "../axios/axios";

import useAuth from "../hooks/useAuth";
import Btn from "../components/Btn";

export default function DashboardPage() {
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate()
  const setUserId = useAuth(state=>state.setUserId)

  const accessAdminDashBoard = async () => {
    try {
      const { data } = await customFetch('/dashboard/admin')
      setMessage(data.message)
    } catch (err:any) {
      console.log(err);
      setMessage(err.response.data.msg)
      console.log('something went wrong when access to admin');
    }
  }

  const handleLogout = async () => {
    try {
      const { data } = await customFetch.delete('/auth/logout')
      if (!data.success) {
        return setMessage(data.message)
      }

      setUserId(null)
      navigate('/login')
    } catch (err) {
      console.log(err);
      console.log('something went wrong when logout');
    }
  }

  return (
    <div className="w-4/5 h-[calc(100vh-80px)] mt-8 mx-auto border py-8 rounded-xl">
      <div className="px-8 pb-8 flex items-center border-b">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="ml-auto space-x-2">

          <Btn
            label="Admin dashboard"
            type="button"
            onClick={accessAdminDashBoard}
            className="w-max !mt-0"
          />
          <Btn
            label="Logout"
            type="button"
            onClick={handleLogout}
            className="w-max !mt-0"
          />
        </div>
      </div>

      <div className="p-8">
        <p>
          {message}
        </p>
      </div>
    </div>
  )
}