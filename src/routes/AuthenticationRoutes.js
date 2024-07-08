import { lazy } from "react";

// project imports
import Loadable from "common/Loadable";
import MinimalLayout from "layout/MinimalLayout";

const AuthLogin = Loadable(
  lazy(() => import("../components/Authentication/Login"))
);
const AuthRegister = Loadable(
  lazy(() => import("../components/Authentication/Register"))
);
const AuthForgotPassword = Loadable(
  lazy(() => import("../components/Authentication/ForgotPassword"))
);
const AuthResetPassword = Loadable(
  lazy(() => import("../components/Authentication/ResetPassword"))
);

const Terms = Loadable(
  lazy(() => import("../components/T&C/TermsandConditions"))
);

const DataPrivacyPolicy = Loadable(
  lazy(() => import("../components/DataPrivacyPolicy/DataPrivacyPolicy"))
);
const Cookies = Loadable(lazy(() => import("../components/Cookies/Cookies")));

const RefreeQuestionnaire = Loadable(
  lazy(() => import("../components/Reference/RefreeQuestionnaire"))
);

const Unsubscribe = Loadable(
  lazy(() => import("../components/Unsubscribe/index"))
);

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
  path: "/",
  element: <MinimalLayout />,
  children: [
    {
      path: "/",
      element: <AuthLogin />,
    },
    {
      path: "/login",
      element: <AuthLogin />,
    },
    {
      path: "/signup",
      element: <AuthRegister />,
    },
    {
      path: "/forgot-password",
      element: <AuthForgotPassword />,
    },
    {
      path: "/reset-password",
      element: <AuthResetPassword />,
    },
    {
      path: "/terms-and-conditions",
      element: <Terms />,
    },
    {
      path: "/data-privacy-policy",
      element: <DataPrivacyPolicy />,
    },
    {
      path: "/cookies",
      element: <Cookies />,
    },
    {
      path: "/refree/questionnaire",
      element: <RefreeQuestionnaire />,
    },
    {
      path: "/unsubscribe",
      element: <Unsubscribe />,
    },
  ],
};

export default AuthenticationRoutes;
