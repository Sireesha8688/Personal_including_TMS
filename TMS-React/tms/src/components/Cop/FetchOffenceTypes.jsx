// src/components/Cop/FetchOffenceTypes.jsx
import React, { useEffect, useState } from "react";
import {
  Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, CircularProgress
} from "@mui/material";
import axios from "axios";

export default function FetchOffenceTypes() {
  const [offenceTypes, setOffenceTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:7777/cop/offence-types")
      .then(res => setOffenceTypes(res.data))
      .catch(() => setOffenceTypes([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Paper sx={{ p: 2, width: 600 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#1976d2", fontWeight: 600 }}>
          Offence Types
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
                  <TableCell>Offence ID</TableCell>
                  <TableCell>Offence Type</TableCell>
                  <TableCell>Penalty</TableCell>
                  <TableCell>Vehicle Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {offenceTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ color: "text.secondary" }}>
                      No offence types found.
                    </TableCell>
                  </TableRow>
                ) : (
                  offenceTypes.map((offence) => (
                    <TableRow key={offence.offenceId}>
                      <TableCell>{offence.offenceId}</TableCell>
                      <TableCell>{offence.offenceType}</TableCell>
                      <TableCell>{offence.penalty}</TableCell>
                      <TableCell>{offence.vehType}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
