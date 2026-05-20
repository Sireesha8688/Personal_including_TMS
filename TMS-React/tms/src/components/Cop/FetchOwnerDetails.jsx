// src/components/Cop/FetchOwnerDetails.jsx
import React, { useState } from "react";
import {
  Typography, Paper, TextField, Button, Box, Stack, Snackbar, Alert
} from "@mui/material";
import axios from "axios";

export default function FetchOwnerDetails() {
  const [vehNo, setVehNo] = useState("");
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, type: "success", text: "" });

  const fetchOwner = async () => {
    if (!vehNo.trim()) {
      setSnackbar({ open: true, type: "error", text: "Please enter a vehicle number." });
      return;
    }
    setLoading(true);
    setOwner(null);
    try {
      const res = await axios.get(`http://localhost:7777/cop/owner-by-vehno/${vehNo.trim()}`);
      setOwner(res.data);
      if (!res.data || Object.keys(res.data).length === 0) {
        setSnackbar({ open: true, type: "info", text: "No owner found for this vehicle." });
      }
    } catch (err) {
      setSnackbar({ open: true, type: "error", text: "Failed to fetch owner details." });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Helper to display owner details except registrations
  const renderOwnerDetails = (ownerObj) => {
    if (!ownerObj) return null;
    // Exclude 'registrations'
    const { registrations, ...ownerFields } = ownerObj;
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, color: "#1976d2" }}>Owner Details</Typography>
        <Stack spacing={1}>
          {Object.entries(ownerFields).map(([key, value]) => (
            <Box key={key} sx={{ fontSize: 15 }}>
              <b>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</b> {value}
            </Box>
          ))}
        </Stack>
      </Box>
    );
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
      <Paper sx={{ p: 3, width: 430 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#1976d2", fontWeight: 600 }}>Fetch Owner Details</Typography>
        <Stack spacing={2}>
          <TextField
            label="Vehicle Number"
            value={vehNo}
            onChange={e => setVehNo(e.target.value)}
            size="small"
            fullWidth
          />
          <Button variant="contained" onClick={fetchOwner} disabled={loading}>
            {loading ? "Fetching..." : "Fetch Owner"}
          </Button>
          {owner && renderOwnerDetails(owner)}
        </Stack>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.type} sx={{ width: "100%" }}>
            {snackbar.text}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}
