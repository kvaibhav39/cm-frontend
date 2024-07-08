import React, { useEffect } from "react";
import { getQueryOperations } from "../../store/actions/helperActions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import CircularLoader from "../../common/CircularLoader";
import {
  Autocomplete,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SET_SELECTED_QUERY_OPERATION } from "../../store/actions/actionTypes";
import { getCurrentFileNameAndFunction } from "./../../utils/getCurrentFileNameAndFunction";

const QueryOperations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loading,
    queryOperationsLists,
    queryOperationResultLists,
    selectedQueryOperation,
  } = useSelector((state) => state.helper);

  //initial call to fetch operations lists
  useEffect(() => {
    if (!queryOperationsLists) {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      dispatch(getQueryOperations(logDetails));
    }
    return () => {
      dispatch({
        type: SET_SELECTED_QUERY_OPERATION,
        payload: null,
      });
    };
  }, []);

  //get selected operation's data
  useEffect(() => {
    if (selectedQueryOperation) {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      dispatch(
        getQueryOperations(logDetails, {
          queryTypeId: selectedQueryOperation?.queryTypeId,
        })
      );
    }
  }, [selectedQueryOperation]);

  const handleOnChange = (e, newValue) => {
    dispatch({
      type: SET_SELECTED_QUERY_OPERATION,
      payload: newValue || null,
    });
  };

  return (
    <>
      {loading ? (
        <CircularLoader height="75vh" size={50} />
      ) : queryOperationsLists?.length ? (
        <Grid
          container
          p={2}
          display="flex"
          flexDirection="column"
          alignItems="center"
          mt={{ xs: 10, md: 4 }}
        >
          <Grid item xs={3} width="100%">
            <Autocomplete
              disablePortal
              disableClearable
              id="org-selection"
              options={queryOperationsLists}
              sx={{ width: { md: 450, xs: 250 } }}
              value={selectedQueryOperation}
              onChange={handleOnChange}
              renderInput={(params) => (
                <TextField {...params} label="Select Query Operation" />
              )}
              getOptionLabel={(option) => option?.queryName || ""}
              filterOptions={(options, { inputValue }) =>
                inputValue?.length
                  ? options?.filter((option) =>
                      option?.queryName
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    )
                  : options
              }
              renderOption={(props, item) => (
                <li {...props} key={item?.queryTypeId}>
                  {item?.queryName}
                </li>
              )}
            />
          </Grid>
        </Grid>
      ) : (
        <Grid
          container
          display="flex"
          alignItems="center"
          flexDirection="column"
          mt={4}
          p={1}
        >
          <Typography variant="h3" fontWeight={550} mb={2}>
            Not Authorized!
          </Typography>
          <Button variant="contained" onClick={() => navigate("/")}>
            Go Back
          </Button>
        </Grid>
      )}
    </>
  );
};

export default QueryOperations;
