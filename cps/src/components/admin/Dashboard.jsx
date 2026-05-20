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
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import GroupIcon from "@mui/icons-material/Group";
import PolicyIcon from "@mui/icons-material/Policy";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AssignmentIcon from "@mui/icons-material/Assignment";

export default function Dashboard({ user }) {
  const theme = useTheme();

  const [counts, setCounts] = useState({
    admins: 0,
    verifiers: 0,
    insurers: 0,
    policies: 0,
    covers: 0,
    claimTypes: 0,
  });

  useEffect(() => {
    const fetchCount = async (url, key) => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setCounts((c) => ({
          ...c,
          [key]: Array.isArray(data)
            ? data.length
            : Array.isArray(data[key])
              ? data[key].length
              : 0,
        }));
      } catch {
        setCounts((c) => ({ ...c, [key]: 0 }));
      }
    };
    fetchCount("http://localhost:9090/admins", "admins");
    fetchCount("http://localhost:9090/verifiers", "verifiers");
    fetchCount("http://localhost:9090/insurers", "insurers");
    fetchCount("http://localhost:9090/policy", "policies");
    fetchCount("http://localhost:9090/covers", "covers");
    fetchCount("http://localhost:9090/claimTypes", "claimTypes");
  }, []);

  const cardData = [
    {
      title: "Admins",
      count: counts.admins,
      color: "#8e24aa",
      icon: <SupervisorAccountIcon sx={{ fontSize: 36, color: "#fff" }} />,
      image:
        "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=600&q=80",
    },
    {
      title: "Verifiers",
      count: counts.verifiers,
      color: "#43a047",
      icon: <VerifiedUserIcon sx={{ fontSize: 36, color: "#fff" }} />,
      image: "https://ichef.bbci.co.uk/images/ic/1200xn/p0dyhwh2.jpg",
    },
    {
      title: "Insurers",
      count: counts.insurers,
      color: "#1976d2",
      icon: <GroupIcon sx={{ fontSize: 36, color: "#fff" }} />,
      image:
        "https://tse4.mm.bing.net/th/id/OIP.MMH3tBNxeXv9F6VXWIKtGAHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    {
      title: "Policies",
      count: counts.policies,
      color: "#0288d1",
      icon: <PolicyIcon sx={{ fontSize: 36, color: "#fff" }} />,
      image:
        "https://media.istockphoto.com/id/2159393412/photo/medical-and-healthcare-concept.jpg?s=612x612&w=0&k=20&c=4J0j1SfdhzJesVyKWlrrC38BOW_H0DLJ8u0VP9km7cg=",
    },
    {
      title: "Covers",
      count: counts.covers,
      color: "#fbc02d",
      icon: <ShoppingCartIcon sx={{ fontSize: 36, color: "#fff" }} />,
      image:
        "https://tse4.mm.bing.net/th/id/OIP.5s9ZxnfOE0gXHWuJb0Z6pwHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    {
      title: "Claim Types",
      count: counts.claimTypes,
      color: "#e53935",
      icon: <AssignmentIcon sx={{ fontSize: 36, color: "#fff" }} />,
      image:
        "https://www.damcogroup.com/insurance/wp-content/themes/insurance/img/services/claims-management-software/smart-claims-management.jpg",
    },
  ];

  function StatCard({ title, count, color, icon, image }) {
    return (
      <Card
        sx={{
          width: 320,
          borderRadius: 3,
          boxShadow: 4,
          overflow: "hidden",
          bgcolor: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={image}
          alt={title}
          sx={{ width: "100%", height: 140, objectFit: "cover" }}
        />
        <Avatar
          sx={{
            bgcolor: color,
            width: 64,
            height: 64,
            mt: -4,
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
            {count}
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
          Welcome, {user?.name || user?.username || user?.firstName || "User"}!
        </Typography>
      </Box>
      {/* First row: first 3 cards */}
      <Grid container spacing={4} justifyContent="center" sx={{ mb: 3 }}>
        {cardData.slice(0, 3).map((card) => (
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
      {/* Second row: last 3 cards */}
      <Grid container spacing={4} justifyContent="center">
        {cardData.slice(3).map((card) => (
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
    </Container>
  );
}
