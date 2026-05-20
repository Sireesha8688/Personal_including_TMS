import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  CircularProgress,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Alert,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DescriptionIcon from "@mui/icons-material/Description";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import ThumbsUpIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbsDownIcon from "@mui/icons-material/ThumbDownAlt";
import ReplayIcon from "@mui/icons-material/Replay";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";

const API_BASE_URL = "http://localhost:9090";

// Helper: File to Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const StatusCardComponent = ({ claim, refreshClaims }) => {
  // Added refreshClaims to props
  // Query states
  const [queryDetails, setQueryDetails] = useState(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState("");
  const [queryResponses, setQueryResponses] = useState({});
  const [querySubmittingId, setQuerySubmittingId] = useState(null);

  // Re-raise states
  const [reRaiseMessage, setReRaiseMessage] = useState("");
  const [reRaiseSubmitting, setReRaiseSubmitting] = useState(false);
  const [reRaiseSuccess, setReRaiseSuccess] = useState("");
  const [reRaiseError, setReRaiseError] = useState("");
  const [expandedAccordion, setExpandedAccordion] = useState(false);

  // This useCallback is important to prevent infinite loops with useEffect dependencies
  const fetchQueries = useCallback(async () => {
    setQueryLoading(true);
    setQueryError("");
    try {
      const response = await axios.get(
        `${API_BASE_URL}/customerclaimsqueries?customerClaimid=${claim.id}`
      );
      if (response.data && response.data.length > 0) {
        const fetchedQueryObj = response.data[0];
        setQueryDetails(fetchedQueryObj);
        // Init state for each query
        const initialResponses = {};
        fetchedQueryObj.query.forEach((q) => {
          initialResponses[q.queryId] = {
            response: q.queryResponse || "",
            attachment: null, // For new upload
            currentAttachments: q.attachment || [], // Existing attachments
          };
        });
        setQueryResponses(initialResponses);
      } else {
        setQueryDetails(null);
      }
    } catch (err) {
      setQueryError("Failed to load queries for this claim.");
      console.error("Error fetching queries:", err);
    } finally {
      setQueryLoading(false);
    }
  }, [claim.id]); // Dependency on claim.id

  useEffect(() => {
    // Only fetch if not currently editing/creating a hospital
    if (claim.insurerStatus === "CLAIM_ASSIGNED_FOR_QUERY") {
      fetchQueries();
    }
  }, [claim.insurerStatus, fetchQueries]); // Depend on claim.insurerStatus and memoized fetchQueries

  const handleQueryResponseChange = (queryId, value) => {
    setQueryResponses((prev) => ({
      ...prev,
      [queryId]: { ...prev[queryId], response: value },
    }));
  };

  const handleQueryAttachmentChange = (queryId, file) => {
    if (file && file.type === "application/pdf") {
      setQueryResponses((prev) => ({
        ...prev,
        [queryId]: { ...prev[queryId], attachment: file },
      }));
      setQueryError(""); // Clear any previous attachment errors
    } else {
      setQueryResponses((prev) => ({
        ...prev,
        [queryId]: { ...prev[queryId], attachment: null }, // Clear invalid attachment
      }));
      setQueryError("Please upload a PDF file for the attachment.");
    }
  };

  // Download a Base64 PDF
  const downloadBase64Pdf = (base64String, fileName) => {
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

  // Submit query response
  const handleSubmitQueryResponse = async (queryOuterId, queryItem) => {
    setQuerySubmittingId(queryItem.queryId);
    setQueryError("");
    const currentResponseState = queryResponses[queryItem.queryId];

    if (!currentResponseState.response.trim()) {
      setQueryError("Query response cannot be empty.");
      setQuerySubmittingId(null);
      return;
    }

    // Check if attachment is required and not provided (neither new nor existing)
    if (
      queryItem.attachmentRequired &&
      !currentResponseState.attachment &&
      (!currentResponseState.currentAttachments ||
        currentResponseState.currentAttachments.length === 0)
    ) {
      setQueryError("Attachment is required for this query.");
      setQuerySubmittingId(null);
      return;
    }

    try {
      let newAttachmentArray = currentResponseState.currentAttachments || [];
      if (currentResponseState.attachment) {
        const base64Attachment = await fileToBase64(
          currentResponseState.attachment
        );
        newAttachmentArray = [base64Attachment]; // Overwrite with new attachment
      }

      // Fetch the latest queries object to ensure we don't accidentally overwrite concurrent updates
      const queriesResponse = await axios.get(
        `${API_BASE_URL}/customerclaimsqueries/${queryOuterId}`
      );
      const currentQueriesObject = queriesResponse.data;

      // Update only the relevant query within the array
      const updatedQueryArray = currentQueriesObject.query.map((q) =>
        q.queryId === queryItem.queryId
          ? {
              ...q,
              queryResponse: currentResponseState.response,
              attachment: newAttachmentArray,
            }
          : q
      );

      const updatePayload = {
        ...currentQueriesObject,
        query: updatedQueryArray,
        updatedAt: new Date().toISOString(),
      };

      await axios.put(
        `${API_BASE_URL}/customerclaimsqueries/${queryOuterId}`,
        updatePayload
      );

      if (refreshClaims) refreshClaims(); // Refresh parent component's claims data
      setQueryDetails(updatePayload); // Update local state for immediate UI reflection
      setQueryResponses((prev) => ({
        ...prev,
        [queryItem.queryId]: {
          ...prev[queryItem.queryId],
          attachment: null, // Clear the file input after submission
          currentAttachments: newAttachmentArray, // Update currentAttachments with the submitted one
        },
      }));
    } catch (err) {
      console.error("Error submitting query response:", err);
      setQueryError("Failed to submit query response. Please try again.");
    } finally {
      setQuerySubmittingId(null);
    }
  };

  // Re-raise claim handler
  const handleReRaiseClaim = async () => {
    setReRaiseSubmitting(true);
    setReRaiseError("");
    setReRaiseSuccess("");
    if (!reRaiseMessage.trim()) {
      setReRaiseError("Please provide a message for re-raising the claim.");
      setReRaiseSubmitting(false);
      return;
    }
    try {
      const updatePayload = {
        customerStatus: "CLAIM_RE_RAISE",
        customerReRaiseClaimMessage: reRaiseMessage,
        updatedAt: new Date().toISOString(),
      };
      await axios.patch(
        `${API_BASE_URL}/customerclaims/${claim.id}`,
        updatePayload
      );
      setReRaiseSuccess("Claim re-raised successfully!");
      if (refreshClaims) refreshClaims(); // Refresh parent component's claims data
      setReRaiseMessage("");
      setExpandedAccordion(false); // Collapse accordion after successful re-raise
    } catch (err) {
      console.error("Error re-raising claim:", err);
      setReRaiseError("Failed to re-raise claim. Please try again.");
    } finally {
      setReRaiseSubmitting(false);
    }
  };

  // Status color
  const getStatusColor = (status) => {
    switch (status) {
      case "CLAIM_APPROVED":
        return "success.main";
      case "CLAIM_DENIED":
        return "error.main";
      case "CLAIM_ASSIGNED_FOR_QUERY":
        return "warning.main";
      case "CLAIM_ASSIGNED_FOR_VERIFIER_REVIEW":
        return "info.main";
      case "CLAIM_RE_RAISE":
        return "primary.main";
      case "CLAIM_RAISED":
        return "info.main";
      case "CLAIM_SETTLED":
        return "success.main";
      default:
        return "text.secondary";
    }
  };

  return (
    <Card sx={{ mb: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Claim Tracker: {claim.customerName || "N/A"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aadhar: {claim.customerAadharNumber || "N/A"} | Claim ID: {claim.id}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Treatment: <b>{claim.treatmentOffered || "N/A"}</b>
        </Typography>
        <Typography variant="body2">
          Estimated Cost: ₹{claim.costOfTreatment?.toFixed(2) || "N/A"}
        </Typography>

        <Typography
          variant="subtitle1"
          sx={{ mt: 2 }}
          color={getStatusColor(claim.insurerStatus)}
        >
          Insurer Status:{" "}
          <b>{claim.insurerStatus?.replace(/_/g, " ") || "N/A"}</b>
        </Typography>

        {/* Conditional Messages */}
        {claim.finalClaimSettlement?.insurerMessage && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Insurer Message: {claim.finalClaimSettlement.insurerMessage}
          </Typography>
        )}
        {claim.customerReRaiseClaimMessage && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Your Re-Raise Message: {claim.customerReRaiseClaimMessage}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* --- QUERY TABLE --- */}
        {claim.insurerStatus === "CLAIM_ASSIGNED_FOR_QUERY" && (
          <Accordion defaultExpanded sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant="subtitle1"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <QueryStatsIcon sx={{ mr: 1 }} /> Queries from Insurer
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {queryLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                  <CircularProgress size={20} />
                  <Typography sx={{ ml: 1 }}>Loading queries...</Typography>
                </Box>
              ) : queryError ? (
                <Alert severity="error">{queryError}</Alert>
              ) : queryDetails && queryDetails.query.length > 0 ? (
                <TableContainer component={Paper} sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <b>Query Request</b>
                        </TableCell>
                        <TableCell>
                          <b>Your Response</b>
                        </TableCell>
                        <TableCell>
                          <b>Attachment</b>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {queryDetails.query.map((q) => {
                        // A query is considered 'submitted' if it has a response and attachments
                        const isSubmitted =
                          q.queryResponse !== null &&
                          q.queryResponse !== "" &&
                          q.attachment &&
                          q.attachment.length > 0;

                        // Response fields are enabled if they haven't been submitted yet
                        const isResponseEnabled = !isSubmitted;

                        return (
                          <TableRow key={q.queryId}>
                            {/* Query Request */}
                            <TableCell
                              sx={{ verticalAlign: "top", width: "33%" }}
                            >
                              <Typography variant="body2" fontWeight="bold">
                                {q.queryText}
                              </Typography>
                              <Typography variant="body2">
                                {q.queryRequest}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                              >
                                Date Raised:{" "}
                                {new Date(q.dateRaised).toLocaleString()}
                              </Typography>
                            </TableCell>
                            {/* Query Response */}
                            <TableCell sx={{ width: "33%" }}>
                              <TextField
                                label="Your Response"
                                fullWidth
                                multiline
                                rows={3}
                                margin="normal"
                                value={
                                  queryResponses[q.queryId]?.response || ""
                                }
                                onChange={(e) =>
                                  handleQueryResponseChange(
                                    q.queryId,
                                    e.target.value
                                  )
                                }
                                required
                                disabled={!isResponseEnabled}
                              />
                            </TableCell>
                            {/* Attachment */}
                            <TableCell sx={{ width: "33%" }}>
                              {isSubmitted ? (
                                q.attachment.map((att, index) => (
                                  <Button
                                    key={index}
                                    size="small"
                                    onClick={() =>
                                      downloadBase64Pdf(
                                        att,
                                        `Query_Attachment_${claim.id}_${q.queryId}_${index}.pdf`
                                      )
                                    }
                                    startIcon={<DescriptionIcon />}
                                    sx={{ mr: 1, mt: 0.5 }}
                                  >
                                    Download Attachment {index + 1}
                                  </Button>
                                ))
                              ) : (
                                <>
                                  <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<DescriptionIcon />}
                                    fullWidth
                                    disabled={!isResponseEnabled}
                                  >
                                    {queryResponses[q.queryId]?.attachment
                                      ?.name ||
                                      (queryResponses[q.queryId]
                                        ?.currentAttachments?.length > 0
                                        ? "Attachment already uploaded"
                                        : "Choose PDF")}
                                    <input
                                      type="file"
                                      hidden
                                      accept="application/pdf"
                                      onChange={(e) =>
                                        handleQueryAttachmentChange(
                                          q.queryId,
                                          e.target.files[0]
                                        )
                                      }
                                      required={q.attachmentRequired}
                                      disabled={!isResponseEnabled}
                                    />
                                  </Button>
                                  {queryResponses[q.queryId]?.currentAttachments
                                    ?.length > 0 && (
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ ml: 1, mt: 0.5, display: "block" }}
                                    >
                                      Existing:{" "}
                                      {
                                        queryDetails.query.find(
                                          (item) => item.queryId === q.queryId
                                        )?.attachment?.length
                                      }{" "}
                                      file(s)
                                    </Typography>
                                  )}
                                  <Box sx={{ mt: 1 }}>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      size="small"
                                      disabled={
                                        querySubmittingId === q.queryId ||
                                        !queryResponses[
                                          q.queryId
                                        ]?.response.trim() ||
                                        (q.attachmentRequired &&
                                          !queryResponses[q.queryId]
                                            ?.attachment &&
                                          (!queryResponses[q.queryId]
                                            ?.currentAttachments ||
                                            queryResponses[q.queryId]
                                              ?.currentAttachments?.length ===
                                              0))
                                      }
                                      onClick={() =>
                                        handleSubmitQueryResponse(
                                          queryDetails.id,
                                          q
                                        )
                                      }
                                      startIcon={
                                        querySubmittingId === q.queryId ? (
                                          <CircularProgress
                                            size={18}
                                            color="inherit"
                                          />
                                        ) : (
                                          <SendIcon />
                                        )
                                      }
                                    >
                                      Submit
                                    </Button>
                                  </Box>
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No open queries for this claim.
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        )}

        {/* --- VERIFIER REVIEW --- */}
        {claim.insurerStatus === "CLAIM_ASSIGNED_FOR_VERIFIER_REVIEW" && (
          <Alert
            severity="info"
            sx={{ mt: 2 }}
            iconMapping={{ info: <QueryStatsIcon /> }}
          >
            Claim is currently assigned for review by the Insurer Verifier.
          </Alert>
        )}

        {/* --- DENIED --- */}
        {claim.insurerStatus === "CLAIM_DENIED" && (
          <Box sx={{ mt: 2 }}>
            <Alert severity="error" iconMapping={{ error: <ThumbsDownIcon /> }}>
              Claim has been <b>DENIED</b> by the Insurer.
            </Alert>
            <Accordion
              expanded={expandedAccordion === "reRaisePanel"}
              onChange={(event, isExpanded) =>
                setExpandedAccordion(isExpanded ? "reRaisePanel" : false)
              }
              sx={{ mt: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  variant="subtitle1"
                  component="span"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <ReplayIcon sx={{ mr: 1 }} /> Re-raise Claim
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  label="Reason for Re-raise"
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  value={reRaiseMessage}
                  onChange={(e) => setReRaiseMessage(e.target.value)}
                  required
                />
                {reRaiseError && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {reRaiseError}
                  </Alert>
                )}
                {reRaiseSuccess && (
                  <Alert severity="success" sx={{ mt: 1 }}>
                    {reRaiseSuccess}
                  </Alert>
                )}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleReRaiseClaim}
                  disabled={reRaiseSubmitting || !reRaiseMessage.trim()}
                  startIcon={
                    reRaiseSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <ReplayIcon />
                    )
                  }
                  sx={{ mt: 2 }}
                >
                  Re-raise Claim
                </Button>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}

        {/* --- APPROVED --- */}
        {claim.insurerStatus === "CLAIM_APPROVED" && (
          <Alert
            severity="success"
            sx={{ mt: 2 }}
            iconMapping={{ success: <ThumbsUpIcon /> }}
          >
            Claim has been <b>APPROVED</b> by the Insurer!
            <br />
            Approved Amount: ₹
            {claim.finalClaimSettlement?.insurerApprovedAmount?.toFixed(2) ||
              "N/A"}
            {claim.finalClaimSettlement?.insurerFinalBill && (
              <Button
                size="small"
                onClick={() =>
                  downloadBase64Pdf(
                    claim.finalClaimSettlement.insurerFinalBill,
                    `Insurer_Final_Bill_${claim.id}.pdf`
                  )
                }
                startIcon={<DescriptionIcon />}
                sx={{ ml: 1, mt: 0.5 }}
              >
                Download Insurer Final Bill
              </Button>
            )}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusCardComponent;
