import React, { useState } from "react";
import {
  Typography, Box, TextField, Button, Card, CardContent, Paper
} from "@mui/material";
import axios from "axios";

export default function ViewVehicleDetails({ user }) {
  const [vehNo, setVehNo] = useState("");
  const [regDetails, setRegDetails] = useState(null);
  const [error, setError] = useState("");

  const fetchVehicleDetails = async () => {
    setError("");
    setRegDetails(null);
    try {
      const res = await axios.get(`http://localhost:7777/owner/vehicle-details/${vehNo}`);
      setRegDetails(res.data);
    } catch {
      setError("Vehicle details not found.");
    }
  };

  return (
    <Box sx={{
      minHeight: "calc(100vh - 64px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: "#e3eafc",
      p: 2
    }}>
      <Card sx={{ maxWidth: 500, width: "100%", p: 1 }}>
        <CardContent>
          <Typography
            variant="h4"
            align="center"
            sx={{ color: "#1976d2", fontWeight: 600, mb: 2 }}
          >
            View Vehicle Details
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <TextField
              label="Enter Vehicle Number"
              value={vehNo}
              onChange={(e) => setVehNo(e.target.value.toUpperCase())}
              size="small"
              sx={{ mr: 2 }}
            />
            <Button variant="contained" onClick={fetchVehicleDetails}>
              Fetch Details
            </Button>
          </Box>
          {error && (
            <Typography sx={{ color: "red", mt: 2, textAlign: 'center' }}>{error}</Typography>
          )}
          {regDetails && (
            <Paper sx={{ p: 2, mt: 2, backgroundColor: "#f9f9f9" }}>
              <Typography><b>Vehicle No:</b> {regDetails.vehNo}</Typography>
              <Typography><b>Engine No:</b> {regDetails.vehicle?.engineNo}</Typography>
             
              <Typography><b>Vehicle Type:</b> {regDetails.vehicle?.vehType}</Typography>
              <Typography><b>Model:</b> {regDetails.vehicle?.vehName}</Typography>
              <Typography><b>Owner Name:</b> {regDetails.owner?.fname} {regDetails.owner?.lname}</Typography>
             </Paper>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
