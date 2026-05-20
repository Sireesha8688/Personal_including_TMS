import React, { useState } from "react";
import {
  Typography, Box, TextField, Button, Card,
  CardContent, Paper, Dialog, IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

export default function ViewOffences({ user }) {
  const [vehNo, setVehNo] = useState("");
  const [offences, setOffences] = useState([]);
  const [error, setError] = useState("");
  const [zoomImg, setZoomImg] = useState(null);

  const fetchOffences = async () => {
    setError("");
    setOffences([]);
    try {
      const res = await axios.get(`http://localhost:7777/owner/offences/${vehNo}`);
      if (!res.data || res.data.length === 0) {
        setError("No offences found for this vehicle.");
      } else {
        setOffences(res.data);
      }
    } catch {
      setError("Something went wrong while fetching.");
    }
  };

  return (
    <Box sx={{
      minHeight: "calc(100vh - 64px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      bgcolor: "#e3eafc",
      p: 2
    }}>
      <Card sx={{ maxWidth: 500, width: "100%", p: 1 }}>
        <CardContent>
          <Typography
            variant="h4"
            align="center"
            sx={{ color: "#1976d2", fontWeight: 600, mb: 2 }}
          >
            View Offences
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <TextField
              label="Enter Vehicle Number"
              value={vehNo}
              onChange={(e) => setVehNo(e.target.value.toUpperCase())}
              size="small"
              sx={{ mr: 2 }}
            />
            <Button variant="contained" onClick={fetchOffences}>
              Search
            </Button>
          </Box>
          {error && (
            <Typography sx={{ color: "red", mt: 2, textAlign: 'center' }}>{error}</Typography>
          )}

          <Box>
            {offences.map((offence, i) => (
              <Paper key={i} sx={{ p: 2, mt: 2, backgroundColor: "#f9f9f9" }}>
                <Typography><b>Offence ID:</b> {offence.offenceDetailId}</Typography>
                <Typography><b>Type:</b> {offence.offence?.offenceType}</Typography>
                <Typography><b>Status:</b> {offence.offenceStatus}</Typography>
                <Typography><b>Time:</b> {new Date(offence.time).toLocaleString()}</Typography>
                <Typography><b>Place:</b> {offence.place}</Typography>
                <Typography><b>Reported By:</b> {offence.reportedBy || "N/A"}</Typography>

                {offence.image && (
                  <Box mt={1} mb={1}>
                    <img
                      src={`data:image/jpeg;base64,${offence.image}`}
                      alt="offence"
                      style={{ maxWidth: 200, maxHeight: 120, borderRadius: 5, border: '1px solid #aaa', cursor: "pointer" }}
                      onClick={() => setZoomImg(offence.image)}
                    />
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Modal Image Zoom-In */}
      <Dialog
        open={!!zoomImg}
        onClose={() => setZoomImg(null)}
        maxWidth="md"
        PaperProps={{ sx: { backgroundColor: "#000" } }}
      >
        <IconButton
          aria-label="Close"
          onClick={() => setZoomImg(null)}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 1,
            color: "#fff",
            backgroundColor: "#333"
          }}
        >
          <CloseIcon />
        </IconButton>
        {zoomImg && (
          <img
            src={`data:image/jpeg;base64,${zoomImg}`}
            alt="Zoomed"
            style={{
              maxWidth: "90vw",
              maxHeight: "85vh",
              margin: "auto",
              display: "block",
              borderRadius: "10px"
            }}
          />
        )}
      </Dialog>
    </Box>
  );
}
