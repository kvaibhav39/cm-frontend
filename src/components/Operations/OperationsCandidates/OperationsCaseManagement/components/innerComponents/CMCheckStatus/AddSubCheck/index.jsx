import { Box, Button } from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  ALLOW_ADD_CHECK_SUBCHECK,
  UPDATE_SUBCHECK_SELECTED_STATE,
} from "../../../../../../../../store/actions/actionTypes";

const AddSubCheck = ({ removeSubCheck, caseCheck }) => {
  const {
    addedChecksAndSubCheck,
    OpsCandidateCaseChecksList,
    selectedCheckId,
    selectedSubCheckId,
  } = useSelector((state) => state.operations);
  const dispatch = useDispatch();

  let currentSelectedCheckOnHold = useMemo(() => {
    return OpsCandidateCaseChecksList?.find(
      (curr) => curr?.candidatesChecksMappingId === selectedCheckId
    )?.onHold;
  }, [OpsCandidateCaseChecksList, selectedCheckId]);

  let isSubCheckAdded = useMemo(
    () =>
      addedChecksAndSubCheck?.find(
        (check) =>
          check?.candidatesChecksMappingId ===
          caseCheck?.candidatesChecksMappingId
      )
        ? true
        : false,
    [caseCheck, addedChecksAndSubCheck]
  );

  const handleAddSubCheckSelected = () => {
    dispatch({
      type: UPDATE_SUBCHECK_SELECTED_STATE,
      payload: "add-sub-check",
    });

    //making true so that in 'AddedSubCheckDetails' due to the useEffect ,
    //'ADD_CHECK_AND_SUBCHECK' gets called which sets the 'addedChecksAndSubCheck'
    dispatch({
      type: ALLOW_ADD_CHECK_SUBCHECK,
      payload: true,
    });
  };

  return (
    <>
      {currentSelectedCheckOnHold ? null : (
        <Box
          mt={0.5}
          display="flex"
          justifyContent="center"
          sx={{
            backgroundColor: (theme) =>
              selectedSubCheckId === "add-sub-check"
                ? `${theme.palette.primary[100]}`
                : "transparent",
          }}
          p={1}
        >
          {isSubCheckAdded ? (
            <Box
              width="100%"
              display="flex"
              justifyContent="space-around"
              alignItems="center"
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddSubCheckSelected}
                cursor="pointer"
                sx={{
                  display:
                    selectedSubCheckId === "add-sub-check" ? "none" : "block",
                  fontSize: "10px",
                }}
              >
                View Scope
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={removeSubCheck}
                cursor="pointer"
                sx={{ fontSize: "10px" }}
              >
                Remove
              </Button>
            </Box>
          ) : (
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleAddSubCheckSelected}
              cursor="pointer"
              sx={{ fontSize: "10px" }}
            >
              Add Sub-Check
            </Button>
          )}
        </Box>
      )}
    </>
  );
};

export default AddSubCheck;
