import React, { useState } from "react";
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Collapse, Divider, Tooltip
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import SecurityIcon from "@mui/icons-material/Security";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ListIcon from "@mui/icons-material/List";
import UpdateIcon from "@mui/icons-material/Update";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import GavelIcon from '@mui/icons-material/Gavel';
import ClearIcon from '@mui/icons-material/Clear';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import CarCrashIcon from "@mui/icons-material/CarCrash";

const expandedWidth = 240;
const collapsedWidth = 64;

// Sidebar menus per role
const SIDEBAR_CONFIGS = {
  ADMIN: [
    {
      label: "Manage Roles",
      icon: <SecurityIcon />,
      children: [
        { label: "Add Role", icon: <AddIcon />, key: "addRole" },
        { label: "Update Role", icon: <UpdateIcon />, key: "updateRole" },
        { label: "Delete Role", icon: <DeleteIcon />, key: "deleteRole" },
        { label: "Fetch All Roles", icon: <ListIcon />, key: "listRoles" },
      ],
    },
    {
      label: "Manage Users",
      icon: <PeopleIcon />,
      children: [
        { label: "Add User", icon: <AddIcon />, key: "addUser" },
        { label: "Delete User", icon: <DeleteIcon />, key: "deleteUser" },
        { label: "List of All Users", icon: <ListIcon />, key: "listUsers" },
      ],
    },
  ],
  COP: [
    {
      label: "Offence Management",
      icon: <GavelIcon />,
      children: [
        { label: "Add Offence", icon: <AddIcon />, key: "addOffence" },
        { label: "Clear Offence", icon: <ClearIcon />, key: "clearOffence" },
        { label: "Fetch Uncleared Offence Details", icon: <ListIcon />, key: "fetchUnclearedOffence" },
      ],
    },
    {
      label: "Owner & Vehicle",
      icon: <PersonIcon />,
      children: [
        { label: "Fetch Owner Details", icon: <PersonIcon />, key: "fetchOwnerDetails" },
        { label: "Fetch Vehicle", icon: <DirectionsCarIcon />, key: "fetchVehicle" },
        { label: "Fetch Offence Types", icon: <ListIcon />, key: "fetchOffenceTypes" },
      ],
    },
  ],
  CLERK: [],
  RTO: [
    {
      label: "Owner & Vehicle",
      icon: <AssignmentIndIcon />,
      children: [
        { label: "Register Owner", icon: <PersonAddIcon />, key: "registerOwner" },
        { label: "Register Vehicle", icon: <DirectionsCarIcon />, key: "registerVehicle" },
        { label: "Transfer of Ownership", icon: <SwapHorizIcon />, key: "transferOwnership" },
        { label: "Register Owner with Vehicle", icon: <AssignmentIndIcon />, key: "registerOwnerWithVehicle" },
        { label: "Delete Owner", icon: <PersonRemoveIcon />, key: "deleteOwner" },
        { label: "Delete Vehicle", icon: <CarCrashIcon />, key: "deleteVehicle" },
      ],
    },
    {
      label: "Offence Types",
      icon: <GavelIcon />,
      children: [
        { label: "Add Offence Type", icon: <AddIcon />, key: "addOffenceType" },
        { label: "Update Offence Type", icon: <UpdateIcon />, key: "updateOffenceType" },
        { label: "Delete Offence Type", icon: <DeleteIcon />, key: "deleteOffenceType" },
        { label: "List Offence Types", icon: <ListIcon />, key: "listOffenceTypes" },
      ],
    },
    {
      label: "Reports",
      icon: <AssessmentIcon />,
      children: [
        { label: "Generate Reports", icon: <AssessmentIcon />, key: "generateReports" },
      ],
    },
  ],
  OWNER: [
    // No groups, only flat menu items
    {
      label: "View Vehicle Details",
      icon: <DirectionsCarIcon />,
      key: "viewVehicleDetails",
    },
    {
      label: "View Offences",
      icon: <GavelIcon />,
      key: "viewOffences",
    },
  ],
};

export default function Sidebar({ selectedKey, onSelect, collapsed, role }) {
  const sidebarConfig = SIDEBAR_CONFIGS[role] || SIDEBAR_CONFIGS.ADMIN;

  const [openSections, setOpenSections] = useState(() => {
    const initial = {};
    sidebarConfig.forEach(section => {
      if (section.children) {
        initial[section.label] = true;
      }
    });
    return initial;
  });

  const handleToggle = (label) => {
    setOpenSections(prev => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isFlat = role === "OWNER";

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? collapsedWidth : expandedWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: collapsed ? collapsedWidth : expandedWidth,
          boxSizing: "border-box",
          bgcolor: "#23272f",
          color: "#fff",
          transition: "width 0.2s",
          overflowX: "hidden",
        },
      }}
    >
      <List sx={{ pt: 2, marginTop: "50px" }}>
        {sidebarConfig.map((section) => (
          <React.Fragment key={section.label || section.key}>
            {isFlat ? (
              // Flat Menu for OWNER (no collapse)
              <ListItemButton
                key={section.key}
                sx={{
                  pl: collapsed ? 2 : 4,
                  bgcolor: selectedKey === section.key ? "#1a1d23" : "inherit",
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
                onClick={() => onSelect(section.key)}
              >
                <Tooltip
                  title={section.label}
                  placement="right"
                  disableHoverListener={!collapsed}
                >
                  <ListItemIcon
                    sx={{
                      color: "#90caf9",
                      minWidth: 0,
                      mr: collapsed ? 0 : 2,
                      justifyContent: "center",
                    }}
                  >
                    {section.icon}
                  </ListItemIcon>
                </Tooltip>
                {!collapsed && <ListItemText primary={section.label} />}
              </ListItemButton>
            ) : (
              <>
                {/* Group menu item for non-OWNER */}
                <ListItemButton
                  onClick={() => handleToggle(section.label)}
                  sx={{
                    justifyContent: collapsed ? "center" : "flex-start",
                    px: collapsed ? 0 : 2,
                  }}
                >
                  <Tooltip title={section.label} placement="right" disableHoverListener={!collapsed}>
                    <ListItemIcon sx={{ color: "#90caf9", minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: "center" }}>
                      {section.icon}
                    </ListItemIcon>
                  </Tooltip>
                  {!collapsed && <ListItemText primary={section.label} />}
                  {!collapsed && (openSections[section.label] ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
                <Collapse in={openSections[section.label] && !collapsed} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {section.children?.map((item) => (
                      <ListItemButton
                        key={item.key}
                        sx={{
                          pl: collapsed ? 2 : 4,
                          bgcolor: selectedKey === item.key ? "#1a1d23" : "inherit",
                          justifyContent: collapsed ? "center" : "flex-start",
                        }}
                        onClick={() => onSelect(item.key)}
                      >
                        <Tooltip title={item.label} placement="right" disableHoverListener={!collapsed}>
                          <ListItemIcon sx={{ color: "#90caf9", minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: "center" }}>
                            {item.icon}
                          </ListItemIcon>
                        </Tooltip>
                        {!collapsed && <ListItemText primary={item.label} />}
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            )}
            <Divider sx={{ bgcolor: "#333" }} />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
}
