import React, { useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SendIcon from "@mui/icons-material/Send";
import DescriptionIcon from "@mui/icons-material/Description"; // For files

// Base URL for your JSON-server API
const API_BASE_URL = "http://localhost:9090";

// Helper function to convert File to Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const HospitalDischargeClaimCard = ({ claim, onClaimDischarged }) => {
  const [expanded, setExpanded] = useState(false); // State for accordion
  const [patientPaidNonMedicalExpenses, setPatientPaidNonMedicalExpenses] =
    useState("");
  const [hospitalFinalBillAmount, setHospitalFinalBillAmount] = useState("");
  const [hospitalFinalBillFile, setHospitalFinalBillFile] = useState(null);
  const [dischargeSummaryFile, setDischargeSummaryFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleFileChange = (event, setter) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setter(file);
      setSubmitError(""); // Clear error if valid file selected
    } else {
      setter(null);
      setSubmitError("Please upload a PDF file.");
    }
  };

  const handleSubmitDischarge = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    if (
      !hospitalFinalBillAmount ||
      !hospitalFinalBillFile ||
      !dischargeSummaryFile
    ) {
      setSubmitError(
        "Please fill all required fields and upload both PDF files."
      );
      setSubmitting(false);
      return;
    }

    try {
      const base64HospitalFinalBill = await fileToBase64(hospitalFinalBillFile);
      const base64DischargeSummary = await fileToBase64(dischargeSummaryFile);

      // Create a new Date object for current time
      const currentTime = new Date();

      const updatePayload = {
        hospitalStatus: "CLAIM_RAISED",
        treatmentDetails: {
          ...claim.treatmentDetails, // Preserve existing treatmentDetails fields
          isDischarged: true,
          dateOfDischarge: currentTime.toISOString(),
          patientPaidNonMedicalExpenses: parseFloat(
            patientPaidNonMedicalExpenses
          ),
          hospitalFinalBillAmount: parseFloat(hospitalFinalBillAmount),
          hospitalFinalBill: base64HospitalFinalBill,
          dischargeSummaryUrl: base64DischargeSummary,
        },
        updatedAt: currentTime.toISOString(), // Update the updatedAt timestamp
      };

      await axios.patch(
        `${API_BASE_URL}/hospitalclaims/${claim.id}`,
        updatePayload
      );

      setSubmitSuccess("Discharge claim submitted successfully!");
      // Call callback to remove this card from parent's list
      if (onClaimDischarged) {
        onClaimDischarged(claim.id);
      }
      // Optionally reset form fields after successful submission if card doesn't disappear
      // setPatientPaidNonMedicalExpenses("");
      // setHospitalFinalBillAmount("");
      // setHospitalFinalBillFile(null);
      // setDischargeSummaryFile(null);
    } catch (err) {
      console.error("Error submitting discharge claim:", err);
      setSubmitError("Failed to submit discharge claim. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card sx={{ mb: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Discharge Claim for: {claim.customerName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aadhar: {claim.customerAadharNumber} | Claim ID: {claim.id}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Treatment: **{claim.treatmentOffered}**
        </Typography>
        <Typography variant="body2">
          Estimated Cost: ₹{claim.estimatedCostToHospital?.toFixed(2)}
        </Typography>
        <Typography variant="body2">
          Approved Amount: ₹
          {claim.preAuthorization?.approvedAmount
            ? claim.preAuthorization.approvedAmount.toFixed(2)
            : "N/A"}
        </Typography>
        <Typography variant="body2">
          Admission Notes:{" "}
          {claim.treatmentDetails?.admissionNotes || "No notes provided."}
        </Typography>
        <Typography variant="body2">
          Date of Admission:{" "}
          {claim.treatmentDetails?.dateOfAdmission
            ? new Date(claim.treatmentDetails.dateOfAdmission).toLocaleString()
            : "N/A"}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Accordion
          expanded={expanded === `panel-${claim.id}`}
          onChange={handleAccordionChange(`panel-${claim.id}`)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-content-${claim.id}`}
            id={`panel-header-${claim.id}`}
          >
            <Typography variant="subtitle1">
              Discharge & Claim Submission
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              component="form"
              onSubmit={handleSubmitDischarge}
              sx={{ mt: 2 }}
            >
              <TextField
                label="Patient Paid Non-Medical Expenses"
                type="number"
                fullWidth
                margin="normal"
                value={patientPaidNonMedicalExpenses}
                onChange={(e) =>
                  setPatientPaidNonMedicalExpenses(e.target.value)
                }
                required
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Hospital Final Bill Amount"
                type="number"
                fullWidth
                margin="normal"
                value={hospitalFinalBillAmount}
                onChange={(e) => setHospitalFinalBillAmount(e.target.value)}
                required
                inputProps={{ min: 0 }}
              />

              <Box sx={{ mt: 2, mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Upload Hospital Final Bill (PDF only) *
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<DescriptionIcon />}
                  fullWidth
                >
                  {hospitalFinalBillFile
                    ? hospitalFinalBillFile.name
                    : "Choose File"}
                  <input
                    type="file"
                    hidden
                    accept="application/pdf"
                    onChange={(e) =>
                      handleFileChange(e, setHospitalFinalBillFile)
                    }
                    required
                  />
                </Button>
                {hospitalFinalBillFile &&
                  hospitalFinalBillFile.type !== "application/pdf" && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      Invalid file type. Please upload a PDF.
                    </Alert>
                  )}
              </Box>

              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Upload Discharge Summary (PDF only) *
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<DescriptionIcon />}
                  fullWidth
                >
                  {dischargeSummaryFile
                    ? dischargeSummaryFile.name
                    : "Choose File"}
                  <input
                    type="file"
                    hidden
                    accept="application/pdf"
                    onChange={(e) =>
                      handleFileChange(e, setDischargeSummaryFile)
                    }
                    required
                  />
                </Button>
                {dischargeSummaryFile &&
                  dischargeSummaryFile.type !== "application/pdf" && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                      Invalid file type. Please upload a PDF.
                    </Alert>
                  )}
              </Box>

              {submitError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {submitError}
                </Alert>
              )}
              {submitSuccess && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {submitSuccess}
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                disabled={submitting}
                startIcon={
                  submitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <SendIcon />
                  )
                }
              >
                Submit Discharge Claim
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default HospitalDischargeClaimCard;
