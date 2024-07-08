// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Typography, useMediaQuery } from "@mui/material";

import { useSelector } from "react-redux";
import CustomTooltip from "../../../../components/common/CustomTooltip";

const NotificationSection = () => {
  const theme = useTheme();
  const matchesXl = useMediaQuery(theme.breakpoints.up("xl"));
  const loggedInUser = useSelector((state) => state.authorization.currentUser);
  const { candidateInitialDetails } = useSelector((state) => state.candidate);

  return (
    <>
      {loggedInUser ? (
        <Box mx={2}>
          <Typography
            variant={"h6"}
            fontWeight={700}
            fontSize={matchesXl ? "12px" : "10px"}
          >
            {loggedInUser?.hrOrganization?.hrOrganizationName?.length > 25 ? (
              <CustomTooltip
                tooltipmaxwidth={400}
                title={loggedInUser?.hrOrganization?.hrOrganizationName}
              >
                <Box component="span">{`${loggedInUser?.hrOrganization?.hrOrganizationName.slice(
                  0,
                  25
                )}...`}</Box>
              </CustomTooltip>
            ) : (
              loggedInUser?.hrOrganization?.hrOrganizationName
            )}
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            fontSize={matchesXl ? "12px" : "10px"}
            sx={{ wordBreak: "break-all" }}
          >
            {loggedInUser?.userName?.length > 25 ? (
              <CustomTooltip
                tooltipmaxwidth={400}
                title={loggedInUser?.userName}
              >
                <Box component="span">{`${loggedInUser?.userName.slice(
                  0,
                  25
                )}...`}</Box>
              </CustomTooltip>
            ) : (
              loggedInUser?.userName
            )}
            &nbsp;
            <span style={{ color: theme.palette.grey[700] }}>
              {loggedInUser?.subRoleName
                ? `(${loggedInUser?.roleName} : ${loggedInUser?.subRoleName})`
                : `(${loggedInUser?.roleName}${
                    candidateInitialDetails?.caseNumber
                      ? ` : ${candidateInitialDetails?.caseNumber})`
                      : ")"
                  } `}
            </span>
          </Typography>
        </Box>
      ) : null}
    </>
  );
};

export default NotificationSection;
