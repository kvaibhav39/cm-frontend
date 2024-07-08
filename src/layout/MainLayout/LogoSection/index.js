import { useNavigate } from "react-router-dom";

// material-ui
import { ButtonBase } from "@mui/material";

// project imports
import Logo from "common/Logo";
import { useSelector } from "react-redux";
import { useEffect, useMemo } from "react";

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const { candidateInitialDetails } = useSelector((state) => state.candidate);

  const { allowProfileEdit, candidateProfileSections } =
    candidateInitialDetails;

  const currentLoginProfile = localStorage.getItem("loginProfile");

  const navigate = useNavigate();

  let navigateTo = "/candidate/profile";

  if (localStorage.getItem(`${currentLoginProfile}_login`)) {
    let { CheckMinistryUser } = JSON.parse(
      localStorage.getItem(`${currentLoginProfile}_login`)
    );

    let loggedInUser = JSON.parse(CheckMinistryUser);

    //logic to determine route on which we will redirect the user on click of the home logo
    if (loggedInUser?.roleId === 1) {
      navigateTo = "/system-admin/home";
    } else if (loggedInUser?.roleId === 2) {
      navigateTo = "/hr/dashboard";
    } else if (loggedInUser?.roleId === 4) {
      navigateTo = "/ops/dashboard";
    } else if (loggedInUser?.roleId === 3) {
      if (allowProfileEdit === false) {
        let sectionOnHold = candidateProfileSections?.find(
          (section) => section.onHold
        );

        if (sectionOnHold) {
          navigateTo = sectionOnHold.sectionPath;
        } else {
          navigateTo = "/candidate/profile/post-submit";
        }
      }
    }
  }

  return (
    <ButtonBase disableRipple onClick={() => navigate(navigateTo)}>
      <Logo />
    </ButtonBase>
  );
};

export default LogoSection;
