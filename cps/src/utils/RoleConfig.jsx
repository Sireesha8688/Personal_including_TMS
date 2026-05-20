// RoleConfig.jsx

import Dashboard from "../components/admin/Dashboard";
import ManageAdmins from "../components/admin/ManageAdmins";
import ManageCovers from "../components/admin/ManageCovers";
import ManageInsurers from "../components/admin/ManageInsurers";
import ManageVerifiers from "../components/admin/ManageVerifiers";
import ManagePolicies from "../components/admin/ManagePolicies";
import ManageClaimTypes from "../components/admin/ManageClaimTypes";
import VerifierDashboard from "../components/verifier/VerifierDashboard";
import ChangeAvailability from "../components/verifier/ChangeAvailability";
import VerifierClaims from "../components/verifier/VerifierClaims";
import VerifierClaimReimbursements from "../components/verifier/VerifierClaimReimbursements";
import InsurerDashboard from "../components/insurer/InsurerDashboard";
import InsurerPreAuthClaims from "../components/insurer/InsurerPreAuthClaims";
import InsurerClaimsAdjudication from "../components/insurer/InsurerClaimsAdjudication";
import InsurerManageCustomers from "../components/insurer/InsurerManageCustomers";
import InsurerManageHospitals from "../components/insurer/InsurerManageHospitals";
import CustomerDashboard from "../components/customer/CustomerDashboard";
import CustomerRaiseImbursementClaim from "../components/customer/CustomerRaiseImbursementClaim";
import CustomerTrackClaimStatus from "../components/customer/CustomerTrackClaimStatus";
import HospitalDashboard from "../components/hospital/HospitalDashboard";
import HospitalClaimTracker from "../components/hospital/HospitalClaimTracker";
import HospitalAdmissionForm from "../components/hospital/HospitalAdmissionForm";
import HospitalDischargeClaimSubmission from "../components/hospital/HospitalDischargeClaimSubmission";
import HospitalPreAuthForm from "../components/hospital/HospitalPreAuthForm";

// Material UI Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CategoryIcon from "@mui/icons-material/Category";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BarChartIcon from "@mui/icons-material/BarChart";
import LocalHotelIcon from "@mui/icons-material/LocalHotel";
import ApprovalIcon from "@mui/icons-material/Approval";
import ListAltIcon from "@mui/icons-material/ListAlt";

const RoleConfig = {
  Admin: {
    navigation: [
      { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
      { segment: "insurers", title: "Insurers", icon: <BusinessIcon /> },
      { segment: "verifiers", title: "Verifiers", icon: <VerifiedUserIcon /> },
      { segment: "covers", title: "Covers", icon: <ShoppingCartIcon /> },
      { segment: "admins", title: "Admins", icon: <SupervisorAccountIcon /> },
      { segment: "policies", title: "Policies", icon: <AssignmentIcon /> },
      { segment: "ClaimTypes", title: "Claim Types", icon: <CategoryIcon /> },
    ],
    routes: {
      dashboard: Dashboard,
      insurers: ManageInsurers,
      verifiers: ManageVerifiers,
      covers: ManageCovers,
      admins: ManageAdmins,
      policies: ManagePolicies,
      ClaimTypes: ManageClaimTypes,
    },
  },
  Verifier: {
    navigation: [
      { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
      {
        segment: "VerifierClaimReimbursements",
        title: "Verifier ReimbursementsClaims",
        icon: <ReceiptLongIcon />,
      },
      {
        segment: "VerifierClaims",
        title: "Verifier HospitalClaims",
        icon: <LocalHospitalIcon />,
      },
      {
        segment: "changeAvailability",
        title: "Change Availability",
        icon: <EventAvailableIcon />,
      },
    ],
    routes: {
      dashboard: VerifierDashboard,
      VerifierClaims: VerifierClaims,
      VerifierClaimReimbursements: VerifierClaimReimbursements,
      changeAvailability: ChangeAvailability,
    },
  },
  Insurer: {
    navigation: [
      { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
      {
        segment: "pre_auth_claims",
        title: "Pre-Auth Claims",
        icon: <DashboardIcon />,
      },

      {
        segment: "claimsAdjudication",
        title: "Claims Adjudication",
        icon: <BarChartIcon />,
      },
      {
        segment: "manageCustomers",
        title: "Manage Customers",
        icon: <BarChartIcon />,
        pattern: "manageCustomers{/:customerId}*",
      },
      {
        segment: "manageHospitals",
        title: "Manage Hospitals",
        icon: <ShoppingCartIcon />,
      },
    ],
    routes: {
      dashboard: InsurerDashboard,
      pre_auth_claims: InsurerPreAuthClaims,
      claimsAdjudication: InsurerClaimsAdjudication,
      manageCustomers: InsurerManageCustomers,
      manageHospitals: InsurerManageHospitals,
    },
  },
  Customer: {
    navigation: [
      { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
      { segment: "raiseclaim", title: "Raise Claim", icon: <BarChartIcon /> },
      {
        segment: "track_claim_status",
        title: "Track Claim Status",
        icon: <BarChartIcon />,
      },
    ],
    routes: {
      dashboard: CustomerDashboard,
      raiseclaim: CustomerRaiseImbursementClaim,
      track_claim_status: CustomerTrackClaimStatus,
    },
  },
  Hospital: {
    navigation: [
      { segment: "dashboard", title: "Dashboard", icon: <DashboardIcon /> },
      {
        segment: "pre_auth",
        title: "Pre-Authorization",
        icon: <ApprovalIcon />,
      },
      {
        segment: "customer_admission",
        title: "Customer Admission",
        icon: <LocalHotelIcon />,
      },
      {
        segment: "discharge_raise_claim",
        title: "Discharge & Raise Claim",
        icon: <ReceiptLongIcon />,
      },
      {
        segment: "claim_tracker",
        title: "Track Claim",
        icon: <ListAltIcon />,
      },
    ],
    routes: {
      dashboard: HospitalDashboard,
      pre_auth: HospitalPreAuthForm,
      customer_admission: HospitalAdmissionForm,
      discharge_raise_claim: HospitalDischargeClaimSubmission,
      claim_tracker: HospitalClaimTracker,
    },
  },
};

export default RoleConfig;
