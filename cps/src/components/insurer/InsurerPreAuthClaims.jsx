import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";

const API_BASE_URL = "http://localhost:9090"; // Define base URL for reusability

const InsurerPreAuthClaims = ({ id }) => {
  const [tableOf, setTableOf] = useState("Hospital");
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);

  // Memoize fetchCustomerName
  const fetchCustomerName = useCallback(async (customerId) => {
    if (!customerId || customerId === "null") return "N/A";
    try {
      const res = await axios.get(`${API_BASE_URL}/customers/${customerId}`);
      return res.data?.name || "Unknown Customer";
    } catch {
      return "Unknown Customer";
    }
  }, []);

  // Memoize fetchClaimType
  const fetchClaimType = useCallback(async (claimTypeId) => {
    if (!claimTypeId || claimTypeId === "null") return "Not specified";
    try {
      const res = await axios.get(`${API_BASE_URL}/claimTypes/${claimTypeId}`);
      return res.data?.type || "Unknown Claim Type";
    } catch {
      return "Unknown Claim Type";
    }
  }, []);

  // Memoize fetchHospitalName for hospital claims display
  const fetchHospitalName = useCallback(async (hospitalId) => {
    if (!hospitalId || hospitalId === "null") return "N/A";
    try {
      const res = await axios.get(`${API_BASE_URL}/hospitals/${hospitalId}`);
      return res.data?.name || "Unknown Hospital";
    } catch {
      return "Unknown Hospital";
    }
  }, []);

  // Function to fetch all claims, including details and client-side filtering
  const fetchAllClaims = useCallback(async () => {
    setLoading(true);
    try {
      let allFetchedClaims = [];

      if (tableOf === "Hospital") {
        // Fetch ALL hospital claims
        const res = await axios.get(`${API_BASE_URL}/hospitalclaims`);
        allFetchedClaims = res.data || [];

        // Apply client-side filters for Hospital claims
        const filteredClaims = allFetchedClaims.filter((claim) => {
          // Condition 1: insurerId is null or not present
          const isInsurerIdNull =
            claim.insurerId === null || typeof claim.insurerId === "undefined";
          // Condition 2: hospitalStatus is "PRE_AUTH_INITIATED"
          const isPreAuthInitiated =
            claim.hospitalStatus === "PRE_AUTH_INITIATED";

          return isInsurerIdNull && isPreAuthInitiated;
        });

        const claimsWithDetails = await Promise.all(
          filteredClaims.map(async (claim) => {
            const claimTypeName = await fetchClaimType(claim.claimTypeId);
            const hospitalName = await fetchHospitalName(claim.hospitalId);
            const customerName = await fetchCustomerName(claim.customerId);
            return { ...claim, claimTypeName, hospitalName, customerName };
          })
        );
        setClaims(claimsWithDetails);
      } else {
        // Fetch ALL customer (Reimbursement) claims
        const res = await axios.get(`${API_BASE_URL}/customerclaims`);
        allFetchedClaims = res.data || [];

        // Apply client-side filter for Customer claims
        const filteredClaims = allFetchedClaims.filter((claim) => {
          // Condition: insurerId is null or not present
          return (
            claim.insurerId === null || typeof claim.insurerId === "undefined"
          );
        });

        const claimsWithDetails = await Promise.all(
          filteredClaims.map(async (claim) => {
            const customerName = await fetchCustomerName(claim.customerId);
            const claimTypeName = await fetchClaimType(claim.claimTypeId);
            return { ...claim, customerName, claimTypeName };
          })
        );
        setClaims(claimsWithDetails);
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
      setClaims([]);
      alert("Failed to load claims. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [tableOf, fetchCustomerName, fetchClaimType, fetchHospitalName]); // Dependencies for useCallback

  useEffect(() => {
    fetchAllClaims(); // Call the memoized fetch function when component mounts or fetchAllClaims changes
  }, [fetchAllClaims]); // Dependency for useEffect

  const handleAddInsurer = async (claimId) => {
    try {
      if (tableOf === "Hospital") {
        await axios.patch(`${API_BASE_URL}/hospitalclaims/${claimId}`, {
          insurerId: id,
          insurerStatus: "PRE_AUTH_APPROVED", // Update status for pre-auth
          updatedAt: new Date().toISOString(),
        });
      } else {
        await axios.patch(`${API_BASE_URL}/customerclaims/${claimId}`, {
          insurerId: id,
          insurerStatus: "CLAIM_RAISED", // Initial status for customer claims after adding insurer
          updatedAt: new Date().toISOString(),
        });
      }
      // Re-fetch claims to update the table after an action
      fetchAllClaims();
      alert("Claim added for adjudication successfully!");
    } catch (error) {
      console.error("Error assigning insurer:", error);
      alert("Failed to add Claim.");
    }
  };

  const handleDenyPreAuth = async (claimId) => {
    try {
      if (tableOf === "Hospital") {
        const insurerComments = window.prompt(
          "Please enter comments for denying this pre-authorization (optional):"
        );
        await axios.patch(`${API_BASE_URL}/hospitalclaims/${claimId}`, {
          insurerId: id, // Assign insurer if not already, or keep current assignment
          insurerStatus: "PRE_AUTH_DENIED",
          preAuthorization: {
            // Ensure preAuthorization object exists and update its fields
            responseDateTime: new Date().toISOString(),
            approvedAmount: null, // Set to null as it's denied
            insurerComments:
              insurerComments || "Pre-Authorization denied by insurer.", // Use provided or default
          },
          updatedAt: new Date().toISOString(),
        });
        fetchAllClaims();
        alert("Pre-Authorization denied successfully!");
      } else if (tableOf === "Customer") {
        // For Customer claims, this would typically be 'CLAIM_DENIED'
        // based on your previous code for handling customer claims
        const insurerComments = window.prompt(
          "Please enter comments for denying this claim (optional):"
        );
        await axios.patch(`${API_BASE_URL}/customerclaims/${claimId}`, {
          insurerId: id,
          insurerStatus: "CLAIM_DENIED",
          insurerComments: insurerComments || "Claim denied by insurer.",
          updatedAt: new Date().toISOString(),
        });
        fetchAllClaims();
        alert("Customer claim denied successfully!");
      }
    } catch (error) {
      console.error("Error denying claim:", error);
      alert("Failed to deny claim.");
    }
  };

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
        alignItems: "center",
      }}
    >
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant={tableOf === "Hospital" ? "contained" : "outlined"}
          onClick={() => setTableOf("Hospital")}
        >
          Hospitals (Pre-Auth)
        </Button>
        <Button
          variant={tableOf === "Customer" ? "contained" : "outlined"}
          onClick={() => setTableOf("Customer")}
        >
          Customers (Reimbursement)
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxWidth: 1000 }}>
        <Table>
          <TableHead>
            {tableOf === "Hospital" ? (
              <TableRow>
                <TableCell>Hospital Name</TableCell>
                <TableCell>Customer Aadhar</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Treatment Offered</TableCell>
                <TableCell>Estimated Cost</TableCell>
                <TableCell>Claim Type</TableCell>
                <TableCell>Date of Claim</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell>Customer Name</TableCell>
                <TableCell>Claim Type</TableCell>
                <TableCell>Date of Raise</TableCell>
                <TableCell>Amount Claimed</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            )}
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={tableOf === "Hospital" ? 8 : 5}
                  align="center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : claims.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={tableOf === "Hospital" ? 8 : 5}
                  align="center"
                >
                  No claims found matching the criteria.
                </TableCell>
              </TableRow>
            ) : (
              claims.map((claim) =>
                tableOf === "Hospital" ? (
                  <TableRow key={claim.id}>
                    <TableCell>{claim.hospitalName}</TableCell>
                    <TableCell>{claim.customerAadharNumber}</TableCell>
                    <TableCell>{claim.customerName}</TableCell>
                    <TableCell>{claim.treatmentOffered}</TableCell>
                    <TableCell>₹{claim.estimatedCostToHospital}</TableCell>
                    <TableCell>{claim.claimTypeName}</TableCell>
                    <TableCell>
                      {new Date(claim.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleAddInsurer(claim.id)}
                        sx={{ mr: 1 }}
                      >
                        Approve & Add
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDenyPreAuth(claim.id)}
                      >
                        Deny
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={claim.id}>
                    <TableCell>{claim.customerName}</TableCell>
                    <TableCell>{claim.claimTypeName}</TableCell>
                    <TableCell>
                      {new Date(claim.createdAt).toLocaleDateString()}{" "}
                      {/* Use createdAt for customer claims */}
                    </TableCell>
                    <TableCell>₹{claim.costOfTreatment}</TableCell>{" "}
                    {/* Use costOfTreatment for customer claims */}
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleAddInsurer(claim.id)}
                      >
                        Approve & Add
                      </Button>
                      {/* For customer claims, if you want a deny button as well */}
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDenyPreAuth(claim.id)}
                        sx={{ ml: 1 }}
                      >
                        Deny
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InsurerPreAuthClaims;
