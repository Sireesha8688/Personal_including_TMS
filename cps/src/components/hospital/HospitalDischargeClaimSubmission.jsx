import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import HospitalDischargeClaimCard from "./HospitalDischargeClaimCard"; // Make sure path is correct

// Base URL for your JSON-server API
const API_BASE_URL = "http://localhost:9090";

const HospitalDischargeClaimSubmission = ({ id: hospitalId }) => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Function to fetch claims
  const fetchClaims = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${API_BASE_URL}/hospitalclaims?hospitalId=${hospitalId}&hospitalStatus=ADMITTED&insurerStatus=PRE_AUTH_APPROVED`
      );
      setClaims(response.data);
    } catch (err) {
      console.error("Error fetching claims for discharge:", err);
      setError("Failed to load admitted claims. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  // Handle a claim being successfully discharged from the child component
  const handleClaimDischarged = useCallback((dischargedClaimId) => {
    setClaims((prevClaims) =>
      prevClaims.filter((claim) => claim.id !== dischargedClaimId)
    );
  }, []);

  // Fetch claims on component mount and when hospitalId changes
  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  return (
    <Box sx={{ p: 4, maxWidth: "md", margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Discharge Claim Submission
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Submit final claim details for admitted patients (Hospital ID:{" "}
        {hospitalId})
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>
            Loading admitted claims for discharge...
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && claims.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No admitted patients awaiting discharge claim submission for this
          hospital.
        </Alert>
      )}

      {!loading && !error && claims.length > 0 && (
        <Box sx={{ mt: 3 }}>
          {claims.map((claim) => (
            <HospitalDischargeClaimCard
              key={claim.id}
              claim={claim}
              onClaimDischarged={handleClaimDischarged}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default HospitalDischargeClaimSubmission;
