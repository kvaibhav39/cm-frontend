import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { checkPagePermission } from "../utils/CheckPageAccess";
import { currentUser } from "../store/actions/authorizationAction";
import CircularLoader from "../common/CircularLoader";
import { setToastNotification } from "../store/actions/toastNotificationActions";
import { ERROR } from "../store/constant";
import { getCurrentFileNameAndFunction } from "../utils/getCurrentFileNameAndFunction";

function ProtectedRoute(props) {
  const dispatch = useDispatch();
  const location = useLocation();
  const loggedInUser = useSelector((state) => state.authorization);
  const authRef = useRef(false);
  const errorRef = useRef(false);
  const navigate = useNavigate();

  const currentLoginProfile = localStorage.getItem("loginProfile");

  let loginDetails = localStorage.getItem(`${currentLoginProfile}_login`);

  let user = useMemo(() => loggedInUser?.currentUser, [loggedInUser]);

  let isAuthenticated = useMemo(() => {
    if (loginDetails) {
      let { token } = JSON.parse(loginDetails);
      return token;
    }
    return "";
  }, [localStorage, loginDetails]);

  useEffect(() => {
    if (isAuthenticated) {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      dispatch(currentUser(logDetails));
    }
  }, []);

  useEffect(() => {
    //checking current page's permission

    // if (location.pathname !== "/hr/first-login") {
    const canAccess = checkPagePermission(
      location.pathname,
      loggedInUser.permissions
    );

    //if the user does not have the page permission then we will route them to home page

    if (!canAccess && user?.roleId) {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      //on login this msg gets displayed
      // dispatch(setToastNotification(ERROR, 'You dont have permission to access this page',logDetails));

      let homePage = "/login";

      if (user?.roleId === 4) {
        homePage = "/ops/dashboard";
      } else if (user?.roleId === 3) {
        homePage = "/candidate/profile";
      } else if (user?.roleId === 2) {
        const pages = [
          { path: "/hr/dashboard" },
          { path: "/hr/candidates" },
          { path: "/hr/packages" },
          { path: "/hr/questionnaire" },
          { path: "/hr/settings/company-branding" },
        ];

        const isFirstTimeLogin =
          (user?.roleName == "HR" &&
            !user?.hrOrganization &&
            user?.hrTeams?.length === 0) ||
          (user?.roleName == "HR" && (!user?.userName || !user?.phoneNumber));

        if (isFirstTimeLogin) {
          homePage = "/hr/first-login";
        } else {
          homePage = "/not-found";
          for (const page of pages) {
            if (checkPagePermission(page.path, loggedInUser.permissions)) {
              homePage = page.path;
              break;
            }
          }
        }
      } else if (user?.roleId === 1) {
        homePage = "/system-admin/home";
      }

      navigate(homePage);
    }
    // }
  }, [location.pathname, user, loggedInUser?.permissions]);

  const isFirstTimeLogin =
    (user?.roleName == "HR" &&
      !user?.hrOrganization &&
      user?.hrTeams?.length === 0) ||
    (user?.roleName == "HR" && (!user?.userName || !user?.phoneNumber));

  if (!isAuthenticated && !authRef?.current) {
    authRef.current = true;
    return <Navigate to="/login" />;
  }

  if (isAuthenticated && !errorRef?.current && loggedInUser.error) {
    errorRef.current = true;
    return <Navigate to="/network-error" />;
  }
  if (isAuthenticated && isFirstTimeLogin && !authRef?.current) {
    authRef.current = true;
    return <Navigate to="/hr/first-login" />;
  }

  if (!loggedInUser?.permissions?.userId && !errorRef.current) {
    return <CircularLoader />;
  }

  // const canAccess = checkPagePermission(
  //   location.pathname,
  //   loggedInUser.permissions
  // );

  // if (
  //   !canAccess &&
  //   loggedInUser.loggedIn &&
  //   location.pathname !== "/not-found" &&
  //   !authRef?.current &&
  //   user
  // ) {
  //   authRef.current = true;
  //   console.log("00000-4");

  //   return (
  //     <Navigate
  //       to={
  //         user?.roleId === 4
  //           ? "/ops/dashboard"
  //           : user?.roleId === 3
  //           ? "/candidate/profile"
  //           : user?.roleId === 2
  //           ? "/hr/dashboard"
  //           : user?.roleId === 1
  //           ? "/system-admin/home"
  //           : "/login"
  //       }
  //     />
  //   );
  // } else {
  //   return props.children;
  // }
  return props.children;
}

export default ProtectedRoute;
