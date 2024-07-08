import { Badge, Box } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setToastNotification } from "../../../../../../../store/actions/toastNotificationActions";
import { ERROR } from "../../../../../../../store/constant";
import AddedChecksSubChecksSummaryModal from "./components/AddedChecksSubChecksSummaryModal";
import { LoadingButton } from "@mui/lab";
import { getCurrentFileNameAndFunction } from "../../../../../../../utils/getCurrentFileNameAndFunction.js";

const CMFooter = () => {
  const [open, setOpen] = useState(false);
  const {
    addedChecksAndSubCheck,
    disableUpdateAddCheckBtn,
    loadUpdateAddCheckBtn,
  } = useSelector((state) => state.operations);
  const { allChecksData } = useSelector((state) => state?.hr);
  const dispatch = useDispatch();

  const handleOpen = () => {
    let countryFlag = [];
    let questionnaireFlag = [];
    let CVfileUploadMissingFlag = false;

    addedChecksAndSubCheck?.forEach((check) => {
      //to check if country selected
      if (check?.researchCountries && !check?.researchCountries?.length) {
        countryFlag.push(
          allChecksData?.checks?.find(
            (curr) => check?.checkId === curr.checksId
          )?.checkDisplayName
        );
      }

      //to check if questionnaire selected
      if (check?.checkId === 8 && !check?.checkScope?.questionnaireId) {
        questionnaireFlag.push(
          allChecksData?.checks?.find(
            (curr) => check?.checkId === curr.checksId
          )?.checkDisplayName
        );
      } else if (check?.checkId === 15 && !check?.checkScope?.questionnaireId) {
        questionnaireFlag.push(
          allChecksData?.checks?.find(
            (curr) => check?.checkId === curr.checksId
          )?.checkDisplayName
        );
      }

      //to check if cv check has file uploaded
      if (check?.checkId === 10 && !check?.checkScope?.attachmentName) {
        CVfileUploadMissingFlag = true;
      }
    });

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleOpen"
    );

    if (countryFlag?.length) {
      dispatch(
        setToastNotification(
          ERROR,
          `Please select countries for check(s)/sub-check(s) - ${countryFlag.join(
            ", "
          )}`,
          logDetails
        )
      );
    } else if (questionnaireFlag?.length) {
      dispatch(
        setToastNotification(
          ERROR,
          `Please select questionnaire for check(s)/sub-check(s) - ${questionnaireFlag.join(
            ", "
          )}`,
          logDetails
        )
      );
    } else if (CVfileUploadMissingFlag) {
      dispatch(
        setToastNotification(
          ERROR,
          `Please upload a file for CV Check`,
          logDetails
        )
      );
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="center" borderRadius="5px" mt={0.5}>
        <Badge badgeContent={addedChecksAndSubCheck?.length} color="warning">
          <LoadingButton
            variant="contained"
            onClick={handleOpen}
            disabled={
              !addedChecksAndSubCheck?.length || disableUpdateAddCheckBtn
            }
            loading={
              loadUpdateAddCheckBtn?.purpose === "callFromAddChecksSubchecks" &&
              loadUpdateAddCheckBtn?.value
            }
          >
            Update
          </LoadingButton>
        </Badge>
      </Box>
      {open ? (
        <AddedChecksSubChecksSummaryModal
          open={open}
          handleClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
};

export default CMFooter;
