import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SendIcon from "@mui/icons-material/Send";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";

const HospitalAssignedForVerifier = ({ claim }) => {
  const API_ENDPOINT = `http://localhost:9090`;

  const [verifierAccordionExpanded, setVerifierAccordionExpanded] =
    useState(false);

  const [verifiers, setVerifiers] = useState([]);
  const [selectedVerifier, setSelectedVerifier] = useState("");
  const [verifierLoading, setVerifierLoading] = useState(false);
  const [verifierError, setVerifierError] = useState("");
  const [assignSuccess, setAssignSuccess] = useState(false);

  const [assignedVerifierDetails, setAssignedVerifierDetails] = useState(null);

  const handleDownloadPdf = (base64Data, fileName) => {
    try {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert(
        "Failed to download PDF. The file might be corrupted or not a valid base64 PDF."
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setVerifierLoading(true);
      setVerifierError("");
      setAssignSuccess(false);

      try {
        if (claim.verifierAssigned && claim.verifierId) {
          const verifierResponse = await axios.get(
            `${API_ENDPOINT}/verifiers/${claim.verifierId}`
          );
          setAssignedVerifierDetails({
            ...verifierResponse.data,
            comments: claim.verifierComments,
            documents: claim.verifierDocuments || [],
          });
          setVerifierAccordionExpanded(true);
        } else {
          const res = await axios.get(
            `${API_ENDPOINT}/verifiers?available=true`
          );
          const filtered = (res.data || []).filter((v) =>
            v.claimTypesAuthorized.includes(String(claim.claimTypeId))
          );
          setVerifiers(filtered);
          setVerifierAccordionExpanded(false);
        }
      } catch (err) {
        console.error("Failed to load verifier data:", err);
        setVerifierError("Failed to load verifier information.");
      } finally {
        setVerifierLoading(false);
      }
    };

    if (claim && claim.id) {
      fetchData();
    }
  }, [claim, API_ENDPOINT]);

  const handleVerifierAssign = async () => {
    if (!selectedVerifier) {
      setVerifierError("Please select a verifier.");
      return;
    }
    setVerifierLoading(true);
    setVerifierError("");
    try {
      await axios.patch(`${API_ENDPOINT}/hospitalclaims/${claim.id}`, {
        verifierAssigned: true,
        verifierId: selectedVerifier,
        insurerStatus: "CLAIM_ASSIGNED_FOR_VERIFIER_REVIEW",
      });
      setAssignSuccess(true);
    } catch (err) {
      console.error("Failed to assign verifier:", err);
      setVerifierError("Failed to assign verifier. Please try again.");
    } finally {
      setVerifierLoading(false);
    }
  };

  return (
    <Accordion
      expanded={verifierAccordionExpanded}
      onChange={() => setVerifierAccordionExpanded((prev) => !prev)}
      sx={{ mt: 2, borderRadius: "8px" }}
      elevation={2}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight="bold">
          {claim.verifierAssigned ? "Verifier Details" : "Assign Verifier"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {verifierLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress size={24} />
            <Typography sx={{ ml: 1 }}>Loading...</Typography>
          </Box>
        ) : (
          <>
            {verifierError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {verifierError}
              </Alert>
            )}
            {assignSuccess && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Verifier assigned successfully!
              </Alert>
            )}

            {claim.verifierAssigned && assignedVerifierDetails ? (
              <Box>
                <Typography variant="body1" gutterBottom>
                  <strong>Assigned Verifier:</strong>{" "}
                  {assignedVerifierDetails.name} (
                  {assignedVerifierDetails.email})
                </Typography>
                {assignedVerifierDetails.comments && (
                  <Typography variant="body2" gutterBottom>
                    <strong>Verifier Comments:</strong>{" "}
                    {assignedVerifierDetails.comments}
                  </Typography>
                )}
                {assignedVerifierDetails.documents &&
                  assignedVerifierDetails.documents.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Verifier Documents:</strong>
                      </Typography>
                      {assignedVerifierDetails.documents.map(
                        (docBase64, docIndex) => (
                          <Button
                            key={docIndex}
                            variant="outlined"
                            size="small"
                            startIcon={<DownloadIcon />}
                            onClick={() =>
                              handleDownloadPdf(
                                docBase64,
                                `Verifier_Doc_${claim.id}_${docIndex + 1}.pdf`
                              )
                            }
                            sx={{ mr: 1, mb: 1 }}
                          >
                            Download Document {docIndex + 1}
                          </Button>
                        )
                      )}
                    </Box>
                  )}
              </Box>
            ) : (
              <>
                {verifiers.length === 0 ? (
                  <Typography>
                    No available verifiers for this claim type.
                  </Typography>
                ) : (
                  <Select
                    fullWidth
                    value={selectedVerifier}
                    onChange={(e) => setSelectedVerifier(e.target.value)}
                    sx={{ mb: 2 }}
                    displayEmpty
                    disabled={verifierLoading}
                  >
                    <MenuItem value="" disabled>
                      Select Verifier
                    </MenuItem>
                    {verifiers.map((v) => (
                      <MenuItem key={v.id} value={v.id}>
                        {v.name} ({v.email})
                      </MenuItem>
                    ))}
                  </Select>
                )}
                <Button
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={handleVerifierAssign}
                  disabled={
                    verifierLoading ||
                    !selectedVerifier ||
                    verifiers.length === 0 ||
                    assignSuccess
                  }
                  fullWidth
                >
                  {verifierLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Assign Verifier"
                  )}
                </Button>
              </>
            )}
          </>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default HospitalAssignedForVerifier;
