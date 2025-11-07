import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import CreateCompany from "./components/CreateCompany";
import CreateJobRole from "./components/CreateJobRole";
import UpdateJobRole from "./components/UpdateJobRole";
import UpdateCompany from "./components/UpdateCompany";
import CreateRecruitmentRound from "./pages/CreateRecruitmentRound";

import ManageRecruitmentResults from "./pages/ManageRecruitmentResults";
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
        <Route path="/addCompany" element={<CreateCompany />} />
        <Route path="/addJob" element={<CreateJobRole />} />
        <Route path="/jobs/:id" element={<UpdateJobRole />} />
        <Route path="/company/update/:id" element={<UpdateCompany />} />

        <Route
          path="/recruitment/create/:jobId"
          element={<CreateRecruitmentRound />}
        />
        <Route
          path="/recruitment/manage/:roundId"
          element={<ManageRecruitmentResults />}
        />

      </Routes>
    </BrowserRouter>
  );
}
