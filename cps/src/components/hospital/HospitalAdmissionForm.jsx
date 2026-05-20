import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Dialog, // New import
  DialogTitle, // New import
  DialogContent, // New import
  DialogActions, // New import
  TextField, // Already imported, but will be used in dialog
} from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital"; // Icon for admit
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"; // Icon for cash-based admit

// Base URL for your JSON-server API
const API_BASE_URL = "http://localhost:9090";

const HospitalAdmissionForm = ({ id: hospitalId }) => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [admittingClaimId, setAdmittingClaimId] = useState(null);
  const [admitError, setAdmitError] = useState("");
  const [admitSuccess, setAdmitSuccess] = useState("");

  // State for the Admission Notes Dialog
  const [openAdmitDialog, setOpenAdmitDialog] = useState(false);
  const [currentClaimToAdmit, setCurrentClaimToAdmit] = useState(null); // Stores the claim object being admitted
  const [admissionNotes, setAdmissionNotes] = useState("");
  const [dialogLoading, setDialogLoading] = useState(false); // Loading for dialog's own submit button

  // Function to fetch claims
  const fetchClaims = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${API_BASE_URL}/hospitalclaims?hospitalId=${hospitalId}&hospitalStatus=PRE_AUTH_INITIATED`
      );

      const filteredClaims = response.data.filter(
        (claim) => claim.insurerStatus !== null
      );
      setClaims(filteredClaims);
    } catch (err) {
      console.error("Error fetching claims:", err);
      setError("Failed to load claims. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  // Fetch claims on component mount and when hospitalId changes
  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  // Helper function to render meaningful messages for null pre-auth details
  const renderPreAuthDetail = (value, messageIfNull) => {
    return value !== null && value !== undefined && value !== ""
      ? value
      : messageIfNull;
  };

  // Open the dialog when an Admit button is clicked
  const handleOpenAdmitDialog = (claim) => {
    setCurrentClaimToAdmit(claim);
    setAdmissionNotes(""); // Clear previous notes
    setOpenAdmitDialog(true);
    setAdmitError(""); // Clear any previous errors
    setAdmitSuccess(""); // Clear any previous success
  };

  // Close the dialog
  const handleCloseAdmitDialog = () => {
    setOpenAdmitDialog(false);
    setCurrentClaimToAdmit(null);
    setAdmissionNotes("");
    setDialogLoading(false);
  };

  // Handler for admitting patient from the dialog
  const handleConfirmAdmit = async () => {
    if (!currentClaimToAdmit) return;

    setDialogLoading(true);
    setAdmitError("");

    let newHospitalStatus;
    if (currentClaimToAdmit.insurerStatus === "PRE_AUTH_APPROVED") {
      newHospitalStatus = "ADMITTED";
    } else if (currentClaimToAdmit.insurerStatus === "PRE_AUTH_DENIED") {
      newHospitalStatus = "CASH_BASED_ADMISSION";
    } else {
      setAdmitError("Invalid insurer status for admission.");
      setDialogLoading(false);
      return;
    }

    const updatePayload = {
      hospitalStatus: newHospitalStatus,
      treatmentDetails: {
        ...currentClaimToAdmit.treatmentDetails, // Preserve existing treatmentDetails
        isAdmitted: true,
        dateOfAdmission: new Date().toISOString(),
        admissionNotes: admissionNotes,
      },
      updatedAt: new Date().toISOString(),
    };

    try {
      await axios.patch(
        `${API_BASE_URL}/hospitalclaims/${currentClaimToAdmit.id}`,
        updatePayload
      );
      setAdmitSuccess(
        `Patient admitted successfully (Claim ID: ${currentClaimToAdmit.id})!`
      );
      // Remove the admitted claim from the local state
      setClaims((prevClaims) =>
        prevClaims.filter((claim) => claim.id !== currentClaimToAdmit.id)
      );
      handleCloseAdmitDialog(); // Close dialog on success
    } catch (err) {
      console.error("Error admitting patient:", err);
      setAdmitError(
        `Failed to admit patient (Claim ID: ${currentClaimToAdmit.id}). Please try again.`
      );
    } finally {
      setDialogLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: "lg", margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Customer Admission Form
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        List of pre-authorized requests for Hospital ID: {hospitalId}
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading pending admissions...</Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {admitSuccess && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {admitSuccess}
        </Alert>
      )}

      {admitError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {admitError}
        </Alert>
      )}

      {!loading && !error && claims.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No pending admission requests for this hospital.
        </Alert>
      )}

      {!loading && !error && claims.length > 0 && (
        <TableContainer component={Paper} elevation={3} sx={{ mt: 3 }}>
          <Table stickyHeader aria-label="pending admissions table">
            <TableHead>
              <TableRow>
                <TableCell>S.No.</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Aadhar Number</TableCell>
                <TableCell>Treatment</TableCell>
                <TableCell>Estimated Cost</TableCell>
                <TableCell>Insurer Status</TableCell>
                <TableCell>Approved Amount</TableCell>
                <TableCell>Insurer Comments</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {claims.map((claim, index) => (
                <TableRow key={claim.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{claim.customerName}</TableCell>
                  <TableCell>{claim.customerAadharNumber}</TableCell>
                  <TableCell>{claim.treatmentOffered}</TableCell>
                  <TableCell>
                    ₹{claim.estimatedCostToHospital.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color={
                        claim.insurerStatus === "PRE_AUTH_APPROVED"
                          ? "success.main"
                          : "error.main"
                      }
                      fontWeight="bold"
                    >
                      {claim.insurerStatus.replace(/_/g, " ")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {renderPreAuthDetail(
                      claim.preAuthorization.approvedAmount,
                      "N/A (Denied)"
                    )}
                  </TableCell>
                  <TableCell>
                    {renderPreAuthDetail(
                      claim.preAuthorization.insurerComments,
                      "No specific comments"
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {/* The buttons now open the dialog */}
                    {claim.insurerStatus === "PRE_AUTH_APPROVED" && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleOpenAdmitDialog(claim)}
                        disabled={admittingClaimId === claim.id}
                        startIcon={
                          admittingClaimId === claim.id ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <LocalHospitalIcon />
                          )
                        }
                      >
                        Admit Patient
                      </Button>
                    )}
                    {claim.insurerStatus === "PRE_AUTH_DENIED" && (
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => handleOpenAdmitDialog(claim)}
                        disabled={admittingClaimId === claim.id}
                        startIcon={
                          admittingClaimId === claim.id ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <AttachMoneyIcon />
                          )
                        }
                      >
                        Cash-based Admit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Admission Notes Dialog */}
      <Dialog
        open={openAdmitDialog}
        onClose={handleCloseAdmitDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Admit Patient: {currentClaimToAdmit?.customerName} (Claim ID:{" "}
          {currentClaimToAdmit?.id})
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Insurer Status:{" "}
            <Typography
              component="span"
              fontWeight="bold"
              color={
                currentClaimToAdmit?.insurerStatus === "PRE_AUTH_APPROVED"
                  ? "success.main"
                  : "error.main"
              }
            >
              {currentClaimToAdmit?.insurerStatus.replace(/_/g, " ")}
            </Typography>
            <br />
            Estimated Cost: ₹
            {currentClaimToAdmit?.estimatedCostToHospital.toFixed(2)}
            {currentClaimToAdmit?.preAuthorization?.approvedAmount !== null && (
              <>
                <br />
                Approved Amount: ₹
                {currentClaimToAdmit?.preAuthorization?.approvedAmount.toFixed(
                  2
                )}
              </>
            )}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="admission-notes"
            label="Admission Notes (Optional)"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={admissionNotes}
            onChange={(e) => setAdmissionNotes(e.target.value)}
          />
          {admitError && ( // Show dialog-specific error if any
            <Alert severity="error" sx={{ mt: 2 }}>
              {admitError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdmitDialog} disabled={dialogLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAdmit}
            color="primary"
            variant="contained"
            disabled={dialogLoading}
            startIcon={
              dialogLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <LocalHospitalIcon />
              )
            }
          >
            Confirm Admission
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HospitalAdmissionForm;
