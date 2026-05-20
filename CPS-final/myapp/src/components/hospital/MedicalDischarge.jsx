import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const MedicalDischarge = () => {
  const theme = useTheme();

  const [patientId, setPatientId] = useState("");
  const [patient, setPatient] = useState(null);
  const [preauth, setPreauth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const summaryRef = useRef();

  const handlePatientIdChange = (e) => {
    setPatientId(e.target.value);
  };

  const fetchDetails = async () => {
    if (!patientId.trim()) return;
    setLoading(true);
    setError(null);
    setPatient(null);
    setPreauth(null);

    try {
      const preauthsRes = await axios.get(`http://localhost:9090/preauths`);
      const matchedPreauth = preauthsRes.data.find((p) => p.id === patientId);

      if (!matchedPreauth) {
        setError("No preauthorization found for this Patient ID.");
        setLoading(false);
        return;
      }
      setPreauth(matchedPreauth);

      const patientRes = await axios.get(
        `http://localhost:9090/customers/${matchedPreauth.customerId}`
      );
      setPatient(patientRes.data);
    } catch (err) {
      setError("Failed to fetch patient or preauthorization details.");
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = () => {
    if (!patient || !preauth) return "";
    return `Patient ${patient.name} (Aadhaar: ${patient.aadharcardNumber}) was treated for "${preauth.treatment}" on ${preauth.date}. The total cost was ₹${preauth.cost.toLocaleString()}. The patient received excellent support during the treatment and has been medically discharged successfully.`;
  };

  const downloadPdf = async () => {
    if (!summaryRef.current) return;

    try {
      const element = summaryRef.current;
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Discharge_Summary_${patientId}.pdf`);
    } catch (err) {
      setError("Failed to generate PDF.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Medical Discharge Summary
      </Typography>

      <TextField
        label="Enter Patient ID"
        value={patientId}
        onChange={handlePatientIdChange}
        fullWidth
        sx={{ mb: 2 }}
        disabled={loading}
      />
      <Button
        variant="contained"
        onClick={fetchDetails}
        disabled={!patientId.trim() || loading}
        sx={{ mb: 3 }}
      >
        {loading ? <CircularProgress size={24} /> : "Fetch Details"}
      </Button>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {patient && preauth && (
        <Paper
          ref={summaryRef}
          elevation={4}
          sx={{
            p: 3,
            bgcolor:
              theme.palette.mode === "dark"
                ? "#424242"
                : "background.paper",
            color:
              theme.palette.mode === "dark"
                ? "#fff"
                : "text.primary",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Patient Information
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary={`Name: ${patient.name}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Aadhaar: ${patient.aadharcardNumber}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary={`Email: ${patient.email}`} />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Discharge Summary
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor:
                theme.palette.mode === "dark"
                  ? "#616161"
                  : "#f5f5f5",
              color:
                theme.palette.mode === "dark"
                  ? "#fff"
                  : "text.primary",
            }}
          >
            <Typography>{generateSummary()}</Typography>
          </Paper>

          <Box sx={{ mt: 3 }}>
            <Button variant="contained" onClick={downloadPdf}>
              Download PDF
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default MedicalDischarge;
