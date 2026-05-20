import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../Sidebar";
import HeaderBar from "../HeaderBar";
import AddRole from "./AddRole";
import UpdateRole from "./UpdateRole";
import DeleteRole from "./DeleteRole";
import ListRoles from "./ListRoles";
import AddUser from "./AddUser";
import DeleteUser from "./DeleteUser";
import ListUsers from "./ListUsers";
import { useLocation, useNavigate } from "react-router-dom";

const COMPONENTS = {
  addRole: <AddRole />,
  updateRole: <UpdateRole />,
  deleteRole: <DeleteRole />,
  listRoles: <ListRoles />,
  addUser: <AddUser />,
  deleteUser: <DeleteUser />,
  listUsers: <ListUsers />,
};

export default function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user || { username: "Admin", rolename: "ADMIN" };

  const [selectedKey, setSelectedKey] = useState("addRole");
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
      />
      {console.log("selected key ", selectedKey)}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        //   p: 3,
        //   pt: 8, // Adjusted for header
          transition: "margin-left 0.2s",
        //   ml: sidebarCollapsed ? "64px" : "240px",
          minHeight: "calc(100vh - 64px)",
          bgcolor: "#e3eafc",
          width: "100%",
          overflow: "auto",
          display:"flex",
          alignItems:"center",
          justifyContent:"center"
        //   ...((selectedKey === 'deleteRole' || selectedKey=='updateRole') && { mt: "50px" })
        }}
      >
        {COMPONENTS[selectedKey]}
      </Box>
    </Box>
  );
}