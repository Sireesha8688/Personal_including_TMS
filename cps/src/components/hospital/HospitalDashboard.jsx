import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Grid,
  CircularProgress,
  Alert,
  Avatar,
  Container,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import axios from "axios";

const API_BASE_URL = "http://localhost:9090";

const statCards = [
  {
    label: "Admitted Patients",
    icon: <LocalHospitalIcon fontSize="large" color="primary" />,
    key: "admitted",
    image:
      "https://previews.123rf.com/images/anawat/anawat1709/anawat170900409/85410340-woman-patient-admitted-to-the-hospital.jpg",
  },
  {
    label: "Pre-Auth Requests",
    icon: (
      <AssignmentTurnedInIcon fontSize="large" style={{ color: "#43a047" }} />
    ),
    key: "preAuth",
    image:
      "https://inai.io/hubfs/How%20Can%20Pre-Authorization%20Help%20You%20Save%20MDRs%20and%20Chargebacks%20%281%29%20%281%29.png",
  },
  {
    label: "Discharged Patients",
    icon: <ExitToAppIcon fontSize="large" style={{ color: "#fbc02d" }} />,
    key: "discharged",
    image: "https://www.dsclaw.co.za/wp-content/uploads/patient-discharge.jpg",
  },
];

const HOSPITAL_IMAGE =
  "https://thumbs.dreamstime.com/b/hospital-building-modern-parking-lot-59693686.jpg";

const HospitalDashboard = ({ id: hospitalId }) => {
  const location = useLocation();

  const [hospitalName, setHospitalName] = useState(null);

  const [stats, setStats] = useState({
    admitted: 0,
    preAuth: 0,
    discharged: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  if (!hospitalId) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          Hospital ID not found. Please login again.
        </Alert>
      </Box>
    );
  }

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const { data: claims } = await axios.get(
          `${API_BASE_URL}/hospitalclaims?hospitalId=${hospitalId}`
        );

        const hospitalNameData = await axios.get(
          `${API_BASE_URL}/hospitals/${hospitalId}`
        );

        setHospitalName(hospitalNameData.data.name);
        // Count admitted patients (isAdmitted === true)
        const admitted = claims.filter(
          (c) => c.treatmentDetails && c.treatmentDetails.isAdmitted === true
        ).length;

        // Count pre-auth requests (preAuthorization present)
        const preAuth = claims.filter((c) => c.preAuthorization != null).length;

        // Count discharged patients (isDischarged === true)
        const discharged = claims.filter(
          (c) => c.treatmentDetails && c.treatmentDetails.isDischarged === true
        ).length;

        setStats({
          admitted,
          preAuth,
          discharged,
        });
      } catch (err) {
        setError("Failed to load dashboard stats. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [hospitalId]);

  return (
    <Box sx={{ p: 0, minHeight: "100vh", bgcolor: "#18191a" }}>
      {/* Welcome Banner */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "#90caf9",
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          p: { xs: 2, sm: 4 },
          mb: 3,
        }}
      >
        <Avatar
          src={HOSPITAL_IMAGE}
          sx={{
            width: 100,
            height: 100,
            mr: 4,
            border: "4px solid #fff",
            boxShadow: 2,
          }}
        />
        <Typography
          variant="h3"
          sx={{
            color: "#fff",
            fontWeight: 700,
            letterSpacing: 1,
            textShadow: "1px 1px 6px rgba(0,0,0,0.18)",
          }}
        >
          Welcome, {hospitalName || "Hospital"}!
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          {statCards.map((card) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={card.key}
              display="flex"
              justifyContent="center"
            >
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 4,
                  bgcolor: "#23272f",
                  textAlign: "center",
                  py: 3,
                  px: 2,
                  minHeight: 120,
                  width: 320,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={card.image}
                  alt={card.label}
                  sx={{
                    width: "100%",
                    height: 110,
                    objectFit: "cover",
                    borderRadius: 2,
                    mb: 2,
                  }}
                />
                <Box sx={{ mb: 1 }}>{card.icon}</Box>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color="white"
                  sx={{ mb: 0.5 }}
                >
                  {loading ? <CircularProgress size={28} /> : stats[card.key]}
                </Typography>
                <Typography variant="subtitle1" color="#bbb">
                  {card.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {error && (
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default HospitalDashboard;
