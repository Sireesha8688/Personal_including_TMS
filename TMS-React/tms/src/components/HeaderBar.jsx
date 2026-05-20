import React, { useState } from "react";
import {
  AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar, Box
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";

export default function HeaderBar({ user, onLogout, onToggleSidebar }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar position="fixed" sx={{ zIndex: 1201, bgcolor: "#1976d2" }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="toggle sidebar"
          onClick={onToggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Welcome to Traffic Management System
        </Typography>
        <Box>
          <IconButton color="inherit" onClick={handleProfileClick}>
            <Avatar sx={{ bgcolor: "#fff", color: "#1976d2" }}>
              <AccountCircle />
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem disabled>
              <Box>
                <Typography variant="subtitle1">{user?.username || "Admin"}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.rolename || "ADMIN"}
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={() => { handleClose(); onLogout(); }}>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
