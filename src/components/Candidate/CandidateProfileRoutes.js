import { CandidateProfilePage } from "./index";
import { CandidateProfileLayout } from "./CandidateProfileLayout";
import { CandidatePersonalParticularsPage } from "./personal-particulars";
import { CandidateAddressPage } from "./address";
import { CandidateFamilyPage } from "./family";
import { CandidateEmploymentPage } from "./employment";
import { CandidateEducationPage } from "./education";
import { CandidateProfessionalPage } from "./professional";
import { CandidateProfileReferencesPage } from "./references";
import { CandidateIdentityPage } from "./identity";
import { CandidateDeclarationPage } from "./declaration";
import { CandidateProfileReviewPage } from "./review";
import { PostSubmit } from "./PostSubmit";
import { CandidateAdditionalInformation } from "./additional-information";

const CandidateProfileRoutes = {
  path: "/candidate/profile",
  element: <CandidateProfileLayout />,
  children: [
    {
      path: "/candidate/profile",
      element: <CandidateProfilePage />,
    },
    {
      path: "/candidate/profile/personal",
      element: <CandidatePersonalParticularsPage />,
    },
    {
      path: "/candidate/profile/address",
      element: <CandidateAddressPage />,
    },
    {
      path: "/candidate/profile/family",
      element: <CandidateFamilyPage />,
    },
    {
      path: "/candidate/profile/employment",
      element: <CandidateEmploymentPage />,
    },
    {
      path: "/candidate/profile/qualifications",
      element: <CandidateEducationPage />,
    },
    {
      path: "/candidate/profile/professional",
      element: <CandidateProfessionalPage />,
    },
    {
      path: "/candidate/profile/reference",
      element: <CandidateProfileReferencesPage />,
    },
    {
      path: "/candidate/profile/identity",
      element: <CandidateIdentityPage />,
    },
    {
      path: "/candidate/profile/declaration",
      element: <CandidateDeclarationPage />,
    },
    {
      path: "/candidate/profile/review",
      element: <CandidateProfileReviewPage />,
    },
    {
      path: "/candidate/profile/post-submit",
      element: <PostSubmit />,
    },
    {
      path: "/candidate/profile/additional-information",
      element: <CandidateAdditionalInformation />,
    },
  ],
};

export { CandidateProfileRoutes };
