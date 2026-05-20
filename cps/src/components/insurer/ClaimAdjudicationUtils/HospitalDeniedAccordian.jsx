import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";

const HospitalDeniedAccordian = ({ claim, onClaimDenied }) => {
  const API_ENDPOINT = `http://localhost:9090`;

  const [denyReason, setDenyReason] = useState("");
  const [denyLoading, setDenyLoading] = useState(false);
  const [denyError, setDenyError] = useState("");
  const [denySuccess, setDenySuccess] = useState("");
  const [isEditingMessage, setIsEditingMessage] = useState(false);

  useEffect(() => {
    if (
      claim.insurerStatus === "CLAIM_DENIED" &&
      claim.finalClaimSettlement?.insurerMessage
    ) {
      setDenyReason(claim.finalClaimSettlement.insurerMessage);
      setIsEditingMessage(false);
    } else {
      setDenyReason("");
      setIsEditingMessage(true);
    }
    setDenyError("");
    setDenySuccess("");
  }, [claim]);

  const handleSubmitDenial = async () => {
    if (!denyReason.trim()) {
      setDenyError("Please provide a reason for denying/updating the claim.");
      return;
    }

    setDenyLoading(true);
    setDenyError("");
    setDenySuccess("");

    try {
      const isClaimAlreadyDenied = claim.insurerStatus === "CLAIM_DENIED";

      const updatePayload = {
        ...(isClaimAlreadyDenied ? {} : { insurerStatus: "CLAIM_DENIED" }),
        finalClaimSettlement: {
          ...claim.finalClaimSettlement,
          insurerMessage: denyReason,
        },
        updatedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      };

      await axios.patch(
        `${API_ENDPOINT}/hospitalclaims/${claim.id}`,
        updatePayload
      );

      setDenySuccess(
        isClaimAlreadyDenied
          ? "Denial message updated successfully."
          : "Claim denied successfully."
      );
      setIsEditingMessage(false);

      if (onClaimDenied) {
        onClaimDenied();
      }
    } catch (err) {
      console.error("Failed to process denial/update:", err);
      setDenyError(
        `Failed to process: ${err.message || err.response?.statusText}`
      );
    } finally {
      setDenyLoading(false);
    }
  };

  const handleEditMessage = () => {
    setIsEditingMessage(true);
    setDenyError("");
    setDenySuccess("");
  };

  const isClaimDenied = claim.insurerStatus === "CLAIM_DENIED";

  return (
    <Accordion sx={{ mt: 2, borderRadius: "8px" }} elevation={2}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight="bold">
          {isClaimDenied ? "Claim Denied Details" : "Deny Claim"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {isClaimDenied && (
          <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
            <strong>Current Denial Reason:</strong>
          </Typography>
        )}
        <TextField
          label="Reason for Denial"
          fullWidth
          multiline
          rows={4}
          value={denyReason}
          onChange={(e) => setDenyReason(e.target.value)}
          sx={{ mb: 2 }}
          disabled={denyLoading || (isClaimDenied && !isEditingMessage)}
        />
        <Box
          sx={{ mt: 2, display: "flex", gap: 1, justifyContent: "flex-end" }}
        >
          {isClaimDenied && !isEditingMessage && (
            <Button
              variant="outlined"
              onClick={handleEditMessage}
              disabled={denyLoading}
            >
              Edit Message
            </Button>
          )}
          <Button
            variant="contained"
            color={isClaimDenied ? "primary" : "error"}
            startIcon={<SendIcon />}
            onClick={handleSubmitDenial}
            disabled={
              denyLoading ||
              !denyReason.trim() ||
              (isClaimDenied && !isEditingMessage)
            }
            fullWidth={!isClaimDenied || isEditingMessage}
            sx={isClaimDenied && !isEditingMessage ? { flexGrow: 1 } : {}}
          >
            {denyLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : isClaimDenied ? (
              "Update Message"
            ) : (
              "Deny Claim"
            )}
          </Button>
        </Box>
        {denyError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {denyError}
          </Alert>
        )}
        {denySuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {denySuccess}
          </Alert>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default HospitalDeniedAccordian;
