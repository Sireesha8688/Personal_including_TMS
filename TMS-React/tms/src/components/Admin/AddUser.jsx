import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Stack,
  Snackbar,
  Alert,
  Slide,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

export default function AddUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rolename, setRolename] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(true);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success",
    text: "",
  });

  // Fetch roles for the dropdown
  useEffect(() => {
    async function fetchRoles() {
      setRolesLoading(true);
      try {
        const res = await axios.get("http://localhost:7777/api/admin/roles");
        setRoles(res.data || []);
      } catch (err) {
        setSnackbar({
          open: true,
          type: "error",
          text: "Failed to fetch roles.",
        });
      } finally {
        setRolesLoading(false);
      }
    }
    fetchRoles();
  }, []);

  const handleAddUser = async () => {
    if (!username.trim() || !password.trim() || !rolename) {
      setSnackbar({
        open: true,
        type: "error",
        text: "All fields are required.",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:7777/api/admin/users", {
        username: username.trim(),
        password: password.trim(),
        rolename,
      });
      setSnackbar({
        open: true,
        type: "success",
        text: response.data || "User added successfully!",
      });
      setUsername("");
      setPassword("");
      setRolename("");
    } catch (err) {
      setSnackbar({
        open: true,
        type: "error",
        text:
          err.response?.data ||
          "Failed to add user. Make sure the username does not already exist.",
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
          Add User
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <TextField
            select
            label="Role"
            value={rolename}
            onChange={(e) => setRolename(e.target.value)}
            fullWidth
            required
            disabled={rolesLoading}
          >
            {rolesLoading ? (
              <MenuItem value="">
                <CircularProgress size={20} />
                &nbsp;Loading roles...
              </MenuItem>
            ) : roles.length > 0 ? (
              roles.map((role) => (
                <MenuItem key={role.rolename} value={role.rolename}>
                  {role.rolename}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="">No roles found</MenuItem>
            )}
          </TextField>
          <Button
            variant="contained"
            onClick={handleAddUser}
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
