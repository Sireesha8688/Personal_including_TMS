import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Container,
} from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const API_BASE_URL = "http://localhost:9090";

const CustomerDashboard = ({ id: customerId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [claimsRaised, setClaimsRaised] = useState([]);
  const [claimsSettled, setClaimsSettled] = useState([]);
  const [visibleCard, setVisibleCard] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setError("");
      try {
        const customerRes = await fetch(
          `${API_BASE_URL}/customers/${customerId}`
        );
        const customerData = await customerRes.json();

        const allPoliciesRes = await fetch(`${API_BASE_URL}/policy`);
        const allPolicies = await allPoliciesRes.json();

        const customerPolicies = (customerData.policies || []).map((p) => {
          const policyDetail = allPolicies.find(
            (pol) => String(pol.id) === String(p.policyId)
          );
          return {
            ...policyDetail,
            bought_date: p.bought_date,
            expiry_date: p.expiry_date,
          };
        });

        const [claimsRaisedRes, claimsSettledRes] = await Promise.all([
          fetch(
            `${API_BASE_URL}/customerclaims?customerId=${customerId}&customerStatus=CLAIM_RAISED`
          ),
          fetch(
            `${API_BASE_URL}/customerclaims?customerId=${customerId}&customerStatus=CLAIM_SETTLED`
          ),
        ]);
        const raised = await claimsRaisedRes.json();
        const settled = await claimsSettledRes.json();

        setCustomer(customerData);
        setPolicies(customerPolicies);
        setClaimsRaised(raised);
        setClaimsSettled(settled);
      } catch (err) {
        setError("Failed to load dashboard data.");
      }
      setLoading(false);
    };
    getData();
  }, [customerId]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  const cards = [
    {
      key: "profile",
      title: "Profile",
      image:
        "https://static.vecteezy.com/system/resources/thumbnails/007/058/647/small_2x/icon-of-customer-care-suitable-for-design-element-of-customer-service-app-and-user-satisfaction-symbol-free-vector.jpg",
      content: (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {customer.name}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2">
            <b>Aadhar:</b> {customer.aadharcardNumber}
          </Typography>
          <Typography variant="body2">
            <b>DOB:</b> {customer.date_of_birth}
          </Typography>
          <Typography variant="body2">
            <b>Gender:</b> {customer.gender}
          </Typography>
          <Typography variant="body2">
            <b>Blood Group:</b> {customer.blood_group}
          </Typography>
          <Typography variant="body2">
            <b>Mobile:</b> {customer.mobile_number}
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, display: "flex", alignItems: "center" }}
          >
            <LocationOnIcon color="action" sx={{ mr: 1 }} />
            <span>
              {customer.address.street}, {customer.address.city},{" "}
              {customer.address.state} - {customer.address.pincode},{" "}
              {customer.address.country}
            </span>
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, display: "flex", alignItems: "center" }}
          >
            <AccountBalanceIcon color="action" sx={{ mr: 1 }} />
            <span>
              {customer.bank_account_details.bank_name} <br />
              <b>A/C:</b> {customer.bank_account_details.account_number} <br />
              <b>IFSC:</b> {customer.bank_account_details.ifsc_code}
            </span>
          </Typography>
        </>
      ),
    },
    {
      key: "policies",
      title: "Active Policies",
      image:
        "https://media.licdn.com/dms/image/v2/D560DAQGYogEYWu8dzA/learning-public-crop_288_512/learning-public-crop_288_512/0/1729536396432?e=2147483647&v=beta&t=cSbJF3tw68vlYtk-3USEywiyNCq4uuayDO1QncDJ26I",
      content: (
        <>
          {policies.length === 0 ? (
            <Typography>No active policies.</Typography>
          ) : (
            <List dense sx={{ mt: 2 }}>
              {policies.map((p, idx) => (
                <ListItem key={idx} sx={{ mb: 1, alignItems: "flex-start" }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <b>{p.name}</b>
                        <Chip
                          label={`Sum Assured: ₹${p.sumAssured}`}
                          size="small"
                          color="success"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2">
                          <b>Bought:</b> {p.bought_date} &nbsp; <b>Expiry:</b>{" "}
                          {p.expiry_date}
                        </Typography>
                        <Typography variant="body2">{p.description}</Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </>
      ),
    },
    {
      key: "claims",
      title: "Claim Summary",
      image:
        "https://thumbs.dreamstime.com/b/clipboard-claim-form-paper-sheets-magnifying-glass-isolated-white-background-flat-style-design-vector-illustration-192061403.jpg",
      content: (
        <>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <AssignmentTurnedInIcon
              color="success"
              sx={{ fontSize: 36, mr: 1 }}
            />
            <Typography variant="body2" fontWeight="bold">
              Claims Raised: {claimsRaised.length}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <AssignmentIcon color="primary" sx={{ fontSize: 36, mr: 1 }} />
            <Typography variant="body2" fontWeight="bold">
              Claims Settled: {claimsSettled.length}
            </Typography>
          </Box>
          {claimsRaised.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Recent Raised Claims:
              </Typography>
              <List dense>
                {claimsRaised.slice(0, 3).map((claim) => (
                  <ListItem key={claim.id}>
                    <ListItemText
                      primary={`Claim ID: ${claim.id}`}
                      secondary={`Status: ${claim.customerStatus}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          {claimsSettled.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Recent Settled Claims:
              </Typography>
              <List dense>
                {claimsSettled.slice(0, 3).map((claim) => (
                  <ListItem key={claim.id}>
                    <ListItemText
                      primary={`Claim ID: ${claim.id}`}
                      secondary={`Status: ${claim.customerStatus}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
        Customer Dashboard
      </Typography>

      {/* Images as clickable buttons in rows of 3, centered */}
      <Grid container spacing={4} justifyContent="center" sx={{ mb: 4 }}>
        {cards.map((card) => (
          <Grid
            item
            key={card.key}
            xs={12}
            sm={4}
            md={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              src={card.image}
              alt={card.title}
              onClick={() =>
                setVisibleCard((prev) => (prev === card.key ? null : card.key))
              }
              sx={{
                width: "100%",
                maxWidth: 200,
                height: 200,
                objectFit: "contain",
                cursor: "pointer",
                border:
                  visibleCard === card.key
                    ? "3px solid #1976d2"
                    : "3px solid transparent",
                borderRadius: 2,
                transition: "border-color 0.3s",
                mb: 1,
              }}
            />
            <Typography
              align="center"
              variant="subtitle1"
              sx={{ fontWeight: "600" }}
            >
              {card.title}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Show the selected card's content without image */}
      {visibleCard && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Card sx={{ maxWidth: 600, width: "100%" }}>
            <CardContent>
              {cards.find((c) => c.key === visibleCard).content}
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
};

export default CustomerDashboard;
