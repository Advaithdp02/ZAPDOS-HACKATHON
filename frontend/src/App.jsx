import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import ForgotPassword from "./pages/ForgotPassword"
import Register from "./pages/Register"
import Home from "./pages/Home"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
