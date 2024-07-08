import { lazy } from "react";

// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "common/Loadable";
import ProtectedRoute from "./ProtectedRoute";
import Packages from "../components/Packages";
import CreateCustomPackage from "../components/Packages/CustomPackages/CreateCustomPackage";
import { CandidatesPage } from "../components/Candidates";
import CreateCandidate from "../components/Candidates/CreateCandidate/index";
import ThankYouScreen from "../components/Candidate/ThankYouScreen";
import HrNotification from "../components/HR/HrNotification";
import CompanyBranding from "../components/HR/CompanyBranding";
import ManageTeams from "../components/HR/ManageTeams.jsx";
import Questionnaire from "../components/Questionnaire/QuestionnaireTable/index";
import CreateQuestionnaire from "../components/Questionnaire/CreateQuestionnaire/index";
import PageNotFound from "../common/PageNotFound";
import { CandidateProfileRoutes } from "../components/Candidate";
import ViewCandidateInHR from "../common/ViewCandidateInHR";
import PageNetworkError from "../common/PageNetworkError";
import SystemAdminHome from "../components/SystemAdmin/Home";
import AddInternalUsers from "../components/SystemAdmin/SystemSettings/AddInternalUsers";
import ClientSettingsCustomFields from "../components/SystemAdmin/ClientSettings/CustomFields.jsx";
import ClientSettingsCustomEmails from "../components/SystemAdmin/ClientSettings/CustomEmails.jsx";
import ClientSettingsCustomConsentForm from "../components/SystemAdmin/ClientSettings/CustomConsentForm.jsx";
import OtherSettings from "../components/SystemAdmin/ClientSettings/OtherSettings.jsx";
import ClientSettingsLayout from "../components/SystemAdmin/common/ClientSettingsLayout";
import { Outlet } from "react-router-dom";
import { SystemSettingsLayout } from "../components/SystemAdmin/common/SystemSettingsLayout";
import UpdateCheckPrices from "../components/SystemAdmin/ClientSettings/UpdateCheckPrices";
import ResearchCountries from "../components/SystemAdmin/ClientSettings/ResearchCountries";
import UpdateRelationships from "../components/SystemAdmin/ClientSettings/UpdateRelationships.jsx";
import OperationsDashboard from "../components/Operations/OperationsDashboard";
import OperationsCandidates from "../components/Operations/OperationsCandidates";
import OperationsCaseManagement from "../components/Operations/OperationsCandidates/OperationsCaseManagement";
import OperationsTemp from "../components/Operations/OperationsDashboard/OperationsTemp";
import OperationsDashboardLayout from "../components/Operations/OperationsDashboard/Layout/OperationsDashboardLayout";
import OperationsSettingsLayout from "../components/Operations/OperationsSettings/Layout/OperationsSettingsLayout";
import OperationsSettings from "../components/Operations/OperationsSettings";
import OperationsSettingsUsers from "../components/Operations/OperationsSettings/OperationsSettingsUsers";
import QueryOperations from "./../components/QueryOperations/index";
import AdditionalEmailSettings from "../components/SystemAdmin/ClientSettings/AdditionalEmailSettings.jsx";

import EmailProviderSetting from "../components/SystemAdmin/SystemSettings/EmailProviderSetting";
import OperationsCreateOrganization from "../components/Operations/OperationsSettings/OperationsCreateOrganization/index.jsx";
import AdditionalCheckSettings from "../components/SystemAdmin/ClientSettings/AdditionalCheckSettings.jsx";
import RemovePermissions from './../components/SystemAdmin/ClientSettings/RemovePermissions';

// sample page routing
const Dashboard = Loadable(lazy(() => import("components/Dashboard")));
const FirstLogin = Loadable(
  lazy(() => import("../components/Authentication/FirstLogin"))
);


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    CandidateProfileRoutes,
    {
      path: "/hr/first-login",
      element: <FirstLogin />,
    },
    {
      path: "/hr/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/hr/packages",
      element: <Packages />,
    },
    {
      path: "/hr/packages/create",
      element: <CreateCustomPackage />,
    },
    {
      path: "/hr/packages/clone/:packageId", //clone
      element: <CreateCustomPackage />,
    },
    {
      path: "/hr/packages/edit/:packageId", //edit
      element: <CreateCustomPackage />,
    },
    {
      path: "/hr/packages/view/:packageId", //view
      element: <CreateCustomPackage />,
    },
    {
      path: "/candidate/thank-you",
      element: <ThankYouScreen />,
    },
    {
      path: "/hr/questionnaire",
      element: <Questionnaire />,
    },
    {
      path: "/hr/questionnaire/create",
      element: <CreateQuestionnaire />,
    },
    {
      path: "/hr/questionnaire/clone/:questionnaireId", //clone
      element: <CreateQuestionnaire />,
    },
    {
      path: "/hr/questionnaire/view/:questionnaireId", //view
      element: <CreateQuestionnaire />,
    },
    {
      path: "/hr/questionnaire/edit/:questionnaireId", //edit
      element: <CreateQuestionnaire />,
    },
    {
      path: "/hr/settings/manage-notifications",
      element: <HrNotification />,
    },
    { path: "/hr/settings/company-branding", element: <CompanyBranding /> },
    { path: "/hr/settings/manage-teams", element: <ManageTeams /> },
    {
      path: "/hr/candidates",
      element: <CandidatesPage />,
    },
    {
      path: "/hr/candidates/create",
      element: <CreateCandidate />,
    },
    {
      path: "/hr/candidates/edit",
      element: <CreateCandidate />,
    },
    {
      path: "/hr/candidates/thank-you",
      element: <CandidatesPage />,
    },
    {
      path: "/hr/candidates/view/:candidatesCasesId",
      element: <ViewCandidateInHR />,
    },
    {
      path: "/not-found",
      element: <PageNotFound />,
    },
    {
      path: "/network-error",
      element: <PageNetworkError />,
    },
    {
      path: "/system-admin",
      element: <Outlet />,
      children: [
        {
          path: "/system-admin/perform-query-operations",
          element: <QueryOperations />,
        },
        {
          path: "/system-admin/home",
          element: <SystemAdminHome />,
        },
        {
          path: "/system-admin/system-settings",
          element: <SystemSettingsLayout />,
          children: [
            {
              path: "/system-admin/system-settings/add-internal-users",
              element: <AddInternalUsers />,
            },
            {
              path: "/system-admin/system-settings/email-provider-settings",
              element: <EmailProviderSetting />,
            },
          ],
        },
        {
          path: "/system-admin/client-settings",
          element: <ClientSettingsLayout />,
          children: [
            {
              path: "/system-admin/client-settings/custom-fields",
              element: <ClientSettingsCustomFields />,
            },
            {
              path: "/system-admin/client-settings/custom-emails",
              element: <ClientSettingsCustomEmails />,
            },
            {
              path: "/system-admin/client-settings/custom-consent-form",
              element: <ClientSettingsCustomConsentForm />,
            },
            {
              path: "/system-admin/client-settings/org-settings",
              element: <OtherSettings />,
            },
            {
              path: "/system-admin/client-settings/update-check-prices",
              element: <UpdateCheckPrices />,
            },
            {
              path: "/system-admin/client-settings/research-countries-settings",
              element: <ResearchCountries />,
            },
            {
              path: "/system-admin/client-settings/update-relationships",
              element: <UpdateRelationships />,
            },
            {
              path: "/system-admin/client-settings/additional-email-settings",
              element: <AdditionalEmailSettings />,
            },
            {
              path: "/system-admin/client-settings/additional-check-settings",
              element: <AdditionalCheckSettings />,
            },
            {
              path: "/system-admin/client-settings/remove-permissions",
              element: <RemovePermissions />,
            },
          ],
        },
      ],
    },
    {
      path: "/ops",
      element: <Outlet />,
      children: [
        {
          path: "/ops/perform-query-operations",
          element: <QueryOperations />,
        },
        {
          path: "/ops/temp-ops-screen",
          element: <OperationsTemp />,
        },
        {
          path: "/ops/dashboard",
          element: <OperationsDashboardLayout />,
          children: [
            {
              path: "/ops/dashboard",
              element: <OperationsDashboard />,
            },
          ],
        },
        {
          path: "/ops/candidates",
          element: <Outlet />,
          children: [
            {
              path: "/ops/candidates",
              element: <OperationsCandidates />,
            },
            {
              path: "/ops/candidates/case-management",
              element: <OperationsCaseManagement />,
            },
            {
              path: "/ops/candidates/create",
              element: <CreateCandidate />,
            },
          ],
        },
        {
          path: "/ops/settings",
          element: <OperationsSettingsLayout />,
          children: [
            {
              path: "/ops/settings/general",
              element: <OperationsSettings />,
            },
            {
              path: "/ops/settings/ops-users",
              element: <OperationsSettingsUsers />,
            },
            {
              path: "/ops/settings/hr/create",
              element: <OperationsCreateOrganization />,
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ],
};

export default MainRoutes;
