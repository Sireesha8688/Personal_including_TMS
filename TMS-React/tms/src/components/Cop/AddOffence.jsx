import React, { useState, useEffect } from "react";
import {
  Typography, Paper, TextField, Button, Box, Stack, Snackbar, Alert, Slide, MenuItem
} from "@mui/material";
import axios from "axios";

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

export default function AddOffence({ user }) {
  const [vehicleNo, setVehicleNo] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [offenceTypes, setOffenceTypes] = useState([]);
  const [selectedOffenceTypeId, setSelectedOffenceTypeId] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [place, setPlace] = useState("");
  const [reportedBy] = useState(user?.username || "");
  const [offenceStatus] = useState("PENDING");
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success",
    text: "",
  });

  useEffect(() => {
    async function fetchOffenceTypes() {
      try {
        const res = await axios.get("http://localhost:7777/cop/offence-types");
        setOffenceTypes(res.data || []);
      } catch {
        setSnackbar({
          open: true,
          type: "error",
          text: "Failed to load offence types.",
        });
      }
    }
    fetchOffenceTypes();
  }, []);

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleAddOffence = async () => {
    if (!vehicleNo.trim() || !selectedOffenceTypeId || !dateTime || !place.trim()) {
      setSnackbar({
        open: true,
        type: "error",
        text: "Please fill all required fields.",
      });
      return;
    }
    setLoading(true);
    try {
      // Prepare offenceDetails object matching your entity structure
      const offenceDetails = {
        vehNo: vehicleNo.trim(),
        offenceStatus: offenceStatus,
        offence: { offenceId: selectedOffenceTypeId }, // nested offence object
        time: dateTime,
        place: place.trim(),
        reportedBy: { username: reportedBy },
      };

      const formData = new FormData();
      formData.append("offenceDetails", new Blob([JSON.stringify(offenceDetails)], { type: "application/json" }));
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await axios.post(
        "http://localhost:7777/cop/report-offence",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSnackbar({
        open: true,
        type: "success",
        text: response.data || "Offence reported successfully!",
      });

      setVehicleNo("");
      setSelectedOffenceTypeId("");
      setDateTime("");
      setPlace("");
      setImageFile(null);
    } catch (err) {
      setSnackbar({
        open: true,
        type: "error",
        text: err.response?.data || "Failed to report offence. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 64px)" }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, minWidth: 400, backgroundColor: "white" }}>
        <Typography variant="h5" sx={{ mb: 3, color: "#1976d2" }}>Add Offence</Typography>
        <Stack spacing={2}>
          <TextField label="Vehicle No" value={vehicleNo} onChange={e => setVehicleNo(e.target.value)} fullWidth required />
          <TextField
            select
            label="Offence Type"
            value={selectedOffenceTypeId}
            onChange={e => setSelectedOffenceTypeId(e.target.value)}
            fullWidth
            required
          >
            <MenuItem value=""><em>Select Offence Type</em></MenuItem>
            {offenceTypes.map(offence => (
              <MenuItem key={offence.offenceId} value={offence.offenceId}>{offence.offenceType}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Date & Time"
            type="datetime-local"
            value={dateTime}
            onChange={e => setDateTime(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField label="Place" value={place} onChange={e => setPlace(e.target.value)} fullWidth required />
          <TextField label="Reported By" value={reportedBy} fullWidth InputProps={{ readOnly: true }} />
          <TextField label="Offence Status" value={offenceStatus} fullWidth InputProps={{ readOnly: true }} />
          <Button variant="outlined" component="label" sx={{ fontWeight: "bold" }}>
            {imageFile ? imageFile.name : "Upload Image"}
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
          </Button>
          <Button variant="contained" onClick={handleAddOffence} disabled={loading} sx={{ fontWeight: "bold" }}>
            {loading ? "Adding..." : "Add Offence"}
          </Button>
        </Stack>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        TransitionComponent={SlideTransition}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.type} sx={{ width: "100%" }} elevation={6} variant="filled">
          {snackbar.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}
