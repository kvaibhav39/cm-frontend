import { BaseAccordion } from "../../../../../../../../base";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getAllQuestionnaires } from "../../../../../../../../../store/actions/hrActions";
import AddedCheckHeader from "./AddedCheckHeader";
import { getComponentAsPerChecksId } from "../utils/getComponentAsPerChecksId";
import { checksIdsWithResearchCountries } from "../../utils/checksIdsWithResearchCountries";
import { Field } from "formik";
import { getCheckOrderId } from "../utils/getCheckOrderId";
import { AutoCompleteWithChipsController } from "../../../../../../../../../common/Form/AutoCompleteWithChipsController/AutoCompleteWithChipsController";
import { HANDLE_CV_CHECK_ADDED_FILE } from "../../../../../../../../../store/actions/actionTypes";
import { getCurrentFileNameAndFunction } from "../../../../../../../../../utils/getCurrentFileNameAndFunction.js";

const AddedCheckAccordion = ({
  checksId,
  selectedCheckData,
  initialValues,
  handleRemoveCheck,
  accordionState,
  setAccordionState,
  setFieldValue,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [countries, setCountries] = useState([]);

  const { allCountriesModified } = useSelector((state) => state.helper);
  const { allQuestionnaires } = useSelector((state) => state?.hr);
  const { OpsBasicCandidateInfo, uploadedCVFileDetails } = useSelector(
    (state) => state.operations
  );

  //all countries
  useEffect(() => {
    if (allCountriesModified) {
      setCountries(allCountriesModified);
    }
  }, [allCountriesModified]);

  //questionnaires
  useEffect(() => {
    if (OpsBasicCandidateInfo?.hrOrganizationId) {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      dispatch(
        getAllQuestionnaires(
          {
            orgId: OpsBasicCandidateInfo?.hrOrganizationId,
          },
          logDetails
        )
      );
    }
  }, [OpsBasicCandidateInfo]);

  //update checkscope of cv check when file is uploaded
  useEffect(() => {
    if (checksId === 10) {
      setFieldValue(
        `checks[${getCheckOrderId(
          initialValues?.checks,
          checksId
        )}].checkScope`,
        uploadedCVFileDetails
      );
    }
  }, [uploadedCVFileDetails]);

  //check component will get returned
  let checksComponent = getComponentAsPerChecksId(
    checksId,
    initialValues?.checks,
    allQuestionnaires,
    countries
  );

  // research country present
  let toAddResearchCountry = checksIdsWithResearchCountries?.find(
    (curr) => curr.checksId === checksId
  );

  const handleAccordionStatus = (status) => {
    if (status) {
      setAccordionState(checksId);
    } else if (!status && accordionState === checksId) {
      setAccordionState(null);
    }
  };

  return (
    <>
      <BaseAccordion
        key={checksId}
        id={checksId}
        index={checksId}
        expanded={
          (checksComponent || toAddResearchCountry) &&
          accordionState === checksId
        }
        onChange={handleAccordionStatus}
        bordercolor={theme.palette.accordion.border}
        closedheaderbg="#dce2fa"
        noPaddingInAccordionDetails
        toRemoveAccordionIcon={
          checksComponent || toAddResearchCountry ? false : true
        }
        makeaccordioniconpositionabsolute={true}
        header={(header) => (
          <AddedCheckHeader
            selectedCheckData={selectedCheckData}
            handleRemoveCheck={() => {
              handleRemoveCheck(checksId, initialValues?.checks);

              //We will remove uploaded file when cv check gets deleted
              if (checksId === 10) {
                dispatch({
                  type: HANDLE_CV_CHECK_ADDED_FILE,
                  payload: null,
                });
              }
            }}
          />
        )}
      >
        {toAddResearchCountry ? (
          <Box
            p={3}
            display="flex"
            justifyContent="center"
            sx={{
              margin: "0 auto",
            }}
          >
            <Box>
              <Field
                name={`checks[${getCheckOrderId(
                  initialValues?.checks,
                  checksId
                )}].researchCountries`}
                countriesData={countries}
                component={AutoCompleteWithChipsController}
                wrapperObject={initialValues?.checks}
                checkId={checksId}
                checkOrderId={getCheckOrderId(initialValues?.checks, checksId)}
              />
            </Box>
          </Box>
        ) : null}
        <Box p={checksComponent ? 3 : 0}>{checksComponent}</Box>
      </BaseAccordion>
    </>
  );
};

export default AddedCheckAccordion;
