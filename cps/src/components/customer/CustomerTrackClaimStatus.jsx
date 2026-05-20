import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import StatusCardComponent from "./StatusCardComponent";

const CustomerTrackClaimStatus = ({ id: customerId }) => {
  const [claimsData, setClaimsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        setError(null);

        const claimsResponse = await axios.get(
          `http://localhost:9090/customerclaims?customerId=${customerId}`
        );
        const allClaims = claimsResponse.data;
        console.log(allClaims);

        const customerClaims = allClaims;

        const processedClaimsPromises = customerClaims.map(async (claim) => {
          try {
            const claimTypeResponse = await axios.get(
              `http://localhost:9090/claimTypes/${claim.claimTypeId}`
            );
            const claimTypeName = claimTypeResponse.data.type;
            return {
              ...claim,
              claimTypeName: claimTypeName,
            };
          } catch (typeError) {
            console.error(
              `Error fetching claim type for ID ${claim.claimTypeId}:`,
              typeError
            );
            return {
              ...claim,
              claimTypeName: "Unknown Type",
            };
          }
        });

        const finalClaimsData = await Promise.all(processedClaimsPromises);
        setClaimsData(finalClaimsData);
      } catch (err) {
        console.error("Error fetching claims:", err);
        setError("Failed to load claims. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading claims...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "error.main",
        }}
      >
        <Typography>{error}</Typography>
      </Box>
    );
  }

  if (claimsData.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No claims found for this customer.
        </Typography>
      </Box>
    );
  }

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
      {claimsData.map((claim) => (
        <Box key={claim.id}>
          <StatusCardComponent claim={claim} />
        </Box>
      ))}
    </Box>
  );
};

export default CustomerTrackClaimStatus;
