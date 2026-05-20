import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";

const HEADER_BG = "#1d1d1d"; // Matches your side nav color

const AppTitle = ({ user, onLogout }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleProfileOpen = () => {
    setProfileOpen(true);
    handleMenuClose();
  };
  const handleProfileClose = () => setProfileOpen(false);
  const handleLogout = () => {
    handleMenuClose();
    onLogout();
  };

  const initial =
    user?.name?.[0]?.toUpperCase() ||
    user?.fullName?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    null;

  return (
    <>
      <Box
        sx={{
          position: "relative",
          bgcolor: HEADER_BG,
          minHeight: 64,
          width: "100%",
          display: "flex",
          alignItems: "center",
          px: 3,
        }}
      >
        {/* Centered Title */}
        <Typography
          variant="h5"
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            mx: "auto",
            width: "fit-content",
            fontWeight: 700,
            letterSpacing: 1,
            color: "#fff",
            textAlign: "center",
            top: "50%",
            transform: "translateY(-50%)",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          Claim Processing System
        </Typography>

        {/* Right Avatar */}
        <Box sx={{ ml: "auto", zIndex: 1 }}>
          <IconButton
            onClick={handleMenuOpen}
            size="large"
            sx={{
              bgcolor: HEADER_BG,
              color: "#fff",
              "&:hover": { bgcolor: "#23272f" },
              borderRadius: "50%",
              width: 40,
              height: 40,
            }}
            aria-label="profile menu"
          >
            <Avatar
              sx={{
                bgcolor: HEADER_BG,
                color: "#fff",
                width: 36,
                height: 36,
                border: "2px solid #fff",
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              {initial || <PersonIcon />}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                bgcolor: HEADER_BG,
                color: "#fff",
                minWidth: 160,
              },
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleProfileOpen}>View Profile</MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{ color: theme.palette.error.main }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Profile Dialog */}
      <Dialog
        open={profileOpen}
        onClose={handleProfileClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: HEADER_BG,
            color: "#fff",
            borderRadius: 2,
            p: 2,
            position: "relative",
          },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: 600, textAlign: "center", position: "relative" }}
        >
          User Profile
          <IconButton
            aria-label="close"
            onClick={handleProfileClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "#fff",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", py: 2 }}>
          <Avatar
            sx={{
              bgcolor: HEADER_BG,
              color: "#fff",
              width: 56,
              height: 56,
              mx: "auto",
              mb: 2,
              border: "2px solid #fff",
              fontWeight: "bold",
              fontSize: 24,
            }}
          >
            {initial || <PersonIcon />}
          </Avatar>
          <Typography variant="h6" gutterBottom>
            {user?.name || user?.fullName || "N/A"}
          </Typography>
          <Typography variant="body2" sx={{ color: "#bbb" }} gutterBottom>
            Email: {user?.email || "N/A"}
          </Typography>
          <Typography variant="body2" sx={{ color: "#bbb" }} gutterBottom>
            Role: {user?.role || "N/A"}
          </Typography>
          <Typography variant="body2" sx={{ color: "#bbb" }}>
            ID: {user?.id || "N/A"}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            onClick={handleProfileClose}
            sx={{ minWidth: 120 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AppTitle;
