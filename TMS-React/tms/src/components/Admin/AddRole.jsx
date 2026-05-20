import React, { useState } from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Stack,
  Snackbar,
  Alert,
  Slide
} from "@mui/material";
import axios from "axios";

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

export default function AddRole() {
  const [rolename, setRolename] = useState("");
  const [roleDesc, setRoleDesc] = useState("");
  const [loading, setLoading] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success",
    text: "",
  });

  const handleAddRole = async () => {
    if (!rolename.trim() || !roleDesc.trim()) {
      setSnackbar({
        open: true,
        type: "error",
        text: "Both fields are required.",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:7777/api/admin/roles", {
        rolename: rolename.trim(),
        roleDesc: roleDesc.trim(),
      });
      setSnackbar({
        open: true,
        type: "success",
        text: response.data || "Role added successfully!",
      });
      setRolename("");
      setRoleDesc("");
    } catch (err) {
      setSnackbar({
        open: true,
        type: "error",
        text:
          err.response?.data ||
          "Failed to add role. Make sure the role does not already exist.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          minWidth: 350,
          backgroundColor: "white",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, color: "#1976d2" }}>
          Add Role
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Role Name"
            value={rolename}
            onChange={(e) => setRolename(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Role Description"
            value={roleDesc}
            onChange={(e) => setRoleDesc(e.target.value)}
            fullWidth
            required
            multiline
            minRows={2}
          />
          <Button
            variant="contained"
            onClick={handleAddRole}
            disabled={loading}
            sx={{ fontWeight: "bold" }}
          >
            {loading ? "Adding..." : "Add"}
          </Button>
        </Stack>
      </Paper>

      {/* Snackbar Toast Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.type}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {snackbar.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}
