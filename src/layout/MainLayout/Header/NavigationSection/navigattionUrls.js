import DashboardIcon from "@mui/icons-material/LeaderboardOutlined";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import PackageIcon from "@mui/icons-material/LibraryBooksOutlined";
import CandidateIcon from "@mui/icons-material/PersonOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AnalyticsIcon from '@mui/icons-material/Analytics';
export const hrUrls = [
  {
    id: "HR-DASHBOARD",
    title: "Dashboard",
    icon: <DashboardIcon />,
    url: "/hr/dashboard",
  },
  {
    id: "HR-CANDIDATES",
    title: "Candidates",
    icon: <CandidateIcon />,
    url: "/hr/candidates",
  },
  {
    id: "HR-PACKAGES",
    title: "Packages",
    icon: <PackageIcon />,
    url: "/hr/packages",
  },

  {
    id: "HR-QUESTIONNAIRES",
    title: "Questionnaire",
    icon: <NoteAltIcon />,
    url: "/hr/questionnaire",
  },
  {
    id: "HR-SETTINGS",
    title: "Settings",
    icon: <SettingsIcon />,
    url:'/hr/settings',
    routeToUrl: "/hr/settings/company-branding",
  },
  {
    id: "CANDIDATE-PROFILE",
    title: "Home",
    icon: <HomeIcon />,
    url: "/candidate/profile",
  },
];

export const systemAdminUrls = [
  {
    id: "SYSTEM-ADMIN-HOME",
    title: "Home",
    icon: <DashboardIcon />,
    url: "/system-admin/home",
  },
  {
    id: "SYSTEM-ADMIN-SYSTEM-SETTINGS",
    title: "System Settings",
    icon: <SettingsIcon />,
    url: "/system-admin/system-settings",
    routeToUrl: "/system-admin/system-settings/add-internal-users",
  },
  {
    id: "SYSTEM-ADMIN-CLIENT-SETTINGS",
    title: "Client Settings",
    icon: <ManageAccountsIcon />,
    url: "/system-admin/client-settings",
    routeToUrl: "/system-admin/client-settings/custom-fields",
  },
  {
    id: "QUERY-OPERATION",
    title: "Query Operations",
    icon: <AnalyticsIcon />,
    url: "/system-admin/perform-query-operations",
  },
];

export const OPSurls = [
  {
    id: "OPS-TEMP-REPORT-UPLOAD",
    title: "Temp",
    icon: <DashboardIcon />,
    url: "/ops/temp-ops-screen",
  },
  {
    id: "OPS-DASHBOARD",
    title: "Dashboard",
    icon: <DashboardIcon />,
    url: "/ops/dashboard",
  },
  {
    id: "OPS-CANDIDATES",
    title: "Candidates",
    icon: <CandidateIcon />,
    url: "/ops/candidates",
  },
  {
    id: "OPS-SETTINGS",
    title: "Settings",
    icon: <ManageAccountsIcon />,
    url: "/ops/settings/general",
  },
  {
    id: "QUERY-OPERATION",
    title: "Query Operations",
    icon: <AnalyticsIcon />,
    url: "/ops/perform-query-operations",
  },
];
