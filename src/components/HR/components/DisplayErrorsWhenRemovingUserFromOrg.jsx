import { Box, Grid, IconButton, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  InfoOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import CustomTooltip from "../../common/CustomTooltip";

const DisplayErrorsWhenRemovingUserFromOrg = () => {
  const [open, setOpen] = useState(true);
  const { organizationUsers, errorsDataWhenRemovingUserFromOrg } = useSelector(
    (state) => state?.hr
  );

  let { userName, loginEmail } = useMemo(() => {
    let userName = null;
    let loginEmail = null;

    if (organizationUsers && errorsDataWhenRemovingUserFromOrg) {
      let result = organizationUsers?.hrOrganizationUsers?.find(
        (curr) => curr?.usersId === errorsDataWhenRemovingUserFromOrg[0]?.userId
      );

      userName = result?.userName;
      loginEmail = result?.loginEmail;
    }
    return { userName, loginEmail };
  }, [organizationUsers, errorsDataWhenRemovingUserFromOrg]);

  return (
    <>
      {userName && loginEmail && errorsDataWhenRemovingUserFromOrg ? (
        <Box pl={2} width="100%">
          <Box display="flex" alignItems="center">
            <Box mr={0.5}>
              <CustomTooltip
                title={`${errorsDataWhenRemovingUserFromOrg?.length} Error(s)`}
              >
                <InfoOutlined color="error" style={{ marginTop: "-2px" }} />
              </CustomTooltip>
            </Box>
            <Box>
              {" "}
              <Typography fontWeight={550} mb={1} variant="h4">
                Error Message(s) when trying to remove {userName} ({loginEmail})
              </Typography>
            </Box>
          </Box>

          <Grid
            container
            border={(theme) => `1px solid ${theme.palette.grey[400]}`}
            borderRadius="3px"
            mt={1}
          >
            <Grid
              p={1}
              item
              xs={12}
              display="flex"
              alignItems="center"
              gap="10px"
              onClick={() => setOpen(!open)}
              sx={{
                cursor: "pointer",
                backgroundColor: (theme) => theme.palette.error.lighter,
              }}
            >
              <Grid item xs={1}>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
                >
                  {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
              </Grid>
              <Grid
                item
                xs={11}
                display="flex"
                alignItems="center"
                textAlign="center"
                fontWeight={550}
                fontSize={{ xs: "8px", md: "14px" }}
              >
                <Grid xs={3.5} alignItems="center">
                  TEAM NAME
                </Grid>
                <Grid xs={0.5} />
                <Grid xs={8} alignItems="center">
                  ERROR MESSAGE
                </Grid>
              </Grid>
            </Grid>
            {open ? (
              <Box sx={{ width: "100%", maxHeight: "50vh", overflow: "auto" }}>
                {errorsDataWhenRemovingUserFromOrg?.map((curr, index) => (
                  <Grid
                    p={1}
                    item
                    xs={12}
                    display="flex"
                    alignItems="center"
                    gap="10px"
                    key={index}
                    borderTop={(theme) =>
                      `1px solid ${theme.palette.grey[400]}`
                    }
                    sx={{
                      whiteSpace: "normal !important",
                      wordBreak: "break-word !important",
                    }}
                  >
                    <Grid item xs={1} sx={{ opacity: "0" }}>
                      <IconButton aria-label="expand row" size="small">
                        <KeyboardArrowDown />
                      </IconButton>
                    </Grid>
                    <Grid
                      item
                      xs={11}
                      display="flex"
                      alignItems="center"
                      fontSize={{ xs: "10px", md: "14px" }}
                    >
                      <Grid xs={3.5}>
                        {curr?.hrTeamName?.length > 25 ? (
                          <CustomTooltip
                            tooltipmaxwidth={400}
                            title={curr?.hrTeamName}
                          >
                            <Box component="span">{`${curr?.hrTeamName.slice(
                              0,
                              25
                            )}...`}</Box>
                          </CustomTooltip>
                        ) : (
                          curr?.hrTeamName
                        )}
                      </Grid>
                      <Grid xs={0.5} />
                      <Grid xs={8}>{curr?.errorMsg}</Grid>
                    </Grid>
                  </Grid>
                ))}
              </Box>
            ) : null}
          </Grid>
        </Box>
      ) : null}
    </>
  );
};

export default DisplayErrorsWhenRemovingUserFromOrg;
