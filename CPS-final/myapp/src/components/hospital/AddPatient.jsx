import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Card,
  CardContent,
  Collapse,
  useTheme,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp, Warning } from "@mui/icons-material";
import axios from "axios";

const AddPatient = ({ preauths, setPreauths, loggedInHospitalId }) => {
  const theme = useTheme();
  const [expandedId, setExpandedId] = useState(null);
  const [dateOfAdmission, setDateOfAdmission] = useState("");
  const [admissionNotes, setAdmissionNotes] = useState("");
  const [error, setError] = useState("");
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [emergencyData, setEmergencyData] = useState({
    aadhaar: "",
    treatment: "",
    cost: "",
    date: "",
    notes: "",
  });

  const handleEmergencyChange = (e) => {
    const { name, value } = e.target;
    setEmergencyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Emergency admission: fetch customerId using Aadhaar
  const handleEmergencyAdmit = async () => {
    const { aadhaar, treatment, cost, date, notes } = emergencyData;
    if (!aadhaar || !treatment || !cost || !date) {
      setError("Please fill all required emergency fields.");
      return;
    }
    try {
      const customerRes = await axios.get(
        `http://localhost:9090/customers?aadharcardNumber=${aadhaar}`
      );
      if (!customerRes.data.length) {
        setError("No customer found with this Aadhaar number.");
        return;
      }
      const customer = customerRes.data[0];

      const newEmergencyPreauth = {
        aadhaarNumber: aadhaar,
        customerId: customer.id,
        policyIds: customer.policies?.map((p) => p.policyId) || [],
        treatment,
        cost: Number(cost),
        date,
        hospitalId: loggedInHospitalId, // <-- use actual hospital id
        status: "emergency",
        admissionDetails: {
          isAdmitted: true,
          dateOfAdmission: date,
          admissionNotes: notes || "Emergency admission",
        },
        documents: [],
      };

      const res = await axios.post("http://localhost:9090/preauths", newEmergencyPreauth);
      setPreauths((prev) => [res.data, ...prev]);
      setEmergencyData({
        aadhaar: "",
        treatment: "",
        cost: "",
        date: "",
        notes: "",
      });
      setShowEmergencyForm(false);
      setError("");
    } catch (err) {
      setError(err.message || "Error creating emergency admission");
    }
  };

  const handleAdmit = async (preauthId) => {
    if (!expandedId) {
      setError("Please select a patient to admit.");
      return;
    }
    if (!dateOfAdmission) {
      setError("Please select date of admission.");
      return;
    }
    const selectedPreauth = preauths.find((p) => p.id === preauthId);
    if (!selectedPreauth) {
      setError("Selected patient not found.");
      return;
    }
    const updatedPreauth = {
      ...selectedPreauth,
      hospitalId: selectedPreauth.hospitalId || loggedInHospitalId, // <-- ensure hospitalId is set
      admissionDetails: {
        isAdmitted: true,
        dateOfAdmission,
        admissionNotes,
      },
      status: "admitted",
    };
    try {
      const res = await axios.put(
        `http://localhost:9090/preauths/${preauthId}`,
        updatedPreauth
      );
      setPreauths((prev) => prev.map((p) => (p.id === res.data.id ? res.data : p)));
      setExpandedId(null);
      setDateOfAdmission("");
      setAdmissionNotes("");
      setError("");
    } catch (err) {
      setError(err.message || "Error updating admission");
    }
  };

  // Filter to show only patients with status "approved"
  const approvedPendingAdmissions = preauths.filter(
    (p) => p.status === "approved"
  );

  const emergencyFormPaperStyle = {
    p: 3,
    mt: 2,
    bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[800] : "#fff8e1",
    color: theme.palette.mode === "dark" ? theme.palette.common.white : "inherit",
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Admit Patients
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          onClick={() => setShowEmergencyForm(!showEmergencyForm)}
          endIcon={showEmergencyForm ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          startIcon={<Warning />}
        >
          Emergency Admission
        </Button>
        <Collapse in={showEmergencyForm}>
          <Paper sx={emergencyFormPaperStyle}>
            <Typography variant="h6" gutterBottom>
              Emergency Admission Form
            </Typography>
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <TextField
              label="Aadhaar Number"
              name="aadhaar"
              value={emergencyData.aadhaar}
              onChange={handleEmergencyChange}
              inputProps={{ maxLength: 12 }}
              fullWidth
              required
              sx={{ mb: 2 }}
            />

            <TextField
              label="Treatment Details"
              name="treatment"
              value={emergencyData.treatment}
              onChange={handleEmergencyChange}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <TextField
              label="Estimated Cost"
              name="cost"
              value={emergencyData.cost}
              onChange={handleEmergencyChange}
              fullWidth
              required
              sx={{ mb: 2 }}
              type="number"
            />
            <TextField
              label="Date of Treatment"
              type="date"
              name="date"
              value={emergencyData.date}
              onChange={handleEmergencyChange}
              fullWidth
              required
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Admission Notes"
              name="notes"
              value={emergencyData.notes}
              onChange={handleEmergencyChange}
              fullWidth
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="warning"
              onClick={handleEmergencyAdmit}
              sx={{ mr: 2 }}
            >
              Admit Emergency Patient
            </Button>
            <Button variant="outlined" onClick={() => setShowEmergencyForm(false)}>
              Cancel
            </Button>
          </Paper>
        </Collapse>
      </Box>

      <Typography variant="h6" gutterBottom>
        Approved Patients
      </Typography>

      {approvedPendingAdmissions.length === 0 ? (
        <Typography>No patients available for admission.</Typography>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {approvedPendingAdmissions.map((p) => {
            const isExpanded = expandedId === p.id;
            return (
              <Card
                key={p.id}
                sx={{
                  width: 320,
                  cursor: "pointer",
                  border: isExpanded ? "2px solid #1976d2" : "1px solid #ccc",
                  position: "relative",
                }}
                onClick={() => {
                  setError("");
                  if (isExpanded) {
                    setExpandedId(null);
                    setDateOfAdmission("");
                    setAdmissionNotes("");
                  } else {
                    setExpandedId(p.id);
                    setDateOfAdmission("");
                    setAdmissionNotes("");
                  }
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Patient ID: {p.id}
                  </Typography>
                  <Typography>Customer ID: {p.customerId}</Typography>
                  <Typography>Treatment: {p.treatment}</Typography>
                  <Typography>Cost: ₹{p.cost}</Typography>
                  <Typography>Date: {p.date}</Typography>
                  <Typography>Status: {p.status}</Typography>
                </CardContent>

                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box
                    sx={{ p: 2, borderTop: "1px solid #ccc" }}
                    onClick={(e) => e.stopPropagation()} // Prevent collapse toggle on click inside form
                  >
                    {error && (
                      <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                      </Typography>
                    )}
                    <TextField
                      label="Date of Admission"
                      type="date"
                      value={dateOfAdmission}
                      onChange={(e) => setDateOfAdmission(e.target.value)}
                      fullWidth
                      sx={{ mb: 2 }}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Admission Notes"
                      value={admissionNotes}
                      onChange={(e) => setAdmissionNotes(e.target.value)}
                      fullWidth
                      multiline
                      rows={3}
                      sx={{ mb: 2 }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleAdmit(p.id)}
                      fullWidth
                    >
                      Admit Patient
                    </Button>
                  </Box>
                </Collapse>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default AddPatient;
