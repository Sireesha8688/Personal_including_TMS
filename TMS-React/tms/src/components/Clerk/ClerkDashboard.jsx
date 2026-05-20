import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function ClerkDashboard() {
  return (
    <Box sx={{ minHeight: "100vh", background: "#e3eafc", p: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ color: "#1976d2" }}>
          Clerk Dashboard
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Why did you logged in, Clerk!
        </Typography>
      </Paper>
    </Box>
  );
}
