import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Chip,
  useTheme,
} from "@mui/material";
import { Check, Close, AttachFile, Warning } from "@mui/icons-material";
import axios from "axios";

const PreAuth = ({ preauths, setPreauths, onApprove, onCancel, onFileUpload }) => {
  const theme = useTheme();
  const [aadhaar, setAadhaar] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const [policyIds, setPolicyIds] = useState([]);
  const [treatment, setTreatment] = useState("");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState(null);

  const emergencyFormPaperStyle = {
    p: 2,
    mb: 3,
    bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#fff8e1",
    color: theme.palette.mode === "dark" ? theme.palette.common.white : "inherit",
  };

  const fetchCustomerDetails = async () => {
    setError("");
    setCustomerId(null);
    setPolicyIds([]);
    setLoadingCustomer(true);

    if (aadhaar.length !== 12) {
      setError("Please enter a valid 12-digit Aadhaar number.");
      setLoadingCustomer(false);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:9090/customers?aadharcardNumber=${aadhaar}`
      );
      if (res.data.length === 0) {
        setError("No customer found with this Aadhaar number.");
        setLoadingCustomer(false);
        return;
      }
      const customer = res.data[0];
      setCustomerId(customer.id);
      const ids = customer.policies?.map((p) => p.policyId) || [];
      setPolicyIds(ids);
    } catch (err) {
      setError(err.message || "Failed to fetch customer data.");
    } finally {
      setLoadingCustomer(false);
    }
  };

  const handleSubmit = async () => {
    if (!customerId) {
      setError("Please fetch customer details first.");
      return;
    }
    if (!treatment || !cost || !date) {
      setError("Please fill all fields.");
      return;
    }

    const newPreauth = {
      customerId,
      policyIds,
      treatment,
      cost: Number(cost),
      date,
      status: "pending",
      documents: [],
      admissionDetails: { isAdmitted: false },
    };

    try {
      const res = await axios.post("http://localhost:9090/preauths", newPreauth);
      setPreauths((prev) => [res.data, ...prev]);
      setAadhaar("");
      setCustomerId(null);
      setPolicyIds([]);
      setTreatment("");
      setCost("");
      setDate("");
      setError("");
    } catch (err) {
      setError(err.message || "Error saving preauthorization");
    }
  };

  const selectEmergency = (preauth) => {
    setSelectedEmergency(preauth);
    setAadhaar(preauth.aadhaarNumber || "");
    setTreatment(preauth.treatment || "");
    setCost(preauth.cost ? preauth.cost.toString() : "");
    setDate(preauth.date || "");
  };

  // Mark preauth as completed
  const handleComplete = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:9090/preauths/${id}`, {
        status: "completed",
      });
      setPreauths((prev) => prev.map((p) => (p.id === id ? res.data : p)));
    } catch (err) {
      setError(err.message || "Failed to update status to completed");
    }
  };

  // Mark emergency preauth as approved
  const handleCompleteEmergencyPreauth = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:9090/preauths/${id}`, {
        status: "approved",
      });
      setPreauths((prev) => prev.map((p) => (p.id === id ? res.data : p)));
      setSelectedEmergency(null);
    } catch (err) {
      setError(err.message || "Failed to approve emergency preauth");
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mt: 4, mb: 2, color: "primary.main" }}>
        Pre-authorization of Customers (Pending:{" "}
        {preauths.filter((p) => p.status === "pending").length})
      </Typography>

      {selectedEmergency && (
        <Paper sx={emergencyFormPaperStyle}>
          <Typography variant="h6" gutterBottom>
            Complete Emergency Admission Details
          </Typography>
          <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              label="Aadhaar Number"
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
              inputProps={{ maxLength: 12 }}
              variant="outlined"
              size="small"
              sx={{ width: 220 }}
            />
            <Button
              variant="contained"
              onClick={fetchCustomerDetails}
              disabled={loadingCustomer}
            >
              {loadingCustomer ? <CircularProgress size={24} /> : "Fetch Details"}
            </Button>
          </Box>
          {selectedEmergency.aadhaarNumber && (
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography>
                <b>Aadhaar Number:</b> {selectedEmergency.aadhaarNumber}
              </Typography>
              <Typography>
                <b>Customer ID:</b> {selectedEmergency.customerId}
              </Typography>
              <Typography>
                <b>Policy IDs:</b>{" "}
                {selectedEmergency.policyIds && selectedEmergency.policyIds.length > 0
                  ? selectedEmergency.policyIds.join(", ")
                  : "No policies found"}
              </Typography>
            </Paper>
          )}
          <TextField
            label="Treatment Details"
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Cost"
            value={cost}
            onChange={(e) => setCost(e.target.value.replace(/\D/g, ""))}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Date of Treatment"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <Button
            variant="contained"
            color="success"
            onClick={() => handleCompleteEmergencyPreauth(selectedEmergency.id)}
            sx={{ mr: 2 }}
          >
            Complete Emergency Preauth
          </Button>
          <Button variant="outlined" onClick={() => setSelectedEmergency(null)}>
            Cancel
          </Button>
        </Paper>
      )}

      {!selectedEmergency && (
        <>
          <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              label="Enter Aadhaar Number"
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ""))}
              inputProps={{ maxLength: 12 }}
              variant="outlined"
              size="small"
              sx={{ width: 220 }}
            />
            <Button
              variant="contained"
              onClick={fetchCustomerDetails}
              disabled={loadingCustomer}
            >
              {loadingCustomer ? <CircularProgress size={24} /> : "Fetch Details"}
            </Button>
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {customerId && (
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography>
                <b>Customer ID:</b> {customerId}
              </Typography>
              <Typography>
                <b>Policy IDs:</b>{" "}
                {policyIds.length > 0 ? policyIds.join(", ") : "No policies found"}
              </Typography>
            </Paper>
          )}

          {customerId && (
            <Paper sx={{ p: 2, mb: 3 }}>
              <TextField
                label="Treatment Details"
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Cost"
                value={cost}
                onChange={(e) => setCost(e.target.value.replace(/\D/g, ""))}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Date of Treatment"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
              <Button variant="contained" onClick={handleSubmit}>
                Submit Preauthorization
              </Button>
            </Paper>
          )}
        </>
      )}

      {preauths.map((p) => (
        <Paper
          key={p.id}
          sx={{
            mb: 2,
            p: 2,
            bgcolor:
              p.status === "emergency"
                ? theme.palette.mode === "dark"
                  ? theme.palette.grey[800]
                  : "#fff8e1"
                : "inherit",
            color:
              p.status === "emergency" && theme.palette.mode === "dark"
                ? theme.palette.common.white
                : "inherit",
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            <b>Patient ID:</b> {p.id} &nbsp;
            <b>Customer ID:</b> {p.customerId} &nbsp;
            {p.aadhaarNumber && (
              <>
                <b>Aadhaar Number:</b> {p.aadhaarNumber} &nbsp;
              </>
            )}
            <b>Policy IDs:</b> {p.policyIds?.join(", ") || "No policies found"} &nbsp;
            <b>Treatment:</b> {p.treatment} &nbsp;
            <b>Cost:</b> ₹{p.cost} &nbsp;
            <b>Date:</b> {p.date || "N/A"} &nbsp;
            <b>Status:</b>{" "}
            {p.status === "emergency" ? (
              <Chip label="Emergency Admission" color="warning" icon={<Warning />} />
            ) : (
              p.status
            )}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button
              variant="outlined"
              component="label"
              size="small"
              sx={{ mr: 2 }}
              startIcon={<AttachFile />}
            >
              Upload Documents
              <input
                type="file"
                hidden
                multiple
                onChange={(e) => onFileUpload(p.id, [...e.target.files])}
              />
            </Button>
            {p.documents && p.documents.length > 0 && (
              <Typography sx={{ mr: 2 }}>{p.documents.length} file(s) uploaded</Typography>
            )}
            {p.status === "pending" && (
              <>
                <IconButton
                  color="primary"
                  onClick={() => onApprove(p.id)}
                  title="Approve"
                >
                  <Check />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => onCancel(p.id)}
                  title="Cancel"
                >
                  <Close />
                </IconButton>
              </>
            )}
            {p.status !== "completed" && p.status !== "cancelled" && p.status !== "denied" && (
              <Button
                variant="contained"
                color="success"
                onClick={() => handleComplete(p.id)}
                sx={{ ml: 2 }}
              >
                Complete
              </Button>
            )}
            {p.status === "emergency" && (
              <Button
                variant="contained"
                color="warning"
                onClick={() => selectEmergency(p)}
                sx={{ ml: 2 }}
              >
                Complete Details
              </Button>
            )}
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default PreAuth;
