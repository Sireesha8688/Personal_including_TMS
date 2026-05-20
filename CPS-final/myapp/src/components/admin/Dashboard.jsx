import { Box, Typography } from "@mui/material";
import React from "react";

const Dashboard = ({ pathname }) => {
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography>
        Dashboard content for {pathname} in the component of the dashboard
      </Typography>
    </Box>
  );
};

export default Dashboard;
