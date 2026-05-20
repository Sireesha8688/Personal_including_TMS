import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./components/Admin/AdminDashboard";
import CopDashboard from "./components/Cop/CopDashboard";
import ClerkDashboard from "./components/Clerk/ClerkDashboard";
import RTODashboard from "./components/RTO/RTODashboard";
import OwnerDashboard from "./components/Owner/OwnerDashboard";

function App() {
return (
<BrowserRouter>
<Routes>
<Route path="/" element={<Login />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route path="/cop/dashboard" element={<CopDashboard />} />
<Route path="/clerk/dashboard" element={<ClerkDashboard />} />
<Route path="/rto/dashboard" element={<RTODashboard />} />
<Route path="/owner/dashboard" element={<OwnerDashboard />} />
</Routes>
</BrowserRouter>
  );
}

export default App;
