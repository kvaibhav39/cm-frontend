import { Field, Form, Formik } from "formik";
import { useMemo, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@mui/material";
import { isEqual } from "lodash";
import { getComponentAsPerChecksId } from "../AddCheck/utils/getComponentAsPerChecksId";
import { getAllQuestionnaires } from "../../../../../../../../store/actions/hrActions";
import { AutoCompleteWithChipsController } from "../../../../../../../../common/Form/AutoCompleteWithChipsController/AutoCompleteWithChipsController";
import { ADD_CHECK_AND_SUBCHECK } from "../../../../../../../../store/actions/actionTypes";
import { getCheckOrderId } from "../AddCheck/utils/getCheckOrderId";
import { checksIdsWithResearchCountries } from "../utils/checksIdsWithResearchCountries";
import { getCurrentFileNameAndFunction } from "../../../../../../../../utils/getCurrentFileNameAndFunction";

const AddedSubCheckDetails = memo(
  () => {
    const { allCountriesModified } = useSelector((state) => state.helper);
    const { allQuestionnaires, allChecksData } = useSelector(
      (state) => state?.hr
    );
    const {
      OpsBasicCandidateInfo,
      addedChecksAndSubCheck,
      subChecksList,
      allowAddCheckAndSubCheck,
      OpsCandidateCaseChecksList,
      selectedCheckId,
      selectedSubCheckId,
    } = useSelector((state) => state.operations);

    const dispatch = useDispatch();

    let rowData = useMemo(() => {
      return OpsCandidateCaseChecksList?.find(
        (curr) => curr?.candidatesChecksMappingId === selectedCheckId
      );
    }, [OpsCandidateCaseChecksList, selectedCheckId]);

    //initial values for formik
    let initialValues = useMemo(() => {
      let checks = [];

      if (allChecksData) {
        checks = [
          {
            checkId: rowData?.checksId,
            checkScope: allChecksData?.checks?.find(
              (curr) => curr.checksId === rowData?.checksId
            )?.defaultScope,
            candidatesChecksMappingId: rowData?.candidatesChecksMappingId,
          },
        ];

        if (
          checksIdsWithResearchCountries?.find(
            (curr) => curr.checksId === rowData?.checksId
          )
        ) {
          checks[0].researchCountries = [];
        }

        //if the subcheck is already added , then we will update our formik values to the already added value
        let ifPresent = addedChecksAndSubCheck?.find(
          (addedCheck) =>
            addedCheck?.candidatesChecksMappingId ===
            checks[0]?.candidatesChecksMappingId
        );

        if (ifPresent) {
          checks = [ifPresent];
        }
      }

      return { checks };
    }, [allChecksData, rowData, addedChecksAndSubCheck]);

    //all countries & questionnaires
    useEffect(() => {
      if (OpsBasicCandidateInfo?.hrOrganizationId && !allQuestionnaires) {
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
    }, [OpsBasicCandidateInfo?.hrOrganizationId]);

    //all countries
    let countries = useMemo(() => {
      if (allCountriesModified && subChecksList) {
        let countryIdsToRemoveArray = subChecksList?.map(
          (subCheck) => subCheck?.countryId
        );

        let resultArray = allCountriesModified?.filter(
          (obj) => !countryIdsToRemoveArray.includes(obj?.value)
        );

        return resultArray;
      }
      return [];
    }, [allCountriesModified, subChecksList]);

    //check component will get returned
    let checksComponent = useMemo(
      () =>
        getComponentAsPerChecksId(
          rowData?.checksId,
          initialValues?.checks,
          allQuestionnaires,
          countries
        ),
      [rowData, initialValues, allQuestionnaires, countries]
    );

    return (
      <Formik initialValues={initialValues} enableReinitialize>
        {({ values }) => {
          useEffect(() => {
            if (
              allowAddCheckAndSubCheck &&
              values?.checks &&
              !isEqual(
                values?.checks[0],
                addedChecksAndSubCheck?.find(
                  (curr) => curr.checkId === rowData?.checksId
                )
              )
            ) {
              //'allowAddCheckAndSubCheck' will only get 'true' when 'add sub-check' btn is clicked
              //and when 'update' btn to submit the added subchecks is clicked, it will turn to
              //'false' so that this useEffect doesnot set the 'addedChecksAndSubCheck' again
              dispatch({
                type: ADD_CHECK_AND_SUBCHECK,
                payload: values?.checks,
              });
            }
          }, [values]);

          return (
            <Form>
              {checksIdsWithResearchCountries?.find(
                (curr) => curr.checksId === rowData?.checksId
              ) ? (
                <Box
                  p={2}
                  display="flex"
                  justifyContent="center"
                  sx={{
                    borderBottom: (theme) =>
                      `1px solid ${theme.palette.grey[400]}`,
                    width: "96%",
                    margin: "0 auto",
                  }}
                >
                  <Box>
                    <Field
                      name={`checks[${getCheckOrderId(
                        initialValues?.checks,
                        rowData?.checksId
                      )}].researchCountries`}
                      countriesData={countries}
                      component={AutoCompleteWithChipsController}
                      wrapperObject={initialValues?.checks}
                      checkId={rowData?.checksId}
                      checkOrderId={getCheckOrderId(
                        initialValues?.checks,
                        rowData?.checksId
                      )}
                    />
                  </Box>
                </Box>
              ) : null}
              {checksComponent ? (
                <Box p={2}>{checksComponent}</Box>
              ) : (
                <Typography fontWeight={550} textAlign="center" my={2}>
                  No Check Scope Present
                </Typography>
              )}
            </Form>
          );
        }}
      </Formik>
    );
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);

export default AddedSubCheckDetails;
