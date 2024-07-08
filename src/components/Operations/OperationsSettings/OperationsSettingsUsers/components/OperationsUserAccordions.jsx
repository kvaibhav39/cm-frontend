import React, { memo, useMemo, useState } from "react";
import { BaseAccordion } from "../../../../base";
import { useTheme } from "@mui/material/styles";
import {
  Autocomplete,
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getOrgsListsByOpsUserId,
  updateOrgsAssignedToOpsUser,
} from "../../../../../store/actions/operationActions";
import CircularLoader from "../../../../../common/CircularLoader";
import { getFileNameWithEllipsis } from "../../../../../utils/getFileNameWithEllipsis";
import CustomTooltip from "./../../../../common/CustomTooltip";
import { setToastNotification } from "../../../../../store/actions/toastNotificationActions";
import { ERROR } from "../../../../../store/constant";
import { isEqual } from "lodash";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { getCurrentFileNameAndFunction } from "../../../../../utils/getCurrentFileNameAndFunction";

const OperationsUserAccordions = memo(
  ({ accordionStateIndex, setAccordionStateIndex, index, opsUserData }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { orgsListsByOpsUserId } = useSelector((state) => state.operations);
    const { orgsLists } = useSelector((state) => state.systemAdmin);
    const [disable, setDisable] = useState(true);
    const [selectedOrgs, setSelectedOrgs] = useState([]);

    let updatedOrgsLists = useMemo(() => {
      let updatedOrgsListsByOpsUserId = orgsListsByOpsUserId?.filter(
        (curr) => curr?.hrOrganizationsId
      );
      setSelectedOrgs(updatedOrgsListsByOpsUserId);
      setDisable(true);

      let newOrgLists = [];
      orgsLists?.forEach((org, ind) => {
        let ifAlreadySelected = updatedOrgsListsByOpsUserId?.find(
          (curr) => curr.hrOrganizationsId === org.hrOrganizationsId
        );
        if (!ifAlreadySelected && org?.hrOrganizationsId) {
          newOrgLists.push(org);
        }
      });
      return newOrgLists.sort(
        (a, b) => a?.hrOrganizationsId - b?.hrOrganizationsId
      );
    }, [orgsLists, orgsListsByOpsUserId]);

    const handleAccordionStatus = (selectedIndex) => {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "handleAccordionStatus"
      );

      if (!selectedIndex && accordionStateIndex === selectedIndex) {
        setAccordionStateIndex(() => null);
      } else {
        setAccordionStateIndex(() => selectedIndex);
        dispatch(
          getOrgsListsByOpsUserId(
            { opsUserId: opsUserData?.assignee },
            logDetails
          )
        );
      }
    };

    const handleUpdate = () => {
      let payload = { opsUserId: opsUserData.assignee, hrOrganizationIds: [] };

      payload.hrOrganizationIds = selectedOrgs.map(
        (curr) => curr.hrOrganizationsId
      );

      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "handleUpdate"
      );

      dispatch(updateOrgsAssignedToOpsUser(payload, logDetails));
      setDisable(true);
    };

    return (
      <>
        {opsUserData ? (
          <Box
            sx={{
              border: (theme) => `1px solid ${theme.palette.grey[400]}`,
              borderRadius: "5px",
              width: { xs: "100%", md: "90%" },
              margin: "0 auto 1rem",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              flexWrap="wrap"
              gap={1}
              sx={{
                background: (theme) => theme.palette.primary[100],
                cursor: "pointer",
              }}
              p={1}
              onClick={() => handleAccordionStatus(index)}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flex-start"
                flexDirection={{ xs: "column", md: "row" }}
                flexGrow={1}
              >
                <Typography
                  fontWeight={500}
                  color="#000"
                  textAlign="center"
                  fontSize={{ xs: 10, md: 14 }}
                >
                  Assignee -&nbsp;
                </Typography>
                <Typography
                  fontWeight={550}
                  color={(theme) => theme.palette.primary.main}
                  mr={{ xs: 0, md: 1 }}
                  fontSize={{ xs: 10, md: 14 }}
                >
                  {opsUserData?.assigneeName}
                  &nbsp;:&nbsp;{opsUserData?.subRoleName}
                </Typography>{" "}
                <CustomTooltip title={opsUserData?.loginEmail}>
                  <Typography
                    fontWeight={500}
                    color={(theme) => theme.palette.grey[700]}
                    fontSize={{ xs: 10, md: 14 }}
                  >
                    ({getFileNameWithEllipsis(opsUserData?.loginEmail, 20)})
                  </Typography>
                </CustomTooltip>
              </Box>
              <Box>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => handleAccordionStatus(index)}
                >
                  {accordionStateIndex === index ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  )}
                </IconButton>
              </Box>
            </Box>
            {accordionStateIndex === index ? (
              <Box>
                {orgsListsByOpsUserId ? (
                  <Grid item xs={12} gap={3} p={2}>
                    <Grid
                      item
                      xs={12}
                      display={"flex"}
                      className={"text-center"}
                    >
                      <Autocomplete
                        multiple
                        id="tags-outlined"
                        value={selectedOrgs}
                        sx={{
                          minWidth: { lg2: 800, md: 500, xs: "100%" },
                        }}
                        componentsProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "flip",
                                enabled: true,
                              },
                              {
                                name: "preventOverflow",
                                enabled: false,
                              },
                            ],
                          },
                        }}
                        onChange={(event, newValue = [], reason, details) => {
                          if (reason === "removeOption") {
                            newValue = newValue.filter(
                              (option) =>
                                option.hrOrganizationsId !==
                                details.option.hrOrganizationsId
                            );

                            if (newValue?.length === 0) {
                              let logDetails = getCurrentFileNameAndFunction(
                                import.meta.url,
                                "onChange"
                              );
                              return dispatch(
                                setToastNotification(
                                  ERROR,
                                  "Atleast 1 organization must be present",
                                  logDetails
                                )
                              );
                            }

                            setSelectedOrgs((prev) => (prev = newValue));
                          } else {
                            setSelectedOrgs((prev) => (prev = newValue));
                          }
                          setDisable(false);
                        }}
                        options={updatedOrgsLists}
                        getOptionLabel={(option) =>
                          `${option?.hrOrganizationName} (${option?.hrOrganizationsId})` ||
                          ""
                        }
                        filterSelectedOptions
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Organization(s)"
                            placeholder="Select Organization(s)"
                          />
                        )}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      display="flex"
                      justifyContent={{ xs: "center", md: "flex-end" }}
                      mt={1}
                    >
                      <Button
                        variant="contained"
                        disabled={disable || selectedOrgs?.length === 0}
                        onClick={handleUpdate}
                      >
                        Update
                      </Button>
                    </Grid>
                  </Grid>
                ) : (
                  <CircularLoader height="10vh" size={30} />
                )}
              </Box>
            ) : null}
          </Box>
        ) : null}
      </>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

export default OperationsUserAccordions;
