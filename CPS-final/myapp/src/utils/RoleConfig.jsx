import Dashboard from "../components/admin/Dashboard";
import ManageCovers from "../components/admin/ManageCovers";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";

const RoleConfig = {
  Admin: {
    navigation: [
      { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
      { segment: "insurers", title: "Insurers", icon: <BarChartIcon /> },
      { segment: "verfiers", title: "Verifiers", icon: <BarChartIcon /> },
      { segment: "covers", title: "Covers", icon: <ShoppingCartIcon /> },
      {
        segment: "claimDescriptions",
        title: "Claim Descriptions",
        icon: <BarChartIcon />,
      },
    ],
    routes: {
      dashboard: Dashboard,
      insurers: ManageCovers,
      verfiers: ManageCovers,
      covers: ManageCovers,
      claimDescriptions: () => <div>Reports Component Content</div>,
    },
  },
  Verifier: {
    navigation: [
      { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
      { segment: "insurers", title: "Insurers", icon: <BarChartIcon /> },
      { segment: "verfiers", title: "Verifiers", icon: <BarChartIcon /> },
      { segment: "covers", title: "Covers", icon: <ShoppingCartIcon /> },
      {
        segment: "claimDescriptions",
        title: "Claim Descriptions",
        icon: <BarChartIcon />,
      },
    ],
    routes: {
      dashboard: Dashboard,
      insurers: ManageCovers,
      verfiers: ManageCovers,
      covers: ManageCovers,
      claimDescriptions: () => <div>Reports Component Content</div>,
    },
  },
  Insurer: {
    navigation: [
      { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
      { segment: "insurers", title: "Insurers", icon: <BarChartIcon /> },
      { segment: "verfiers", title: "Verifiers", icon: <BarChartIcon /> },
      { segment: "covers", title: "Covers", icon: <ShoppingCartIcon /> },
      {
        segment: "claimDescriptions",
        title: "Claim Descriptions",
        icon: <BarChartIcon />,
      },
    ],
    routes: {
      dashboard: Dashboard,
      insurers: ManageCovers,
      verfiers: ManageCovers,
      covers: ManageCovers,
      claimDescriptions: () => <div>Reports Component Content</div>,
    },
  },
  Customer: {
    navigation: [
      { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
      { segment: "insurers", title: "Insurers", icon: <BarChartIcon /> },
      { segment: "verfiers", title: "Verifiers", icon: <BarChartIcon /> },
      { segment: "covers", title: "Covers", icon: <ShoppingCartIcon /> },
      {
        segment: "claimDescriptions",
        title: "Claim Descriptions",
        icon: <BarChartIcon />,
      },
    ],
    routes: {
      dashboard: Dashboard,
      insurers: ManageCovers,
      verfiers: ManageCovers,
      covers: ManageCovers,
      claimDescriptions: () => <div>Reports Component Content</div>,
    },
  },
  Hospital: {
    navigation: [
      { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
      { segment: "insurers", title: "Insurers", icon: <BarChartIcon /> },
      { segment: "verfiers", title: "Verifiers", icon: <BarChartIcon /> },
      { segment: "covers", title: "Covers", icon: <ShoppingCartIcon /> },
      {
        segment: "claimDescriptions",
        title: "Claim Descriptions",
        icon: <BarChartIcon />,
      },
    ],
    routes: {
      dashboard: Dashboard,
      insurers: ManageCovers,
      verfiers: ManageCovers,
      covers: ManageCovers,
      claimDescriptions: () => <div>Reports Component Content</div>,
    },
  },
};

export default RoleConfig;
