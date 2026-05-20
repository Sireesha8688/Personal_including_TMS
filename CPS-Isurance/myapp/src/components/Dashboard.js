import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Grid,
} from '@mui/material';

import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Business as BusinessIcon,
  VerifiedUser as VerifiedUserIcon,
  LocalHospital as LocalHospitalIcon,
  AssignmentInd as AssignmentIndIcon,
  Description as DescriptionIcon,
  Receipt as ReceiptIcon,
  TrackChanges as TrackChangesIcon,
  QuestionAnswer as QuestionAnswerIcon,
} from '@mui/icons-material';

import { styled, useTheme } from '@mui/material/styles';

const drawerWidth = 240;
const miniDrawerWidth = 56;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});
const closedMixin = (theme) => ({
  width: miniDrawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: '#1976d2',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open
    ? {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }
    : {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
}));

const NAV_ITEMS = [
  { key: 'dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
  { key: 'preauth', text: 'Preauth of Customers', icon: <LocalHospitalIcon /> },
  { key: 'admit', text: 'Admit Customers', icon: <AssignmentIndIcon /> },
  { key: 'medical', text: 'Medical & Discharge Summary', icon: <DescriptionIcon /> },
  { key: 'bills', text: 'Generate Bills', icon: <ReceiptIcon /> },
  { key: 'track', text: 'Track Claim Status', icon: <TrackChangesIcon /> },
  { key: 'response', text: 'Respond Claim Query', icon: <QuestionAnswerIcon /> },
];

export default function Dashboard() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [selectedNav, setSelectedNav] = useState('dashboard');

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  // Example summary data for dashboard
  const summaryData = {
    admins: 12,
    covers: 7,
    verifiers: 5,
    preauthPending: 4,
    admittedPatients: 10,
    billsGenerated: 8,
    claimsInProcess: 6,
    queriesPending: 3,
  };

  // Content components for each section (replace with your real components)
  const contentMap = {
    dashboard: (
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Number of Admins</Typography>
            <Typography variant="h4" color="primary">
              {summaryData.admins}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Number of Covers</Typography>
            <Typography variant="h4" color="primary">
              {summaryData.covers}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Number of Verifiers</Typography>
            <Typography variant="h4" color="primary">
              {summaryData.verifiers}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    ),
    preauth: (
      <Typography variant="h5" sx={{ mt: 4, color: 'primary.main' }}>
        Preauth of Customers (Pending: {summaryData.preauthPending})
      </Typography>
    ),
    admit: (
      <Typography variant="h5" sx={{ mt: 4, color: 'primary.main' }}>
        Admit Customers (Currently Admitted: {summaryData.admittedPatients})
      </Typography>
    ),
    medical: (
      <Typography variant="h5" sx={{ mt: 4, color: 'primary.main' }}>
        Medical & Discharge Summary
      </Typography>
    ),
    bills: (
      <Typography variant="h5" sx={{ mt: 4, color: 'primary.main' }}>
        Generate Bills (Bills Generated: {summaryData.billsGenerated})
      </Typography>
    ),
    track: (
      <Typography variant="h5" sx={{ mt: 4, color: 'primary.main' }}>
        Track Claim Status (Claims in Process: {summaryData.claimsInProcess})
      </Typography>
    ),
    response: (
      <Typography variant="h5" sx={{ mt: 4, color: 'primary.main' }}>
        Respond Claim Query (Queries Pending: {summaryData.queriesPending})
      </Typography>
    ),
  };

  const content = contentMap[selectedNav] || contentMap.dashboard;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f0f2f5' }}>
      <CssBaseline />
      <StyledAppBar position="fixed" open={open}>
        <Toolbar>
          {!open ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              aria-label="close drawer"
              onClick={handleDrawerClose}
              edge="start"
              sx={{ mr: 2 }}
            >
              <ChevronLeftIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            Hospital Claim Processing System
          </Typography>
        </Toolbar>
      </StyledAppBar>
      <StyledDrawer variant="permanent" open={open}>
        <DrawerHeader />
        <Divider />
        <List>
          {NAV_ITEMS.map(({ key, text, icon }) => (
            <ListItem key={key} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                selected={selectedNav === key}
                onClick={() => setSelectedNav(key)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </StyledDrawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: '64px',
          width: `calc(100% - ${open ? drawerWidth : miniDrawerWidth}px)`,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
          overflow: 'auto',
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 3,
          minHeight: 'calc(100vh - 64px - 48px)',
        }}
      >
        <DrawerHeader />
        {content}
      </Box>
    </Box>
  );
}
