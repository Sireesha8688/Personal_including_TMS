import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import HeaderBar from "../../components/HeaderBar";
import Sidebar from "../../components/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";

// Components mapped to keys
import ViewVehicleDetails from "./ViewVehicleDetails";
import ViewOffences from "./ViewOffences";

export default function OwnerDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || { username: "Owner", rolename: "USER" };

  const [selectedKey, setSelectedKey] = useState("viewVehicleDetails");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const COMPONENT_MAP = {
    viewVehicleDetails: <ViewVehicleDetails user={user} />,
    viewOffences: <ViewOffences user={user} />,
  };

  const handleLogout = () => {
    navigate("/", { replace: true });
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#e3eafc" }}>
      <HeaderBar
        user={user}
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
      />
      <Sidebar
        role="OWNER"
        selectedKey={selectedKey}
        onSelect={setSelectedKey}
        collapsed={sidebarCollapsed}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 2,
          pt: 3,
          pb: 5,
          mt: "64px",
          bgcolor: "#f0f3fa",
        }}
      >
        {COMPONENT_MAP[selectedKey] || <Typography>Select a menu item</Typography>}
      </Box>
    </Box>
  );
}
