// src/components/Cop/COPDashboard.jsx

import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import HeaderBar from "../../components/HeaderBar";

import AddOffence from "./AddOffence";
import ClearOffence from "./ClearOffence";
import FetchUnclearedOffence from "./FetchUnclearedOffence";
import FetchOwnerDetails from "./FetchOwnerDetails";
import FetchVehicle from "./FetchVehicle";
import FetchOffenceTypes from "./FetchOffenceTypes";

import { useLocation, useNavigate } from "react-router-dom";

export default function COPDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get user info passed via navigation state or fallback
  const user = location.state?.user || { username: "COP User", rolename: "COP" };

  const [selectedKey, setSelectedKey] = useState("addOffence");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // COMPONENTS must be inside the function, after user is defined!
  const COMPONENTS = {
    addOffence: <AddOffence user={user} />,
    clearOffence: <ClearOffence />,
    fetchUnclearedOffence: <FetchUnclearedOffence />,
    fetchOwnerDetails: <FetchOwnerDetails />,
    fetchVehicle: <FetchVehicle />,
    fetchOffenceTypes: <FetchOffenceTypes />,
  };

  const handleLogout = () => {
    navigate("/", { replace: true });
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#e3eafc",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <HeaderBar
        user={user}
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
      />
      <Sidebar
        selectedKey={selectedKey}
        onSelect={setSelectedKey}
        collapsed={sidebarCollapsed}
        role="COP" // Pass the COP role here
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: "margin-left 0.2s",
          minHeight: "calc(100vh - 64px)",
          bgcolor: "#e3eafc",
          width: "100%",
          overflow: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {COMPONENTS[selectedKey] || <div>Select an option from the sidebar</div>}
      </Box>
    </Box>
  );
}
