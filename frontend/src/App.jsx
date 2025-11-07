import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import ForgotPassword from "./pages/ForgotPassword"
import Register from "./pages/Register"
import AdminHome from "./pages/AdminHome"
import StudentManagement from "./pages/StudentManagement";

export default function App() { 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/home" element={<AdminHome />} />
        <Route path="/students" element={<StudentManagement />} />
      </Routes>
    </BrowserRouter>
  )
}
