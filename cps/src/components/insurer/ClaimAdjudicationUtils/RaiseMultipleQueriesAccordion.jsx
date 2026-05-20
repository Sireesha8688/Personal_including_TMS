import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";

const API_BASE_URL = "http://localhost:9090";

const RaiseMultipleQueriesAccordion = ({
  claim,
  open,
  onClose,
  refreshClaims,
}) => {
  const [queries, setQueries] = useState([
    {
      queryText: "",
      queryRequest: "",
      attachmentRequired: false,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Add a new empty query row
  const handleAddQuery = () => {
    setQueries((prev) => [
      ...prev,
      { queryText: "", queryRequest: "", attachmentRequired: false },
    ]);
  };

  // Remove query at index
  const handleRemoveQuery = (idx) => {
    setQueries((prev) => prev.filter((_, i) => i !== idx));
  };

  // Update field in a query
  const handleChange = (idx, field, value) => {
    setQueries((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q))
    );
  };

  // Submit all queries
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    // Validate
    if (queries.some((q) => !q.queryText.trim() || !q.queryRequest.trim())) {
      setError("All queries must have text and request.");
      setLoading(false);
      return;
    }

    // Prepare schema
    const now = new Date().toISOString();
    const queryArray = queries.map((q, idx) => ({
      queryId: idx + 1,
      queryText: q.queryText,
      queryRequest: q.queryRequest,
      dateRaised: now,
      queryResponse: null,
      attachmentRequired: q.attachmentRequired,
      attachment: [],
    }));

    const payload = {
      id: Date.now().toString(),
      raisedByInsurerId: claim.insurerId,
      customerClaimid: claim.id,
      queryStatus: "OPEN",
      query: queryArray,
      createdAt: now,
      updatedAt: null,
    };

    try {
      await axios.post(`${API_BASE_URL}/customerclaimsqueries`, payload);
      await axios.patch(`${API_BASE_URL}/customerclaims/${claim.id}`, {
        insurerStatus: "CLAIM_ASSIGNED_FOR_QUERY",
      });
      if (refreshClaims) refreshClaims();
      if (onClose) onClose();
      setQueries([
        { queryText: "", queryRequest: "", attachmentRequired: false },
      ]);
    } catch (err) {
      setError("Failed to submit queries.");
    }
    setLoading(false);
  };

  return (
    <Accordion expanded={open} onChange={onClose}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight="bold">Raise Queries to Customer</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {queries.map((q, idx) => (
          <Box
            key={idx}
            sx={{
              border: "1px solid #ddd",
              borderRadius: 1,
              mb: 2,
              p: 2,
              position: "relative",
            }}
          >
            <TextField
              label="Query Text"
              fullWidth
              value={q.queryText}
              onChange={(e) => handleChange(idx, "queryText", e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Query Request"
              fullWidth
              value={q.queryRequest}
              onChange={(e) =>
                handleChange(idx, "queryRequest", e.target.value)
              }
              sx={{ mb: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={q.attachmentRequired}
                  onChange={(e) =>
                    handleChange(idx, "attachmentRequired", e.target.checked)
                  }
                />
              }
              label="Attachment Required"
              sx={{ mb: 2 }}
            />
            {queries.length > 1 && (
              <IconButton
                onClick={() => handleRemoveQuery(idx)}
                sx={{ position: "absolute", top: 8, right: 8 }}
                color="error"
                aria-label="Remove query"
              >
                <RemoveCircleIcon />
              </IconButton>
            )}
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddQuery}
          sx={{ mb: 2 }}
        >
          Add Query
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={18} /> : "Submit All Queries"}
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};

export default RaiseMultipleQueriesAccordion;
