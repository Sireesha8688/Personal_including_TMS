import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

const loginTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#1a1a1a",
      paper: "#2a2a2a",
    },
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
    text: {
      primary: "#e0e0e0",
      secondary: "#a0a0a0",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "12px 24px",
          fontWeight: "bold",
        },
      },
    },
  },
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      let role = "";
      let userId = null;
      let loginSuccess = false;
      let loginEndPoint = null;

      if (email.includes(".admin")) {
        role = "Admin";
        loginEndPoint = "admins";
      } else if (email.includes(".user")) {
        role = "Customer";
        loginEndPoint = "customers";
      } else if (email.includes(".ver")) {
        role = "Verifier";
        loginEndPoint = "verifiers";
      } else if (email.includes(".ins")) {
        role = "Insurer";
        loginEndPoint = "insurers";
      } else if (email.includes(".htl")) {
        role = "Hospital";
        loginEndPoint = "hospitals";
      } else {
        setError("Invalid email format for role detection.");
        setLoading(false);
        return;
      }

      const endpoint = `http://localhost:9090/${loginEndPoint}`;
      const response = await axios.get(endpoint);
      const users = response.data;

      const foundUser = users.find(
        (user) => user.email === email && user.password === password
      );

      if (foundUser) {
        userId = foundUser.id;
        loginSuccess = true;
      } else {
        setError("Invalid credentials. Please try again.");
      }

      if (loginSuccess) {
        navigate("/app", {
          state: {
            role: role,
            id: userId,
          },
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={loginTheme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: loginTheme.palette.background.default,
          p: 2,
        }}
      >
        <Container maxWidth="xs">
          <Paper
            elevation={6}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              borderRadius: "12px",
              background: loginTheme.palette.background.paper,
            }}
          >
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              Login
            </Typography>

            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{
                "& .MuiInputLabel-root": {
                  color: loginTheme.palette.text.secondary,
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: loginTheme.palette.primary.main,
                  },
                  "&:hover fieldset": {
                    borderColor: loginTheme.palette.primary.light,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: loginTheme.palette.primary.dark,
                  },
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              sx={{
                "& .MuiInputLabel-root": {
                  color: loginTheme.palette.text.secondary,
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: loginTheme.palette.primary.main,
                  },
                  "&:hover fieldset": {
                    borderColor: loginTheme.palette.primary.light,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: loginTheme.palette.primary.dark,
                  },
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
              disabled={loading}
              sx={{ height: "56px" }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Log In"
              )}
            </Button>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
