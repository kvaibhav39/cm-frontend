import { useSelector } from "react-redux";
import { useMemo } from "react";
import SelectedSubCheckDetails from "../../SelectedSubCheckDetails";
import { Typography } from "@mui/material";

const UpdateSubCheckDetails = () => {
  const {
    OpsCandidateCaseChecksList,
    subChecksList,
    selectedCheckId,
    selectedSubCheckId,
  } = useSelector((state) => state.operations);

  let currentSelectedCheck = useMemo(() => {
    return OpsCandidateCaseChecksList?.find(
      (curr) => curr?.candidatesChecksMappingId == selectedCheckId
    );
  }, [OpsCandidateCaseChecksList, selectedCheckId]);

  let selectedSubCheck = useMemo(() => {
    return subChecksList?.find((curr) => curr.id === selectedSubCheckId);
  }, [subChecksList, selectedSubCheckId]);

  return (
    <>
      {" "}
      {currentSelectedCheck?.onHold ? (
        <Typography fontWeight="550" textAlign="center" p={2}>
          {currentSelectedCheck?.onHoldText}
        </Typography>
      ) : selectedSubCheck ? (
        <SelectedSubCheckDetails />
      ) : (
        <Typography fontWeight="550" textAlign="center" p={2}>
          Details yet to be filled
        </Typography>
      )}
    </>
  );
};

export default UpdateSubCheckDetails;
