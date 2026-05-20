// src/components/verifier/ChangeAvailability.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Switch,
  CircularProgress,
  Alert,
  Paper,
  Container,
  Snackbar,
  FormControlLabel,
  Divider,
} from "@mui/material";

const ChangeAvailability = ({ id }) => {
  const [verifier, setVerifier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Verifier ID not provided.");
      setLoading(false);
      return;
    }

    const fetchVerifier = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:9090/verifiers/${id}`);
        setVerifier(res.data);
        setError("");
      } catch (err) {
        setError("Failed to fetch verifier data.");
      } finally {
        setLoading(false);
      }
    };

    fetchVerifier();
  }, [id]);

  const handleToggle = async () => {
    if (!verifier) return;

    try {
      setUpdating(true);
      const updatedAvailable = !verifier.available;
      await axios.patch(`http://localhost:9090/verifiers/${id}`, {
        available: updatedAvailable,
      });
      setVerifier((prev) => ({ ...prev, available: updatedAvailable }));
      setSuccessMsg(
        `Availability status updated to ${updatedAvailable ? "Available" : "Unavailable"}`
      );
      setError("");
    } catch (err) {
      setError("Failed to update availability.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseSnackbar = () => {
    setError("");
    setSuccessMsg("");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!verifier) {
    return null;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={8} sx={{ p: 5, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Change Availability Status
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Typography variant="h6" color="text.secondary" gutterBottom>
          Verifier Details
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Name:</strong> {verifier.name}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          <strong>Email:</strong> {verifier.email}
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={verifier.available}
              onChange={handleToggle}
              disabled={updating}
              color="primary"
              inputProps={{ "aria-label": "Toggle availability" }}
            />
          }
          label={
            <Typography variant="body1" fontWeight="medium">
              {verifier.available ? "Available" : "Unavailable"}
            </Typography>
          }
          sx={{ userSelect: "none" }}
        />

        {updating && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <CircularProgress size={28} />
          </Box>
        )}

        {/* Error Snackbar */}
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>

        {/* Success Snackbar */}
        <Snackbar
          open={Boolean(successMsg)}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
            {successMsg}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default ChangeAvailability;
