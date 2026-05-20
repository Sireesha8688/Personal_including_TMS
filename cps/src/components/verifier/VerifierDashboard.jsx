import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Container,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";

export default function VerifierDashboard({ id }) {
  const theme = useTheme();

  const [availability, setAvailability] = useState(false);
  const [loading, setLoading] = useState(true);
  const [verifierName, setVerifierName] = useState("");
  const [hospitalCounts, setHospitalCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [reimbursementCounts, setReimbursementCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    // Fetch verifier details for name and availability
    fetch(`http://localhost:9090/verifiers`)
      .then((res) => res.json())
      .then((verifiers) => {
        const verifier = verifiers.find((v) => String(v.id) === String(id));
        setAvailability(verifier?.available || false);
        setVerifierName(
          verifier?.name || verifier?.fullName || verifier?.email || "Verifier"
        );
      })
      .catch(() => {
        setAvailability(false);
        setVerifierName("Verifier");
      });

    // Fetch hospital claims filtered by verifierId
    fetch(`http://localhost:9090/hospitalclaims`)
      .then((res) => res.json())
      .then((claims) => {
        const filtered = claims.filter(
          (c) => String(c.verifierId) === String(id)
        );
        const counts = { pending: 0, approved: 0, rejected: 0 };
        filtered.forEach((c) => {
          const status = (
            c.verifierStatus ||
            c.verfierStatus ||
            c.veriferStatus ||
            ""
          ).toLowerCase();
          if (status in counts) counts[status]++;
        });
        setHospitalCounts(counts);
      })
      .catch(() => {
        setHospitalCounts({ pending: 0, approved: 0, rejected: 0 });
      });

    // Fetch reimbursement claims filtered by verifierId
    fetch(`http://localhost:9090/customerclaims`)
      .then((res) => res.json())
      .then((reimbursements) => {
        const filtered = reimbursements.filter(
          (r) => String(r.verifierId) === String(id)
        );
        const counts = { pending: 0, approved: 0, rejected: 0 };
        filtered.forEach((r) => {
          const status = (
            r.verifierStatus ||
            r.verfierStatus ||
            r.veriferStatus ||
            ""
          ).toLowerCase();
          if (status in counts) counts[status]++;
        });
        setReimbursementCounts(counts);
      })
      .catch(() => {
        setReimbursementCounts({ pending: 0, approved: 0, rejected: 0 });
      });

    setLoading(false);
  }, [id]);

  function StatCard({ title, count, color, icon, image, isTextCount }) {
    return (
      <Card
        sx={{
          width: 320, // fixed width for consistent sizing
          borderRadius: 3,
          boxShadow: 4,
          overflow: "hidden",
          bgcolor: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 2,
        }}
      >
        {image && (
          <Box
            component="img"
            src={image}
            alt={title}
            sx={{ width: "100%", height: 140, objectFit: "cover" }}
          />
        )}
        <Avatar
          sx={{
            bgcolor: color,
            width: 64,
            height: 64,
            mt: image ? -4 : 2,
            mb: 2,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          {icon}
        </Avatar>
        <CardContent
          sx={{
            textAlign: "center",
            pt: 0,
            pb: 3,
            px: 3,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" sx={{ color, fontWeight: 700, mb: 1 }}>
            {isTextCount ? count : (count ?? 0)}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "#333", fontWeight: 600 }}
          >
            {title}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  const hospitalCards = [
    {
      title: "Pending Hospital Claims",
      count: hospitalCounts.pending,
      color: "#fbc02d",
      icon: <HourglassEmptyIcon sx={{ fontSize: 48, color: "#fff" }} />,
      image:
        "https://img.freepik.com/premium-vector/cartoon-illustration-hospital-with-red-cross-it_917506-477070.jpg",
    },
    {
      title: "Approved Hospital Claims",
      count: hospitalCounts.approved,
      color: "#43a047",
      icon: <CheckCircleIcon sx={{ fontSize: 48, color: "#fff" }} />,
      image: "https://wallpaperaccess.com/full/624111.jpg",
    },
    {
      title: "Rejected Hospital Claims",
      count: hospitalCounts.rejected,
      color: "#e53935",
      icon: <CancelIcon sx={{ fontSize: 48, color: "#fff" }} />,
      image:
        "https://rainbdm.com/wp-content/uploads/2023/08/Unlike-Social-Media.jpeg",
    },
  ];

  const reimbursementCards = [
    {
      title: "Pending Reimbursement Claims",
      count: reimbursementCounts.pending,
      color: "#fbc02d",
      icon: <HourglassEmptyIcon sx={{ fontSize: 48, color: "#fff" }} />,
      image:
        "https://www.monempresarial.com/wp-content/uploads/2017/11/seguros-1024x614@2x.jpg",
    },
    {
      title: "Approved Reimbursement Claims",
      count: reimbursementCounts.approved,
      color: "#43a047",
      icon: <CheckCircleIcon sx={{ fontSize: 48, color: "#fff" }} />,
      image:
        "https://uploads-ssl.webflow.com/60c917bd0e894b626d4894f0/61376571e3db425b15c08ec0_Capture.JPG",
    },
    {
      title: "Rejected Reimbursement Claims",
      count: reimbursementCounts.rejected,
      color: "#e53935",
      icon: <CancelIcon sx={{ fontSize: 48, color: "#fff" }} />,
      image:
        "https://media.istockphoto.com/id/852477888/photo/business-man-showing-thumbs-down-in-office.jpg?b=1&s=170667a&w=0&k=20&c=FoGdcd6aRBz3vpgYCP9MczMoF2xKA_tqcKyUMF3hsZw=",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: theme.palette.primary.main,
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          Welcome, {verifierName}!
        </Typography>
      </Box>

      {/* First row: Hospital Claims */}
      <Grid container spacing={4} justifyContent="center" sx={{ mb: 3 }}>
        {hospitalCards.map((card) => (
          <Grid
            item
            xs={12}
            md={4}
            key={card.title}
            display="flex"
            justifyContent="center"
          >
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* Second row: Reimbursement Claims */}
      <Grid container spacing={4} justifyContent="center" sx={{ mb: 3 }}>
        {reimbursementCards.map((card) => (
          <Grid
            item
            xs={12}
            md={4}
            key={card.title}
            display="flex"
            justifyContent="center"
          >
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>

      {/* Third row: Availability card centered */}
      <Grid container justifyContent="center">
        <Grid item xs={12} md={4} display="flex" justifyContent="center">
          <StatCard
            title="Availability"
            count={availability ? "Available" : "Unavailable"}
            color={
              availability
                ? theme.palette.success.main
                : theme.palette.error.main
            }
            icon={<AccessibilityNewIcon sx={{ fontSize: 48, color: "#fff" }} />}
            image="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80"
            isTextCount
          />
        </Grid>
      </Grid>
    </Container>
  );
}
