import React, { useState } from "react";
import {
  Typography, Paper, TextField, Button, Box, Snackbar, Alert, Slide,
  Card, CardContent, CardActions, IconButton, Collapse, Stack, Dialog, DialogContent
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

// Helper to guess image type (PNG/JPEG) based on base64
const getImageType = (base64) => {
  if (!base64) return "jpeg";
  if (base64.startsWith("iVBORw0KGgo")) return "png";
  return "jpeg";
};

export default function ClearOffence() {
  const [vehicleNo, setVehicleNo] = useState("");
  const [offences, setOffences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, type: "success", text: "" });
  const [expandedId, setExpandedId] = useState(null); // Track which card is expanded

  // For image modal
  const [openImage, setOpenImage] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  const fetchOffences = async () => {
    if (!vehicleNo.trim()) {
      setSnackbar({ open: true, type: "error", text: "Please enter a vehicle number." });
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:7777/api/offence-details/vehicle/${vehicleNo.trim()}`);
      setOffences(res.data);
      setExpandedId(null); // Collapse all on new search
      if (res.data.length === 0) {
        setSnackbar({ open: true, type: "info", text: "No offences found for this vehicle." });
      }
    } catch (err) {
      setSnackbar({ open: true, type: "error", text: "Failed to fetch offences." });
    } finally {
      setLoading(false);
    }
  };

  const clearOffence = async (offenceDetailId) => {
    try {
      await axios.post(`http://localhost:7777/cop/clear-offence/${offenceDetailId}`);
      setSnackbar({ open: true, type: "success", text: `Offence ID ${offenceDetailId} cleared.` });
      setOffences((prev) =>
        prev.map((o) =>
          o.offenceDetailId === offenceDetailId ? { ...o, offenceStatus: "cleared" } : o
        )
      );
    } catch {
      setSnackbar({ open: true, type: "error", text: "Failed to clear offence." });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Image modal handlers
  const handleImageClick = (base64Image) => {
    setModalImage(base64Image);
    setOpenImage(true);
  };
  const handleImageClose = () => {
    setOpenImage(false);
    setModalImage(null);
  };

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "calc(100vh - 64px)", p: 2, mt: 6 }}>
      <Paper sx={{ p: 2, width: 430 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#1976d2", fontWeight: 600 }}>
          Clear Offence
        </Typography>
        <TextField
          label="Vehicle Number"
          value={vehicleNo}
          onChange={e => setVehicleNo(e.target.value)}
          size="small"
          fullWidth
          sx={{ mb: 1 }}
        />
        <Button variant="contained" onClick={fetchOffences} disabled={loading} size="small" sx={{ mb: 2 }}>
          {loading ? "Fetching..." : "Fetch Offences"}
        </Button>

        <Stack spacing={2}>
          {offences.length === 0 && (
            <Typography color="text.secondary" sx={{ mt: 2, fontSize: 14 }}>
              No offences found for this vehicle.
            </Typography>
          )}
          {offences.map((offence) => (
            <Card key={offence.offenceDetailId} variant="outlined" sx={{ width: "100%" }}>
              <CardContent>
                <Typography sx={{ fontSize: 15 }}>
                  <b>ID:</b> {offence.offenceDetailId} &nbsp;
                  <b>Status:</b> {offence.offenceStatus}
                </Typography>
                <CardActions disableSpacing>
                  <IconButton
                    onClick={() => handleExpandClick(offence.offenceDetailId)}
                    aria-expanded={expandedId === offence.offenceDetailId}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon
                      sx={{
                        transform: expandedId === offence.offenceDetailId ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s"
                      }}
                    />
                  </IconButton>
                </CardActions>
                <Collapse in={expandedId === offence.offenceDetailId} timeout="auto" unmountOnExit>
                  <Box sx={{ mt: 1 }}>
                    <Typography sx={{ fontSize: 13 }}>
                      <b>Place:</b> {offence.place} <br />
                      <b>Date:</b> {offence.time ? new Date(offence.time).toLocaleString() : ""} <br />
                      <b>Type:</b> {offence.offence?.offenceType}
                    </Typography>
                    {offence.image && (
                      <Box sx={{ mt: 1 }}>
                        <img
                          src={`data:image/${getImageType(offence.image)};base64,${offence.image}`}
                          alt="Offence"
                          style={{ maxWidth: 60, maxHeight: 45, borderRadius: 4, border: "1px solid #ccc", cursor: "pointer" }}
                          onClick={() => handleImageClick(offence.image)}
                          title="Click to enlarge"
                        />
                      </Box>
                    )}
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ mt: 1, fontSize: 13, py: 0.5, px: 2 }}
                      disabled={offence.offenceStatus?.toLowerCase() === "cleared"}
                      onClick={() => clearOffence(offence.offenceDetailId)}
                    >
                      Clear
                    </Button>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          TransitionComponent={SlideTransition}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.type} sx={{ width: "100%" }}>
            {snackbar.text}
          </Alert>
        </Snackbar>

        {/* Image Modal */}
        <Dialog open={openImage} onClose={handleImageClose} maxWidth="md">
          <DialogContent sx={{ position: "relative", p: 0, bgcolor: "#111" }}>
            <IconButton
              onClick={handleImageClose}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "#fff",
                zIndex: 2,
                background: "rgba(0,0,0,0.4)"
              }}
            >
              <CloseIcon />
            </IconButton>
            {modalImage && (
              <img
                src={`data:image/${getImageType(modalImage)};base64,${modalImage}`}
                alt="Offence"
                style={{ width: "100%", maxWidth: 600, display: "block", margin: "auto", borderRadius: 8 }}
              />
            )}
          </DialogContent>
        </Dialog>
      </Paper>
    </Box>
  );
}
