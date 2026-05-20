import React, { useState, useEffect } from "react";
import {
  Box, TextField, Button, Typography, Container, Paper, Alert, MenuItem
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ROLES = [
  { value: "ADMIN", label: "Admin" },
  { value: "COP", label: "Cop" },
  { value: "CLERK", label: "Clerk" },
  { value: "RTO", label: "RTO" },
  { value: "USER", label: "Owner" },
];

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rolename, setRolename] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:7777/api/admin/users")
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  const handleLogin = () => {
    setError("");
    if (!username || !password || !rolename) {
      setError("All fields are required.");
      return;
    }
    const found = users.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password &&
        u.rolename.toUpperCase() === rolename.toUpperCase()
    );
    if (found) {
      switch (rolename.toUpperCase()) {
        case "ADMIN":
          navigate("/admin/dashboard", { state: { user: found } });
          break;
        case "COP":
          navigate("/cop/dashboard", { state: { user: found } });
          break;
        case "CLERK":
          navigate("/clerk/dashboard", { state: { user: found } });
          break;
        case "RTO":
          navigate("/rto/dashboard", { state: { user: found } });
          break;
        case "USER":
          navigate("/owner/dashboard", { state: { user: found } });
          break;
        default:
          setError("Invalid role.");
      }
    } else {
      setError("Invalid credentials or role.");
    }
  };

  return (
    <Box
      sx={{
        background: "#f4f6fb",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center" // This centers horizontally!
      }}
    >
      <Container maxWidth="xs" disableGutters>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" align="center" sx={{ mb: 3, color: "#1976d2" }}>
            Traffic Management Login
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Username" fullWidth sx={{ mb: 2 }} value={username} onChange={e => setUsername(e.target.value)} />
          <TextField label="Password" type="password" fullWidth sx={{ mb: 2 }} value={password} onChange={e => setPassword(e.target.value)} />
          <TextField
            select
            label="Role"
            fullWidth
            sx={{ mb: 3 }}
            value={rolename}
            onChange={e => setRolename(e.target.value)}
          >
            {ROLES.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" fullWidth sx={{ py: 1.5, fontWeight: "bold", fontSize: 16 }} onClick={handleLogin}>
            Login
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
