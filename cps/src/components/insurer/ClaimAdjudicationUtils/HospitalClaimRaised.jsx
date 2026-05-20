import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Typography,
} from "@mui/material";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DownloadIcon from "@mui/icons-material/Download";

const HospitalClaimRaised = ({ claim }) => {
  // Function to handle base64 PDF download
  const handleDownloadPdf = (base64Data, fileName) => {
    if (!base64String) return;
    try {
      // Remove filename= if present to avoid issues
      const cleanedBase64 = base64String.replace(
        /^data:application\/pdf;filename=.*;base64,/,
        ""
      );
      const base64 = cleanedBase64.replace(
        /^data:application\/pdf;base64,/,
        ""
      );
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch {
      window.open(base64String, "_blank");
    }
  };

  const treatmentDetails = claim.treatmentDetails || {};

  // Function to format date strings
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Error Formatting Date";
    }
  };

  return (
    <Accordion sx={{ mt: 2, borderRadius: "8px" }} elevation={2}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight="bold">Claim Details</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" gutterBottom>
          <strong>Treatment Offered:</strong> {claim.treatmentOffered}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Estimated Cost:</strong> ₹{claim.estimatedCostToHospital}
        </Typography>
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Treatment Details
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Admitted:</strong>{" "}
          {treatmentDetails.isAdmitted ? "Yes" : "No"}
        </Typography>
        {treatmentDetails.dateOfAdmission && (
          <Typography variant="body2" gutterBottom>
            <strong>Date of Admission:</strong>{" "}
            {formatDate(treatmentDetails.dateOfAdmission)}
          </Typography>
        )}
        {treatmentDetails.admissionNotes && (
          <Typography variant="body2" gutterBottom>
            <strong>Admission Notes:</strong> {treatmentDetails.admissionNotes}
          </Typography>
        )}
        <Typography variant="body2" gutterBottom>
          <strong>Discharged:</strong>{" "}
          {treatmentDetails.isDischarged ? "Yes" : "No"}
        </Typography>
        {treatmentDetails.dateOfDischarge && (
          <Typography variant="body2" gutterBottom>
            <strong>Date of Discharge:</strong>{" "}
            {formatDate(treatmentDetails.dateOfDischarge)}
          </Typography>
        )}
        {treatmentDetails.patientPaidNonMedicalExpenses !== undefined && (
          <Typography variant="body2" gutterBottom>
            <strong>Patient Paid Non-Medical Expenses:</strong> ₹
            {treatmentDetails.patientPaidNonMedicalExpenses}
          </Typography>
        )}
        {treatmentDetails.hospitalFinalBillAmount !== undefined && (
          <Typography variant="body2" gutterBottom>
            <strong>Hospital Final Bill Amount:</strong> ₹
            {treatmentDetails.hospitalFinalBillAmount}
          </Typography>
        )}

        {/* Download Buttons for Base64 PDFs */}
        <Box sx={{ mt: 2 }}>
          {treatmentDetails.hospitalFinalBill && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={() =>
                handleDownloadPdf(
                  treatmentDetails.hospitalFinalBill,
                  `Hospital_Final_Bill_${claim.id}.pdf`
                )
              }
              sx={{ mr: 1, mb: 1 }}
            >
              Download Hospital Final Bill
            </Button>
          )}
          {treatmentDetails.dischargeSummaryUrl && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={() =>
                handleDownloadPdf(
                  treatmentDetails.dischargeSummaryUrl,
                  `Discharge_Summary_${claim.id}.pdf`
                )
              }
              sx={{ mr: 1, mb: 1 }}
            >
              Download Discharge Summary
            </Button>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default HospitalClaimRaised;
