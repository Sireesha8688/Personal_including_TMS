import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import axios from 'axios';

export default function ListOffenceTypes() {
  const [offences, setOffences] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:7777/rto/offence-types")
      .then(res => setOffences(res.data));
  }, []);

  return (
    <Box sx={{ mt: 5, maxWidth: 900, mx: 'auto' }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>All Offence Types</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Offence Type</TableCell>
              <TableCell>Penalty</TableCell>
              <TableCell>Vehicle Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {offences.map(offence => (
              <TableRow key={offence.offenceId}>
                <TableCell>{offence.offenceId}</TableCell>
                <TableCell>{offence.offenceType}</TableCell>
                <TableCell>{offence.penalty}</TableCell>
                <TableCell>{offence.vehType}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
