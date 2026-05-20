import React, { useEffect, useState } from "react";
import {
  Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, CircularProgress, Dialog, DialogContent, IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

export default function FetchUnclearedOffence() {
  const [offences, setOffences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    // Fetch all offences, filter for uncleared (status not 'cleared')
    axios.get("http://localhost:7777/api/offence-details")
      .then(res => {
        const uncleared = res.data.filter(
          o => o.offenceStatus && o.offenceStatus.toLowerCase() !== "cleared"
        );
        setOffences(uncleared);
      })
      .catch(() => setOffences([]))
      .finally(() => setLoading(false));
  }, []);

  // Helper to guess image type
  const getImageType = (base64) => {
    if (!base64) return "jpeg";
    if (base64.startsWith("iVBORw0KGgo")) return "png";
    return "jpeg";
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Paper sx={{ p: 2, width: 900 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#1976d2", fontWeight: 600 }}>
          Uncleared Offence Details
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Vehicle No</TableCell>
                  <TableCell>Offence Type</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Place</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Image</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {offences.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ color: "text.secondary" }}>
                      No uncleared offences found.
                    </TableCell>
                  </TableRow>
                ) : (
                  offences.map((offence) => (
                    <TableRow key={offence.offenceDetailId}>
                      <TableCell>{offence.offenceDetailId}</TableCell>
                      <TableCell>{offence.vehNo}</TableCell>
                      <TableCell>{offence.offence?.offenceType}</TableCell>
                      <TableCell>
                        {offence.time ? new Date(offence.time).toLocaleDateString() : ""}
                      </TableCell>
                      <TableCell>{offence.place}</TableCell>
                      <TableCell>{offence.offenceStatus}</TableCell>
                      <TableCell>
                        {offence.image ? (
                          <img
                            src={`data:image/${getImageType(offence.image)};base64,${offence.image}`}
                            alt="Offence"
                            style={{ maxWidth: 60, maxHeight: 45, borderRadius: 4, border: "1px solid #ccc", cursor: "pointer" }}
                            onClick={() => setModalImage(offence.image)}
                            title="Click to enlarge"
                          />
                        ) : (
                          <span style={{ color: "#888", fontSize: 12 }}>No Image</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Image Modal */}
        <Dialog open={!!modalImage} onClose={() => setModalImage(null)} maxWidth="md">
          <DialogContent sx={{ position: "relative", p: 0, bgcolor: "#111" }}>
            <IconButton
              onClick={() => setModalImage(null)}
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
