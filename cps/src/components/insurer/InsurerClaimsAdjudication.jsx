import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Grid, CircularProgress } from "@mui/material";
import InsurerHospitalClaimCard from "./InsurerHospitalClaimCard";
import InsurerCustomerClaimCard from "./InsurerCustomerClaimCard";
import axios from "axios";

const InsurerClaimsAdjudication = ({ id }) => {
  const [tableOf, setTableOf] = useState("Hospital");
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch claims for Hospital or Customer
  useEffect(() => {
    const fetchClaims = async () => {
      setLoading(true);
      try {
        if (tableOf === "Hospital") {
          const res = await axios.get(
            `http://localhost:9090/hospitalclaims?insurerId=${id}`
          );
          const filteredClaims = res.data.filter(
            (claim) => claim.insurerId === id
          );

          setClaims(filteredClaims || []);
        } else {
          const res = await axios.get(
            `http://localhost:9090/customerclaims?insurerId=${id}`
          );
          const filteredClaims = res.data.filter(
            (claim) => claim.insurerId === id
          );

          setClaims(filteredClaims || []);
        }
      } catch (err) {
        setClaims([]);
      }
      setLoading(false);
    };
    fetchClaims();
  }, [tableOf, id]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100vh",
        width: "100%",
        p: 2,
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          justifyContent: "center",
        }}
      >
        <Button
          variant={tableOf === "Hospital" ? "contained" : "outlined"}
          onClick={() => setTableOf("Hospital")}
        >
          Hospitals
        </Button>
        <Button
          variant={tableOf === "Customer" ? "contained" : "outlined"}
          onClick={() => setTableOf("Customer")}
        >
          Customers
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : claims.length === 0 ? (
        <Typography>No claims found.</Typography>
      ) : (
        <Box>
          {claims.map((claim) =>
            tableOf === "Hospital" ? (
              <InsurerHospitalClaimCard key={claim.id} claim={claim} />
            ) : (
              <InsurerCustomerClaimCard key={claim.id} claim={claim} />
            )
          )}
        </Box>
      )}
    </Box>
  );
};

export default InsurerClaimsAdjudication;
