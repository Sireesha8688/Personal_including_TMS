import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Avatar,
  useTheme,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import WarningIcon from "@mui/icons-material/Warning";
import ListAltIcon from "@mui/icons-material/ListAlt";
import GroupIcon from "@mui/icons-material/Group";

const HOSPITAL_IMAGE =
  "https://thumbs.dreamstime.com/b/hospital-building-modern-parking-lot-59693686.jpg";

const DashboardStats = ({ hospitalPreauths }) => {
  const theme = useTheme();

  // Count preauths currently admitted
  const admittedCount = hospitalPreauths.filter((p) => p.status === "admitted").length;

  // Count preauths currently completed
  const completedCount = hospitalPreauths.filter((p) => p.status === "completed").length;

  // Count preauths currently emergency
  const emergencyCount = hospitalPreauths.filter((p) => p.status === "emergency").length;

  // Unique patients by customerId
  const uniquePatients = [...new Set(hospitalPreauths.map((p) => p.customerId))].length;

  // Total preauths for hospital
  const totalPreauths = hospitalPreauths.length;

  return (
    <Grid container spacing={3}>
      {/* Admitted */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
          <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 2 }}>
            <LocalHospitalIcon />
          </Avatar>
          <Box>
            <Typography variant="h6">Admitted</Typography>
            <Typography variant="h4" fontWeight="bold">
              {admittedCount}
            </Typography>
          </Box>
        </Card>
      </Grid>

      {/* Completed */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
          <Avatar sx={{ bgcolor: theme.palette.info.main, mr: 2 }}>
            <AssignmentTurnedInIcon />
          </Avatar>
          <Box>
            <Typography variant="h6">Completed</Typography>
            <Typography variant="h4" fontWeight="bold">
              {completedCount}
            </Typography>
          </Box>
        </Card>
      </Grid>

      {/* Emergency */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
          <Avatar sx={{ bgcolor: theme.palette.warning.main, mr: 2 }}>
            <WarningIcon />
          </Avatar>
          <Box>
            <Typography variant="h6">Emergency</Typography>
            <Typography variant="h4" fontWeight="bold">
              {emergencyCount}
            </Typography>
          </Box>
        </Card>
      </Grid>

      {/* Unique Patients */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
          <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 2 }}>
            <GroupIcon />
          </Avatar>
          <Box>
            <Typography variant="h6">Unique Patients</Typography>
            <Typography variant="h4" fontWeight="bold">
              {uniquePatients}
            </Typography>
          </Box>
        </Card>
      </Grid>

      {/* Total Preauths */}
      <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
          <Avatar sx={{ bgcolor: theme.palette.grey[700], mr: 2 }}>
            <ListAltIcon />
          </Avatar>
          <Box>
            <Typography variant="h6">Total Preauths</Typography>
            <Typography variant="h4" fontWeight="bold">
              {totalPreauths}
            </Typography>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

const Dashboard = ({ currentHospital, preauths }) => {
  const theme = useTheme();

  // Filter preauths for the current hospital only
  const hospitalPreauths = preauths.filter(
    (p) => String(p.hospitalId) === String(currentHospital?.id)
  );

  return (
    <Box>
      {/* Hospital Banner */}
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 4,
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 60%, ${theme.palette.primary.light} 100%)`,
          color: "#fff",
          boxShadow: 3,
        }}
      >
        <CardMedia
          component="img"
          image={HOSPITAL_IMAGE}
          alt="Hospital"
          sx={{
            width: 140,
            height: 140,
            objectFit: "cover",
            borderRadius: "50%",
            m: 2,
            border: "4px solid #fff",
            boxShadow: 3,
          }}
        />
        <CardContent>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Welcome, {currentHospital?.name || "Hospital"}!
          </Typography>
          <Typography variant="subtitle1" sx={{ color: "#f5f5f5" }}>
            {currentHospital?.address?.city
              ? `Location: ${currentHospital.address.city}, ${currentHospital.address.state}`
              : ""}
          </Typography>
          <Typography variant="subtitle2" sx={{ color: "#f5f5f5" }}>
            {currentHospital?.contact_info?.email
              ? `Contact: ${currentHospital.contact_info.email}`
              : ""}
          </Typography>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <DashboardStats hospitalPreauths={hospitalPreauths} />
    </Box>
  );
};

export default Dashboard;
