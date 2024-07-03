import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AuthChecker from "./components/AuthChecker";

import {
  DashboardPageLayout,
  FormPage,
  DashboardPage,
  DashboardAdminPage,
  VerifyPage,
} from './pages'

function App() {
  return (
    <BrowserRouter>
      <AuthChecker>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardPageLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="/admin" element={<DashboardAdminPage />} />
          </Route>
          <Route path="/forgot-password" element={<FormPage />} />
          <Route path="/register" element={<FormPage />} />
          <Route path="/login" element={<FormPage />} />
          <Route path="/reset" element={<FormPage />} />
          <Route path="/user/verify" element={<VerifyPage />} />
        </Routes>
      </AuthChecker>
    </BrowserRouter>
  )
}

export default App
