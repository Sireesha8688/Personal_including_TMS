// src/pages/RTO/RTODashboard.jsx
import React, { useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import Sidebar from "../../components/Sidebar"; // Use your Sidebar component
import HeaderBar from "../../components/HeaderBar"; // Use your HeaderBar component
import RegisterOwner from "./RegisterOwner";
import RegisterVehicle from "./RegisterVehicle";
import TransferOwnership from "./TransferOwnership";
import RegisterOwnerWithVehicle from "./RegisterOwnerWithVehicle";
import DeleteOwner from "./DeleteOwner";
import DeleteVehicle from "./DeleteVehicle";
import AddOffenceType from "./AddOffenceType";
import UpdateOffenceType from "./UpdateOffenceType";
import DeleteOffenceType from "./DeleteOffenceType";
import ListOffenceTypes from "./ListOffenceTypes";
import GenerateReports from "./GenerateReports";
import { useLocation, useNavigate } from "react-router-dom";

const COMPONENTS = {
  registerOwner: <RegisterOwner />,
  registerVehicle: <RegisterVehicle />,
  transferOwnership: <TransferOwnership />,
  registerOwnerWithVehicle: <RegisterOwnerWithVehicle />,
  deleteOwner: <DeleteOwner />,
  deleteVehicle: <DeleteVehicle />,
  addOffenceType: <AddOffenceType />,
  updateOffenceType: <UpdateOffenceType />,
  deleteOffenceType: <DeleteOffenceType />,
  listOffenceTypes: <ListOffenceTypes />,
  generateReports: <GenerateReports />,
};

export default function RTODashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || { username: "RTO", rolename: "RTO" };

  const [selectedKey, setSelectedKey] = useState("registerOwner");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    navigate("/", { replace: true });
  };

  return (
    <Box sx={{
      display: "flex",
      minHeight: "100vh",
      bgcolor: "#e3eafc",
      width: "100%",
      overflow: "hidden"
    }}>
      <HeaderBar
        user={user}
        onLogout={handleLogout}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
      />
      <Sidebar
        selectedKey={selectedKey}
        onSelect={setSelectedKey}
        collapsed={sidebarCollapsed}
        role="RTO"
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "calc(100vh - 64px)",
          bgcolor: "#e3eafc",
          width: "100%",
          overflow: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {COMPONENTS[selectedKey] || (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h4" sx={{ color: "#1976d2" }}>
              RTO Dashboard
            </Typography>
            <Typography sx={{ mt: 2 }}>
              Welcome, RTO!
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
