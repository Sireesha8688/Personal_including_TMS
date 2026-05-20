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
  MenuItem,
  Select,
  IconButton,
  Card,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SendIcon from "@mui/icons-material/Send";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios"; // Import axios

// Define the query status flow
const QUERY_STATUS_FLOW = {
  OPEN: "Open",
  CLOSED: "Closed",
};

// The component now receives the full 'claim' object and an optional onClaimStatusUpdated callback
const HospitalQueryAccordian = ({ claim, onClaimStatusUpdated }) => {
  const API_ENDPOINT = `http://localhost:9090`;

  // State to hold the entire fetched query record for this claim
  const [queryRecord, setQueryRecord] = useState(null);
  // States for query status management (similar to InsurerHospitalClaimCard)
  const [currentQueryStatus, setCurrentQueryStatus] = useState(
    QUERY_STATUS_FLOW.OPEN
  );
  const [tempQueryStatus, setTempQueryStatus] = useState(
    QUERY_STATUS_FLOW.OPEN
  );
  const [queryStatusDisabled, setQueryStatusDisabled] = useState(true);

  // State to manage new query inputs before submission
  const [newQueryInputs, setNewQueryInputs] = useState([
    { queryText: "", queryRequest: "", attachmentRequired: false },
  ]);

  const [queryLoading, setQueryLoading] = useState(false); // For API call loading
  const [queryError, setQueryError] = useState(""); // For API call errors
  const [submitSuccess, setSubmitSuccess] = useState(false); // For successful submission feedback

  // Function to fetch existing query data for the claim
  useEffect(() => {
    const getQueryData = async () => {
      setQueryLoading(true);
      setQueryError("");
      setSubmitSuccess(false); // Reset success message on new fetch

      try {
        // Use claim.id for fetching queries related to this claim
        const response = await axios.get(
          `${API_ENDPOINT}/hospitalclaimsqueries?claimRaisedId=${claim.id}`
        );
        const data = response.data; // Axios automatically parses JSON into response.data

        if (data && data.length > 0) {
          const fetchedRecord = data[0]; // As per JSON-server 0-index requirement
          setQueryRecord(fetchedRecord);
          setCurrentQueryStatus(fetchedRecord.queryStatus);
          setTempQueryStatus(fetchedRecord.queryStatus);
          setQueryStatusDisabled(true); // Disable status dropdown if record exists
          setNewQueryInputs([
            { queryText: "", queryRequest: "", attachmentRequired: false },
          ]); // Clear new inputs
        } else {
          // No existing query record for this claim
          setQueryRecord(null);
          setCurrentQueryStatus(QUERY_STATUS_FLOW.OPEN);
          setTempQueryStatus(QUERY_STATUS_FLOW.OPEN);
          setQueryStatusDisabled(false); // Enable status dropdown for new record
        }
      } catch (error) {
        console.error("Error fetching query data:", error);
        // Axios errors have a response property for HTTP errors
        setQueryError(
          `Failed to load queries: ${error.message || error.response?.statusText}`
        );
      } finally {
        setQueryLoading(false);
      }
    };

    // Only fetch if claim.id is available
    if (claim && claim.id) {
      getQueryData();
    }
  }, [claim, API_ENDPOINT]); // Re-run when claim object or API_ENDPOINT changes

  // Handler for temporary query status change in dropdown
  const handleTempQueryStatusChange = (newStatus) => {
    setTempQueryStatus(newStatus);
  };

  // Handler for "Select" button for query status
  const handleSelectQueryStatus = async () => {
    setQueryLoading(true);
    setQueryError("");
    try {
      if (queryRecord) {
        // If query record exists, update its status using axios.put
        const updatedRecord = { ...queryRecord, queryStatus: tempQueryStatus };
        const response = await axios.put(
          `${API_ENDPOINT}/hospitalclaimsqueries/${queryRecord.id}`,
          updatedRecord // Axios sends data directly as the request body
        );
        const result = response.data; // Axios automatically parses JSON
        setQueryRecord(result); // Update with the latest record
        setCurrentQueryStatus(tempQueryStatus);
        setSubmitSuccess(true);
      } else {
        // If no record, status will be set on initial query submission
        // No API call here, as it will be handled by handleQuerySubmit for initial POST
        setCurrentQueryStatus(tempQueryStatus);
      }
      setQueryStatusDisabled(true);
    } catch (error) {
      console.error("Error updating query status:", error);
      setQueryError(
        `Failed to update status: ${error.message || error.response?.statusText}`
      );
    } finally {
      setQueryLoading(false);
    }
  };

  // Handler for "Edit" button for query status
  const handleEditQueryStatus = () => {
    setQueryStatusDisabled(false);
    setTempQueryStatus(currentQueryStatus); // Revert temp to current committed status
  };

  // Handler for adding a new query input row
  const handleAddQueryRow = () => {
    setNewQueryInputs([
      ...newQueryInputs,
      { queryText: "", queryRequest: "", attachmentRequired: false },
    ]);
  };

  // Handler for input changes in the new query rows
  const handleNewQueryInputChange = (index, field, value) => {
    const updatedInputs = [...newQueryInputs];
    updatedInputs[index][field] = value;
    setNewQueryInputs(updatedInputs);
  };

  // Function to handle attachment download
  const handleDownloadAttachment = (base64Data, queryId, attachmentIndex) => {
    // Decode base64 string to a binary string
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/octet-stream" }); // Generic binary type

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    // Provide a generic filename. You might want to enhance this if your schema includes file names.
    link.setAttribute(
      "download",
      `query_${queryId}_attachment_${attachmentIndex + 1}.bin`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the object URL
  };

  // Handler for submitting new queries
  const handleQuerySubmit = async () => {
    setQueryLoading(true);
    setQueryError("");
    setSubmitSuccess(false);

    try {
      const queriesToSubmit = newQueryInputs
        .filter(
          (input) =>
            input.queryText.trim() !== "" || input.queryRequest.trim() !== ""
        )
        .map((input, index) => ({
          queryId: `${Date.now()}-${index}`, // Unique ID for each query
          queryText: input.queryText,
          queryRequest: input.queryRequest,
          dateRaised: new Date().toISOString().slice(0, 19).replace("T", " "), // Current timestamp
          queryResponse: "", // Null/empty for new queries
          attachmentRequired: input.attachmentRequired,
          attachment: [], // Empty array for new queries
        }));

      if (queriesToSubmit.length === 0) {
        setQueryError("Please enter at least one query to submit.");
        setQueryLoading(false);
        return;
      }

      if (queryRecord) {
        // If query record exists, update it (PUT request) using axios.put
        const updatedQueries = [...queryRecord.query, ...queriesToSubmit];
        const updatedQueryRecordPayload = {
          ...queryRecord,
          query: updatedQueries,
          queryStatus: currentQueryStatus, // Ensure status is also sent
          updatedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
        };

        const response = await axios.put(
          `${API_ENDPOINT}/hospitalclaimsqueries/${queryRecord.id}`,
          updatedQueryRecordPayload
        );
        setQueryRecord(response.data); // Update local state with the new record
      } else {
        // If no query record exists, create a new one (POST request) using axios.post
        const newQueryRecordPayload = {
          claimRaisedId: claim.id, // Use claim.id here
          raisedByInsurerId: claim.insurerId, // Use claim.insurerId here
          queryStatus: currentQueryStatus,
          query: queriesToSubmit,
          createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
          updatedAt: new Date().toISOString().slice(0, 19).replace("T", " "),
        };

        const response = await axios.post(
          `${API_ENDPOINT}/hospitalclaimsqueries`,
          newQueryRecordPayload
        );
        setQueryRecord(response.data); // Set the newly created record
      }

      // After successfully updating/creating the query record, update the main claim's insurerStatus
      await axios.patch(`${API_ENDPOINT}/hospitalclaims/${claim.id}`, {
        insurerStatus: "CLAIM_ASSIGNED_FOR_QUERY",
        updatedAt: new Date().toISOString().slice(0, 19).replace("T", " "), // Update main claim's timestamp
      });

      setSubmitSuccess(
        "Query submitted successfully and claim status updated!"
      );
      // Clear new query inputs after successful submission
      setNewQueryInputs([
        { queryText: "", queryRequest: "", attachmentRequired: false },
      ]);

      // Notify the parent component that the claim status has been updated
      if (onClaimStatusUpdated) {
        onClaimStatusUpdated(claim.id, "CLAIM_ASSIGNED_FOR_QUERY");
      }
    } catch (error) {
      console.error("Error submitting query:", error);
      setQueryError(
        `Failed to submit query: ${error.message || error.response?.statusText}`
      );
    } finally {
      setQueryLoading(false);
    }
  };

  const hasExistingQueries =
    queryRecord && queryRecord.query && queryRecord.query.length > 0;

  return (
    <Accordion sx={{ mt: 2, borderRadius: "8px" }} elevation={2}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight="bold">
          {hasExistingQueries
            ? "See Query Responses"
            : "Raise Query to Hospital"}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {queryLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress size={24} />
            <Typography sx={{ ml: 1 }}>Loading...</Typography>
          </Box>
        )}
        {queryError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {queryError}
          </Alert>
        )}
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {submitSuccess}
          </Alert>
        )}

        {/* Query Status Management */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            Query Status:
          </Typography>
          <Select
            value={tempQueryStatus}
            onChange={(e) => handleTempQueryStatusChange(e.target.value)}
            size="small"
            sx={{ minWidth: 100, mr: 1 }}
            disabled={queryStatusDisabled || queryLoading}
          >
            {Object.values(QUERY_STATUS_FLOW).map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
          <Button
            onClick={handleSelectQueryStatus}
            disabled={queryLoading || queryStatusDisabled}
            variant="outlined"
            size="small"
            sx={{ mr: 1 }}
          >
            Select
          </Button>
          <Button
            onClick={handleEditQueryStatus}
            disabled={queryLoading || !queryStatusDisabled}
            variant="outlined"
            size="small"
          >
            Edit
          </Button>
        </Box>

        {/* Display Existing Queries and Responses */}
        {hasExistingQueries && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Existing Queries:
            </Typography>
            {queryRecord.query.map((q, index) => (
              <Card
                key={q.queryId}
                variant="outlined"
                sx={{ mb: 2, p: 2, borderRadius: "8px" }}
              >
                <Typography variant="subtitle2">
                  Query {index + 1} (ID: {q.queryId})
                </Typography>
                <Typography variant="body2">
                  <strong>Raised:</strong> {q.dateRaised}
                </Typography>
                <Typography variant="body2">
                  <strong>Text:</strong> {q.queryText}
                </Typography>
                <Typography variant="body2">
                  <strong>Request:</strong> {q.queryRequest}
                </Typography>
                <Typography variant="body2">
                  <strong>Attachment Required:</strong>{" "}
                  {q.attachmentRequired ? "Yes" : "No"}
                </Typography>
                {q.queryResponse && (
                  <Typography variant="body2" sx={{ mt: 1, color: "green" }}>
                    <strong>Response:</strong> {q.queryResponse}
                  </Typography>
                )}
                {q.attachment && q.attachment.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Attachments:</strong>
                    </Typography>
                    {q.attachment.map((attachmentString, attIndex) => (
                      <Button
                        key={attIndex}
                        variant="outlined"
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() =>
                          handleDownloadAttachment(
                            attachmentString,
                            q.queryId,
                            attIndex
                          )
                        }
                        sx={{ mr: 1, mb: 1 }}
                      >
                        Download Attachment {attIndex + 1}
                      </Button>
                    ))}
                  </Box>
                )}
              </Card>
            ))}
          </Box>
        )}

        {/* Section for Raising New Queries */}
        <Typography variant="h6" gutterBottom>
          {hasExistingQueries ? "Add New Query" : "Raise New Query"}
        </Typography>
        {newQueryInputs.map((input, index) => (
          <Box
            key={index}
            sx={{ mb: 2, p: 2, border: "1px solid #eee", borderRadius: "8px" }}
          >
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              New Query {index + 1}
            </Typography>
            <TextField
              label="Query Text"
              fullWidth
              multiline
              rows={2}
              value={input.queryText}
              onChange={(e) =>
                handleNewQueryInputChange(index, "queryText", e.target.value)
              }
              sx={{ mb: 2 }}
            />
            <TextField
              label="Query Request"
              fullWidth
              multiline
              rows={2}
              value={input.queryRequest}
              onChange={(e) =>
                handleNewQueryInputChange(index, "queryRequest", e.target.value)
              }
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
              <label>
                <input
                  type="checkbox"
                  checked={input.attachmentRequired}
                  onChange={(e) =>
                    handleNewQueryInputChange(
                      index,
                      "attachmentRequired",
                      e.target.checked
                    )
                  }
                />{" "}
                Attachment Required
              </label>
            </Box>
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddQueryRow}
          disabled={queryLoading}
          sx={{ mb: 2 }}
        >
          Add Another Query
        </Button>

        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={handleQuerySubmit}
          disabled={
            queryLoading ||
            newQueryInputs.every(
              (input) =>
                input.queryText.trim() === "" &&
                input.queryRequest.trim() === ""
            )
          }
          fullWidth
        >
          {queryLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Submit All New Queries"
          )}
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};

export default HospitalQueryAccordian;
