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

const CustomerClaimRaised = ({ claim }) => {
  // Function to handle showing/downloading PDF from base64
  const handleShowPdf = (base64Data, fileName) => {
    if (!base64Data) {
      console.error("No base64 data provided for PDF.");
      return;
    }

    try {
      // Attempt to remove common prefixes for base64 data URLs
      const cleanedBase64 = base64Data
        .replace(/^data:application\/pdf;filename=[^;]+;base64,/, "")
        .replace(/^data:application\/pdf;base64,/, "")
        .replace(/^data:application\/octet-stream;base64,/, ""); // Add common octet-stream type

      // Check if the cleaned data is still a valid base64 string
      // This is a simple check; a more robust check might be needed for production
      if (
        cleanedBase64.length % 4 !== 0 ||
        /[^A-Za-z0-9+/=]/.test(cleanedBase64)
      ) {
        console.warn(
          "Base64 string might be malformed, attempting direct open."
        );
        // Fallback to direct open if it looks problematic
        window.open(base64Data, "_blank", "noopener,noreferrer");
        return;
      }

      const byteCharacters = atob(cleanedBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);

      // Open in a new tab
      window.open(blobUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error decoding or opening PDF:", error);
      // Fallback: if decoding fails, try to open the original string directly
      window.open(base64Data, "_blank", "noopener,noreferrer");
    }
  };

  // Ensure treatmentDetails is an object, even if null or undefined
  const treatmentDetails = claim.treatmentDetails || {};
  const documents = claim.documents || {}; // Access the documents object

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

  const hasDocuments =
    (documents.hospitalReports && documents.hospitalReports.length > 0) ||
    (documents.preApprovalLetter && documents.preApprovalLetter.length > 0) ||
    (documents.hospitalBills && documents.hospitalBills.length > 0) ||
    claim.finalClaimSettlement?.insurerFinalBill;

  return (
    <Accordion sx={{ mt: 2, borderRadius: "8px" }} elevation={2}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight="bold">Claim Details</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" gutterBottom>
          <strong>Treatment Offered:</strong> {claim.treatmentOffered || "N/A"}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Estimated Cost:</strong> ₹
          {claim.estimatedCostToHospital !== null
            ? claim.estimatedCostToHospital
            : "N/A"}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Treatment Details
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Admitted:</strong>{" "}
          {treatmentDetails.isAdmitted !== undefined
            ? treatmentDetails.isAdmitted
              ? "Yes"
              : "No"
            : "N/A"}
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
          {treatmentDetails.isDischarged !== undefined
            ? treatmentDetails.isDischarged
              ? "Yes"
              : "No"
            : "N/A"}
        </Typography>
        {treatmentDetails.dateOfDischarge && (
          <Typography variant="body2" gutterBottom>
            <strong>Date of Discharge:</strong>{" "}
            {formatDate(treatmentDetails.dateOfDischarge)}
          </Typography>
        )}
        {treatmentDetails.patientPaidNonMedicalExpenses !== undefined &&
          treatmentDetails.patientPaidNonMedicalExpenses !== null && (
            <Typography variant="body2" gutterBottom>
              <strong>Patient Paid Non-Medical Expenses:</strong> ₹
              {treatmentDetails.patientPaidNonMedicalExpenses}
            </Typography>
          )}
        {treatmentDetails.hospitalFinalBillAmount !== undefined &&
          treatmentDetails.hospitalFinalBillAmount !== null && (
            <Typography variant="body2" gutterBottom>
              <strong>Hospital Final Bill Amount:</strong> ₹
              {treatmentDetails.hospitalFinalBillAmount}
            </Typography>
          )}

        {/* New Section for Documents */}
        <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
          Documents
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            flexDirection: "column",
          }}
        >
          {documents.hospitalReports &&
            documents.hospitalReports.length > 0 && (
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  sx={{ mt: 1, mb: 0.5 }}
                >
                  Hospital Reports:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {documents.hospitalReports.map((doc, index) => (
                    <Button
                      key={`hospital_report_${index}`}
                      variant="outlined"
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleShowPdf(doc.fileUrl, doc.fileName)}
                      sx={{ mb: 1 }}
                    >
                      {doc.fileName}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}

          {documents.preApprovalLetter &&
            documents.preApprovalLetter.length > 0 && (
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight="medium"
                  sx={{ mt: 1, mb: 0.5 }}
                >
                  Pre-Approval Letters:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {documents.preApprovalLetter.map((doc, index) => (
                    <Button
                      key={`pre_approval_${index}`}
                      variant="outlined"
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleShowPdf(doc.fileUrl, doc.fileName)}
                      sx={{ mb: 1 }}
                    >
                      {doc.fileName}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}

          {documents.hospitalBills && documents.hospitalBills.length > 0 && (
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                sx={{ mt: 1, mb: 0.5 }}
              >
                Hospital Bills:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {documents.hospitalBills.map((doc, index) => (
                  <Button
                    key={`hospital_bill_${index}`}
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={() => handleShowPdf(doc.fileUrl, doc.fileName)}
                    sx={{ mb: 1 }}
                  >
                    {doc.fileName}
                  </Button>
                ))}
              </Box>
            </Box>
          )}

          {/* Conditional rendering for "Final Claim Settlement" document if it exists */}
          {claim.finalClaimSettlement?.insurerFinalBill && (
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="medium"
                sx={{ mt: 1, mb: 0.5 }}
              >
                Insurer Final Bill:
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={() =>
                  handleShowPdf(
                    claim.finalClaimSettlement.insurerFinalBill,
                    `Insurer_Final_Bill_${claim.id}.pdf`
                  )
                }
                sx={{ mb: 1 }}
              >
                Insurer Final Bill (Claim ID: {claim.id})
              </Button>
            </Box>
          )}

          {/* If no documents are available, display a message */}
          {!hasDocuments && (
            <Typography variant="body2" color="textSecondary">
              No documents available.
            </Typography>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default CustomerClaimRaised;
