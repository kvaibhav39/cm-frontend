import React, { memo } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllChecks } from "../../../store/actions/hrActions";
import { Grid, Typography } from "@mui/material";
import { useState } from "react";
import ChecksAccordion from "./components/ChecksAccordion";
import CircularLoader from "../../../common/CircularLoader";
import { CLEAR_ALL_CHECKS } from "../../../store/actions/actionTypes";
import { isEqual } from "lodash";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const UpdateCheckPrices = memo(
  () => {
    const dispatch = useDispatch();
    const { allChecksData, loading } = useSelector((state) => state.hr);
    const { selectedOrg } = useSelector((state) => state.systemAdmin);
    const [accordionStateIndex, setAccordionStateIndex] = useState(null);

    useEffect(() => {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      dispatch(getAllChecks(logDetails, selectedOrg));
      setAccordionStateIndex((prev) => (prev = null));
      return () => dispatch({ type: CLEAR_ALL_CHECKS });
    }, [selectedOrg]);

    return (
      <Grid
        item
        xs={12}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Grid
          mb={1}
          sx={{
            width: "100%",
            height: { xs: "75vh", xxl: "80vh" },
            overflowY: "auto",
          }}
        >
          <Grid item xs={12} gap={3}>
            {allChecksData?.checks?.length ? (
              allChecksData?.checks?.map((check, index) => (
                <ChecksAccordion
                  key={index}
                  index={index}
                  check={check}
                  accordionStateIndex={accordionStateIndex}
                  setAccordionStateIndex={setAccordionStateIndex}
                />
              ))
            ) : Array.isArray(allChecksData?.checks) &&
              allChecksData?.checks?.length === 0 ? (
              <Typography textAlign="center" p={4} fontWeight={550}>
                No Data Present
              </Typography>
            ) : (
              <CircularLoader />
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

export default UpdateCheckPrices;
