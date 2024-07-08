import moment from "moment";
import { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  styled,
  Typography,
  FormGroup,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { LaptopDatePicker2 } from "../../../../common/Form/DatePicker/DesktopDatePicker";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { CustomCheckbox } from "../../../common/CustomCheckBox";
import { rangeSelectors } from "../../../constants/filterData";
import {
  getCheckInternalStatus,
  getVerificationProcessStatus,
  getVerificationResultStatus,
} from "../../../../store/actions/operationActions";
import { useSearchParams } from "react-router-dom";
import CircularLoader from "../../../../common/CircularLoader";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction.js";

const BaseListItem = styled(ListItemButton)`
  border-radius: 12px;
  &.Mui-selected {
    color: white;
    background-color: #5974f6;
    &:hover {
      background-color: #5974f6;
    }
  }
`;

const OperationsCandidatesSidebar = () => {
  const [range, setRange] = useState();
  const [verificationProcessStatusState, setVerificationProcessStatusState] =
    useState({});
  const [verificationProcessResultState, setVerificationProcessResultState] =
    useState({});
  const [internalStatusState, setInternalStatusState] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    verificationProcessStatusData,
    verificationResultStatusData,
    checkInternalStatusLists,
  } = useSelector((state) => state.operations);

  const dispatch = useDispatch();

  const theme = useTheme();

  useEffect(() => {
    if (!verificationProcessStatusData || !verificationResultStatusData) {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      dispatch(getVerificationProcessStatus(logDetails));
      dispatch(getVerificationResultStatus(logDetails));
    }
  }, []);

  useEffect(() => {
    if (
      searchParams.get("toggledOpsTableView") === "checks" &&
      !checkInternalStatusLists
    ) {
      dispatch(getCheckInternalStatus());
    }
  }, [searchParams.get("toggledOpsTableView")]);

  //adding 'All' for checkbox in process & result list
  let verificationProcessStatusLists = useMemo(() => {
    if (verificationProcessStatusData) {
      return [
        {
          candidatesVerificationProcessStatusId: 0,
          verificationProcessStatusName: "All",
          verificationProcessStatusDescription: "All checks",
        },
        ...verificationProcessStatusData,
      ];
    } else {
      return [];
    }
  }, [verificationProcessStatusData]);

  let verificationProcessResultLists = useMemo(() => {
    if (verificationResultStatusData) {
      return [
        {
          candidatesVerificationResultStatusId: 0,
          verificationResultStatusName: "All",
          verificationResultStatusDescription: "All checks",
        },
        ...verificationResultStatusData,
      ];
    } else {
      return [];
    }
  }, [verificationResultStatusData]);

  let internalStatusLists = useMemo(() => {
    if (checkInternalStatusLists) {
      return [
        {
          id: 0,
          value: "All",
        },
        ...checkInternalStatusLists?.map((curr) => ({
          id: curr?.id,
          value: curr?.checkInternalStatusName,
        })),
      ];
    } else {
      return [];
    }
  }, [checkInternalStatusLists]);

  useEffect(() => {
    //verification
    if (searchParams.get("toggledOpsTableView") === "candidates") {
      let verificationIds = searchParams
        .get("verificationProcessId")
        ?.split(",");

      if (verificationIds && verificationProcessStatusData?.length) {
        let tempVerification = {};

        verificationProcessStatusData?.forEach((curr) => {
          tempVerification = {
            ...tempVerification,
            [curr?.candidatesVerificationProcessStatusId]: false,
          };
        });

        if (verificationIds?.length === verificationProcessStatusData?.length) {
          tempVerification = { 0: true };
        }

        for (let id of verificationIds) {
          tempVerification = { ...tempVerification, [+id]: true };
        }

        setVerificationProcessStatusState((prev) => (prev = tempVerification));
      }
    } else if (searchParams.get("toggledOpsTableView") === "checks") {
      let internalStatusId = searchParams.get("internalStatusId")?.split(",");

      if (internalStatusId && checkInternalStatusLists?.length) {
        let tempVerification = {};

        checkInternalStatusLists?.forEach((curr) => {
          tempVerification = {
            ...tempVerification,
            [curr?.id]: false,
          };
        });

        if (internalStatusId?.length === checkInternalStatusLists?.length) {
          tempVerification = { 0: true };
        }

        for (let id of internalStatusId) {
          tempVerification = { ...tempVerification, [+id]: true };
        }

        setInternalStatusState((prev) => (prev = tempVerification));
      }
    }

    //result
    let resultIds = searchParams.get("verificationResultId")?.split(",");

    if (resultIds && verificationResultStatusData?.length) {
      let tempResult = {};

      verificationResultStatusData?.forEach((curr) => {
        tempResult = {
          ...tempResult,
          [curr?.candidatesVerificationResultStatusId]: false,
        };
      });

      if (resultIds?.length === verificationResultStatusData?.length) {
        tempResult = { 0: true };
      }

      for (let id of resultIds) {
        tempResult = { ...tempResult, [+id]: true };
      }

      setVerificationProcessResultState((prev) => (prev = tempResult));
    }

    //date range
    setRange(rangeSelectors[+searchParams.get("dateRange")]);
  }, [
    verificationProcessStatusData,
    verificationResultStatusData,
    searchParams.get("toggledOpsTableView"),
    checkInternalStatusLists,
    searchParams,
  ]);

  const onClickRange = (item, ind) => {
    setRange(item);

    setSearchParams((prevParams) => {
      return new URLSearchParams({
        ...Object.fromEntries(prevParams.entries()),
        ...item?.dates,
        dateRange: ind,
        pageNumber: 1,
      });
    });
  };

  const onChangeDate = (type) => (date) => {
    let updatedRangeDate = {
      ...rangeSelectors[4],
      dates: {
        fromDate:
          searchParams.get("fromDate") || rangeSelectors[4]?.dates?.fromDate,
        toDate: searchParams.get("toDate") || rangeSelectors[4]?.dates?.toDate,
      },
    };
    setRange(updatedRangeDate);

    setSearchParams((prevParams) => {
      return new URLSearchParams({
        ...Object.fromEntries(prevParams.entries()),
        ...{
          ...updatedRangeDate?.dates,
          [type]: moment(date).format("YYYY-MM-DD"),
          dateRange: 4,
          pageNumber: 1,
        },
      });
    });
  };

  const defaultToggleCheckBoxes = (
    id,
    checkBoxState,
    setCheckBoxState,
    checkboxListsData,
    checkboxListId,
    paramName,
    defaultSelectedChecks = { 3: true }
  ) => {
    let temp = { ...checkBoxState };

    temp = { ...temp, [id]: !temp[id] };

    if (id === 0) {
      //'All' is selected
      if (temp[id]) {
        //making every checkbox ticked true
        checkboxListsData.forEach((curr) => {
          if (curr[checkboxListId] !== 0) {
            temp = { ...temp, [curr[checkboxListId]]: true };
          }
        });
      } else {
        //'All' is deselected

        //making every checkbox ticked false
        checkboxListsData.forEach((curr) => {
          temp = { ...temp, [curr[checkboxListId]]: false };
        });

        //will only make the default checkbox ticked
        temp = { ...temp, ...defaultSelectedChecks };
      }
    } else {
      let countTickedChecks = 0;
      //counting number of ticked checkboxes
      for (let i in temp) {
        if (i !== "0" && temp[i]) countTickedChecks++;
      }

      //if countTickedChecks is equal to the number of total checkboxes - 1 ,
      //then we will make 'All' checkbox true else false
      //subtracting 1 from checkboxListsData because it has an extra object for 'All'
      temp = { ...temp, 0: countTickedChecks === checkboxListsData.length - 1 };
    }

    setCheckBoxState(temp);

    //adding selected ids
    let tempArr = [];
    for (let i in temp) {
      if (i !== "0" && temp[i]) {
        //not adding 'All' checkbox
        tempArr.push(i);
      }
    }

    setSearchParams((prevParams) => {
      return new URLSearchParams({
        ...Object.fromEntries(prevParams.entries()),
        [paramName]: tempArr.join(","),
        pageNumber: 1,
      });
    });
  };

  return (
    <Box pr={1}>
      {/* RANGE */}
      <FormControl fullWidth size="small">
        <Box
          color={theme.palette.grey[700]}
          fontWeight="bold"
          margin="0 0 0.5rem 0.5rem"
        >
          Select Range
        </Box>
        <List disablePadding>
          {rangeSelectors.map((item, ind) => (
            <BaseListItem
              key={item.value}
              selected={item.value === range?.value}
              onClick={() => onClickRange(item, ind)}
            >
              <ListItemText
                primary={item.label}
                sx={{
                  "> span": {
                    fontWeight: 500,
                    color:
                      item.value === range?.value
                        ? "white !important"
                        : "#817F89 !important",
                  },
                }}
              />
            </BaseListItem>
          ))}
        </List>
        {range?.value === "CUSTOM RANGE" && (
          <Paper sx={{ padding: "1rem 0.5rem" }}>
            {/*<Typography fontWeight={500} color="#817F89">*/}
            {/*    Custom*/}
            {/*</Typography>*/}
            <Grid container direction="row">
              <Grid sm={12} sx={{ paddingRight: "0.25rem" }}>
                <Typography
                  color={theme.palette.grey[700]}
                  marginBottom="4px"
                  fontSize="13px"
                  fontWeight={500}
                >
                  From
                </Typography>
                <LaptopDatePicker2
                  name="from"
                  label="From"
                  required={true}
                  value={
                    searchParams.get("fromDate") || range?.dates?.fromDate || ""
                  }
                  onChange={onChangeDate("fromDate")}
                  disabledTextField={true}
                />
              </Grid>
              <Grid sm={12}>
                <Typography
                  color={theme.palette.grey[700]}
                  marginBottom="4px"
                  fontSize="13px"
                  fontWeight={500}
                >
                  To
                </Typography>
                <LaptopDatePicker2
                  name="to"
                  label="To"
                  required={true}
                  value={
                    searchParams.get("toDate") || range?.dates?.toDate || ""
                  }
                  onChange={onChangeDate("toDate")}
                  disabledTextField={true}
                />
              </Grid>
            </Grid>
          </Paper>
        )}
      </FormControl>

      {searchParams.get("toggledOpsTableView") === "candidates" ? (
        <>
          {/* Verification process */}
          <FormControl fullWidth size="small">
            <Box
              color={theme.palette.grey[700]}
              fontWeight="bold"
              margin="0.5rem 0 0.5rem 0.5rem"
            >
              Verification Process
            </Box>

            <List>
              {verificationProcessStatusLists?.length ? (
                <>
                  {verificationProcessStatusLists?.map((curr, ind) => (
                    <ListItem
                      key={ind}
                      disablePadding
                      sx={{
                        padding: "0px",
                        height: "2rem",
                        marginBottom: "5px",
                      }}
                    >
                      <FormGroup
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          flexWrap: "nowrap",
                        }}
                      >
                        <CustomCheckbox
                          type="checkbox"
                          id={`process-checkbox-${ind}`}
                          name={curr?.verificationProcessStatusName}
                          value={
                            verificationProcessStatusState[
                              curr?.candidatesVerificationProcessStatusId
                            ]
                          }
                          checked={
                            verificationProcessStatusState[
                              curr?.candidatesVerificationProcessStatusId
                            ]
                          }
                          onChange={() =>
                            defaultToggleCheckBoxes(
                              curr?.candidatesVerificationProcessStatusId,
                              verificationProcessStatusState,
                              setVerificationProcessStatusState,
                              verificationProcessStatusLists,
                              "candidatesVerificationProcessStatusId",
                              "verificationProcessId",
                              { 2: true, 3: true }
                            )
                          }
                        />
                        <label htmlFor={`process-checkbox-${ind}`}>
                          {" "}
                          <Typography variant="body2" sx={{ fontSize: "12px" }}>
                            {curr?.verificationProcessStatusName}
                          </Typography>
                        </label>
                      </FormGroup>
                    </ListItem>
                  ))}
                </>
              ) : (
                <CircularLoader size={30} height="10vh" />
              )}
            </List>
          </FormControl>
        </>
      ) : (
        <>
          {/* subcheck internal status */}
          <FormControl fullWidth size="small">
            <Box
              color={theme.palette.grey[700]}
              fontWeight="bold"
              margin="0.5rem 0 0.5rem 0.5rem"
            >
              Sub-check Internal Status
            </Box>

            <List>
              {internalStatusLists?.length ? (
                <>
                  {internalStatusLists?.map((curr, ind) => (
                    <ListItem
                      key={ind}
                      disablePadding
                      sx={{
                        padding: "0px",
                        height: "2rem",
                        marginBottom: "5px",
                      }}
                    >
                      <FormGroup
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          flexWrap: "nowrap",
                        }}
                      >
                        <CustomCheckbox
                          type="checkbox"
                          id={`process-checkbox-${ind}`}
                          name={curr?.value}
                          value={internalStatusState[curr?.id]}
                          checked={internalStatusState[curr?.id]}
                          onChange={() =>
                            defaultToggleCheckBoxes(
                              curr?.id,
                              internalStatusState,
                              setInternalStatusState,
                              internalStatusLists,
                              "id",
                              "internalStatusId",
                              {
                                1: true,
                                5: true,
                                6: true,
                                7: true,
                                8: true,
                                9: true,
                                10: true,
                                11: true,
                                12: true,
                              }
                            )
                          }
                        />
                        <label htmlFor={`process-checkbox-${ind}`}>
                          {" "}
                          <Typography variant="body2" sx={{ fontSize: "12px" }}>
                            {curr?.value}
                          </Typography>
                        </label>
                      </FormGroup>
                    </ListItem>
                  ))}
                </>
              ) : (
                <CircularLoader size={30} height="10vh" />
              )}
            </List>
          </FormControl>
        </>
      )}

      {/* Verification result */}
      <FormControl fullWidth size="small">
        <Box
          color={theme.palette.grey[700]}
          fontWeight="bold"
          margin="0.5rem 0 0.5rem 0.5rem"
        >
          Verification Result
        </Box>
        <List>
          {verificationProcessResultLists?.length ? (
            <>
              {verificationProcessResultLists?.map((curr, ind) => (
                <ListItem
                  key={ind}
                  disablePadding
                  sx={{
                    padding: "0px",
                    height: "2rem",
                    marginBottom: "5px",
                  }}
                >
                  <FormGroup
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      flexWrap: "nowrap",
                    }}
                  >
                    <CustomCheckbox
                      type="checkbox"
                      id={`result-checkbox-${ind}`}
                      name={curr?.candidatesVerificationResultStatusId}
                      value={
                        verificationProcessResultState[
                          curr?.candidatesVerificationResultStatusId
                        ]
                      }
                      checked={
                        verificationProcessResultState[
                          curr?.candidatesVerificationResultStatusId
                        ]
                      }
                      onChange={() =>
                        defaultToggleCheckBoxes(
                          curr?.candidatesVerificationResultStatusId,
                          verificationProcessResultState,
                          setVerificationProcessResultState,
                          verificationProcessResultLists,
                          "candidatesVerificationResultStatusId",
                          "verificationResultId"
                        )
                      }
                    />
                    <label htmlFor={`result-checkbox-${ind}`}>
                      {" "}
                      <Typography variant="body2" sx={{ fontSize: "12px" }}>
                        {curr?.verificationResultStatusName}
                      </Typography>
                    </label>
                  </FormGroup>
                </ListItem>
              ))}
            </>
          ) : (
            <CircularLoader size={30} height="10vh" />
          )}
        </List>
      </FormControl>
    </Box>
  );
};

export default OperationsCandidatesSidebar;
