import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Container,
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

const API_BASE_URL = "http://localhost:9090";

const InsurerDashboard = ({ id: insurerid }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    hospitalPreAuth: 0,
    customerPreAuth: 0,
    hospitalRaised: 0,
    customerRaised: 0,
  });

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch all four in parallel
        const [
          hospitalPreAuthRes,
          customerPreAuthRes,
          hospitalRaisedRes,
          customerRaisedRes,
        ] = await Promise.all([
          fetch(
            `${API_BASE_URL}/hospitalclaims?hospitalStatus=PRE_AUTH_INITIATED`
          ),
          fetch(`${API_BASE_URL}/customerclaims?customerStatus=CLAIM_RAISED`),
          fetch(`${API_BASE_URL}/hospitalclaims?hospitalStatus=CLAIM_RAISED`),
          fetch(`${API_BASE_URL}/customerclaims?customerStatus=CLAIM_RAISED`),
        ]);
        const [
          hospitalPreAuth,
          customerPreAuth,
          hospitalRaised,
          customerRaised,
        ] = await Promise.all([
          hospitalPreAuthRes.json(),
          customerPreAuthRes.json(),
          hospitalRaisedRes.json(),
          customerRaisedRes.json(),
        ]);
        setStats({
          hospitalPreAuth: hospitalPreAuth.length,
          customerPreAuth: customerPreAuth.length,
          hospitalRaised: hospitalRaised.length,
          customerRaised: customerRaised.length,
        });
      } catch (err) {
        setError("Failed to fetch dashboard data.");
      }
      setLoading(false);
    };
    getData();
  }, []);

  const cardData = [
    {
      label: "Hospital Pre-Auth Requests",
      count: stats.hospitalPreAuth,
      icon: <LocalHospitalIcon color="primary" sx={{ fontSize: 40 }} />,
      image:
        "https://www.plancover.com/simplify-insurance/wp-content/uploads/2024/02/cashless-claim-process-3-07-2-981x1024.png",
    },
    {
      label: "Customer Pre-Auth Requests",
      count: stats.customerPreAuth,
      icon: <GroupIcon color="secondary" sx={{ fontSize: 40 }} />,
      image:
        "https://sunknowledge.com/wp-content/uploads/2024/09/How-Bureaucracy-Endangers-Psychiatric-Patients.jpg",
    },
    {
      label: "Hospital Raised Claims",
      count: stats.hospitalRaised,
      icon: <AssignmentTurnedInIcon color="success" sx={{ fontSize: 40 }} />,
      image:
        "https://www.shutterstock.com/image-photo/asian-woman-doctor-working-taking-260nw-2449641679.jpg",
    },
    {
      label: "Customer Raised Claims",
      count: stats.customerRaised,
      icon: <AssignmentIndIcon color="warning" sx={{ fontSize: 40 }} />,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7Aa-WKQcLYYZmsmTyxitcjvCTflv73JaFow&s",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" align="center">
        Insurer Dashboard
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {cardData.map((item, idx) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={idx}
              display="flex"
              justifyContent="center"
            >
              <Card
                sx={{
                  // Removed background color here
                  boxShadow: 3,
                  borderRadius: 2,
                  minHeight: 140,
                  width: 320, // fixed width for consistent card size
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  py: 3,
                  px: 2,
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.label}
                  sx={{
                    width: "100%",
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 1,
                    mb: 2,
                  }}
                />
                <CardContent>
                  {item.icon}
                  <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                    {item.count}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {item.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default InsurerDashboard;
