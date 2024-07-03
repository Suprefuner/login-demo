import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import customFetch from "../axios/axios";

import Btn from "../components/Btn";
import useAuth from "../hooks/useAuth";
import useUser from "../hooks/useUser";

export type DashboardContextType = {message: string | null}

export default function DashboardPageLayout() {
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate()
  const location = useLocation()

  const setUserId = useAuth(state => state.setUserId)
  const setUsers = useUser(state=>state.setUsers)

  const accessAdminDashBoard = async () => {
    try {
      await customFetch('/dashboard/admin')
      navigate('/admin')
    } catch (err: any) {
      setMessage(err.response.data.msg);
      console.log('something went wrong when access to admin');
    }
  }

  const handleLogout = async () => {
    try {
      await customFetch.delete('/auth/logout')
      setUserId(null)
      setUsers([])
      navigate('/login')
    } catch (err) {
      console.log(err);
      console.log('something went wrong when logout');
    }
  }

  return (
    <div className="w-4/5 h-[calc(100vh-80px)] mt-8 mx-auto border py-8 rounded-xl">
      <div className="px-8 pb-8 flex items-center border-b">
        <h1 className="text-2xl font-bold">
          Logged in page
        </h1>
        <div className="ml-auto space-x-2">

          {location.pathname !== '/admin' ? (
            <Btn
            label="Admin dashboard"
            type="button"
            onClick={accessAdminDashBoard}
            className="w-max !mt-0"
            />
          ) : (
            <Btn
            label="Dashboard"
            type="button"
            onClick={()=>navigate('/')}
            className="w-max !mt-0"
            />
          )}

          <Btn
            label="Logout"
            type="button"
            onClick={handleLogout}
            className="w-max !mt-0"
          />
        </div>
      </div>

      <Outlet context={{message}}/>
    </div>
  )
}