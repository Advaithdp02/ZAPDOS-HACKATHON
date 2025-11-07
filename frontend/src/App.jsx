import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import ForgotPassword from "./pages/ForgotPassword"
import Register from "./pages/Register"
import CreateCompany from "./components/CreateCompany"
import { Toaster } from "sonner";
// import Home from "./pages/Home"

export default function App() {
  return (
    <BrowserRouter>
    <Toaster position="top-center" richColors />
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} /> 
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/addCompany" element={<CreateCompany/>} />
      </Routes>
    </BrowserRouter>
  )
}
