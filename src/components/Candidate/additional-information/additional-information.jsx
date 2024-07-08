import { Box, Stack, Typography, Grid, Divider } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseAdditionalInfoUpload from "../../base/BaseAdditionalInfoUpload";
import { StyledBasePaper } from "../../base/styled";
import { omit } from "lodash";
import { getSectionData } from "../utils/getSectionData";
import { useDispatch, useSelector } from "react-redux";
import { setToastNotification } from "../../../store/actions/toastNotificationActions";
import { ERROR } from "../../../store/constant";
import CustomTooltip from "../../common/CustomTooltip";
import { useTheme } from "@mui/material/styles";
import {
  ADDITIONAL_INFORMATION,
  CANDIDATE_CLEAR_API_ERROR,
  CANDIDATE_DISPLAY_API_ERROR,
  CANDIDATE_SECTION_BACK_URL,
  CANDIDATE_SECTION_SUBMIT_HANDLER,
} from "../../../store/actions/actionTypes";
import { errorUtils } from "../../../utils/ErrorUtils";
import { uploadFileUtils } from "../../../store/actions/helperActions";
import {
  getAdditionalInformationData,
  submitCacheCandidateDetails,
  submitCandidateDetails,
} from "../../../store/actions/candidateAction";
import AlertMessageComponent from "../../../common/AlertMessageComponent";
import { BaseAccordion } from "../../base";
import EditablePdfForm from "./component/EditablePdfForm";
import CircularLoader from "../../../common/CircularLoader";
import DisplaySectionHeading from "../common/DisplaySectionHeading";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const CandidateAdditionalInformation = () => {
  const [uploadFiles, setUploadFiles] = useState([]);
  const uploadedfilesRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toCacheValues = useRef([]);
  const theme = useTheme();
  const [disableBtn, setDisableBtn] = useState(false);

  const {
    loading,
    candidateInitialDetails,
    apiErrorMsg,
    candidateCachedDetails,
    additionalInformationData,
    candidateSectionLoading,
  } = useSelector((state) => state.candidate);
  const { candidateProfileSections, candidateId, allowProfileEdit } =
    candidateInitialDetails;
  const [accordionStateIndex, setAccordionStateIndex] = useState(null);

  const additionalInformationDataRef = useRef();
  additionalInformationDataRef.current = additionalInformationData;

  const ADDITIONAL_INFORMATION_DATA_REF = useRef();

  useEffect(() => {

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(getAdditionalInformationData(logDetails));
  }, []);

  let candidateCachedDetailsForComponent =
    candidateCachedDetails && candidateCachedDetails["ADDITIONAL_INFORMATION"];

  const ADDITIONAL_INFORMATION_DATA = useMemo(() => {
    let temp = additionalInformationData ? [...additionalInformationData] : [];

    if (
      additionalInformationData?.length > 0 &&
      !additionalInformationData[0]?.savedFormCdnPath &&
      candidateCachedDetailsForComponent &&
      candidateCachedDetailsForComponent?.length > 0
    ) {
      if (
        additionalInformationData?.length >
        candidateCachedDetailsForComponent?.length
      ) {
        let tempCached = [...candidateCachedDetailsForComponent];

        additionalInformationData?.forEach((curr) => {
          let ifPresent = candidateCachedDetailsForComponent?.find(
            (cached) => cached.formId === curr.formId
          );

          if (!ifPresent) {
            tempCached.push(curr);
          }
        });

        temp = tempCached;
      } else if (
        candidateCachedDetailsForComponent?.length >
        additionalInformationData?.length
      ) {
        let tempNew = [];

        candidateCachedDetailsForComponent?.forEach((curr) => {
          let isCommon = additionalInformationData?.find(
            (cached) => cached.formId === curr.formId
          );

          if (isCommon) {
            let ifAlreadyAdded = tempNew.find(
              (c) => c?.formId === isCommon?.formId
            );

            if (!ifAlreadyAdded) {
              tempNew.push(curr);
            }
          }
        });
        temp = tempNew;
      } else {
        temp = [...candidateCachedDetailsForComponent];
      }
      // console.log("check--memo-after", toCacheValues.current);

      let tempNew = [];

      temp.forEach((cache) => {
        if (cache?.cachedSavedFormCdnPath) {
          tempNew.push({
            formId: cache?.formId,
            savedFormName: cache?.savedFormName,
            candidateId: cache?.candidateId,
            savedFormCdnPath: cache?.cachedSavedFormCdnPath,
          });
        }
      });
      setUploadFiles(tempNew);
    } else {
      setUploadFiles(temp);
    }

    toCacheValues.current = [...temp];
    return temp;
  }, [additionalInformationData, candidateCachedDetails]);

  // canched value on unmount
  useEffect(() => {
    return () => {
      dispatch({ type: CANDIDATE_CLEAR_API_ERROR });

      dispatch({
        type: ADDITIONAL_INFORMATION,
        payload: [],
      });

      //caching when dismounts
      if (
        additionalInformationDataRef.current?.length > 0 &&
        !additionalInformationDataRef.current[0]?.savedFormCdnPath &&
        toCacheValues.current
      ) {
        updatePayloadForCaching(uploadedfilesRef.current);

        let logDetails = getCurrentFileNameAndFunction(
          import.meta.url,
          "useEffect"
        );

        dispatch(
          submitCacheCandidateDetails(
            logDetails,
            toCacheValues.current,
            "ADDITIONAL_INFORMATION"
          )
        );
      }
    };
  }, []);

  const sectionData = useMemo(() => {
    let data = getSectionData(
      "ADDITIONAL_INFORMATION",
      candidateProfileSections,
      allowProfileEdit
    );

    //passing back url for the back btn present in candidate nav section
    dispatch({
      type: CANDIDATE_SECTION_BACK_URL,
      payload: data?.urls?.backUrl,
    });

    return data;
  }, [candidateProfileSections]);

  //passing handleSubmit and invoking it on next btn which is present in candidate nav section
  useEffect(() => {
    uploadedfilesRef.current = uploadFiles;
    ADDITIONAL_INFORMATION_DATA_REF.current = ADDITIONAL_INFORMATION_DATA;

    dispatch({
      type: CANDIDATE_SECTION_SUBMIT_HANDLER,
      payload: () => {
        handleSubmit();
      },
    });
  }, [uploadFiles, ADDITIONAL_INFORMATION_DATA]);

  const handleSubmit = async () => {
    try {
      if (ADDITIONAL_INFORMATION_DATA_REF.current.length) {
        dispatch({ type: CANDIDATE_CLEAR_API_ERROR });
        let logDetails = getCurrentFileNameAndFunction(
          import.meta.url,
          "handleSubmit"
        );

        if (
          !uploadedfilesRef.current.length ||
          ADDITIONAL_INFORMATION_DATA_REF.current.length !==
            uploadedfilesRef.current.length ||
          !uploadedfilesRef.current?.every((form) => form.savedFormCdnPath)
        ) {
          return dispatch(
            setToastNotification(
              ERROR,
              "Please upload all the required file(s)",
              logDetails
            )
          );
        }

        // if (!toCacheValues.current.every((form) => form.isSigned === true)) {
        //   dispatch(
        //     setToastNotification(
        //       ERROR,
        //       "Please provide signature for all the required form(s)",logDetails
        //     )
        //   );
        //   return;
        // }

        dispatch(
          submitCandidateDetails(
            {
              ADDITIONAL_FORMS: uploadedfilesRef.current?.map((file) => {
                file = omit(file, [
                  "formName",
                  "formDescription",
                  "formCdnPath",
                  "countryId",
                ]);

                if (!file?.candidateId) {
                  file.candidateId = candidateId;
                }

                return file;
              }),
            },
            "additional-information",
            () => {
              toCacheValues.current = [];
              navigate(sectionData?.urls?.nextUrl);
            },
            sectionData?.section?.onHold,
            sectionData?.section?.candidatesProfileSectionsId,
            navigate,
            logDetails
          )
        );
      }
    } catch (error) {
      dispatch({
        type: CANDIDATE_DISPLAY_API_ERROR,
        payload:
          error?.response?.data?.message ||
          errorUtils.getError(error) ||
          "Internal Server Error",
      });
      throw errorUtils.getError(error);
    }
  };

  const handleAccordionStatus = (status, id) => {
    let ifPresent = uploadFiles?.find((curr) => curr?.formId === id);
    if (
      status &&
      (ifPresent?.savedFormCdnPath ||
        (ifPresent?.attachments && ifPresent?.attachments[0]?.file) ||
        ifPresent?.file)
    ) {
      setAccordionStateIndex(id);
    } else if (!status && accordionStateIndex === id) {
      setAccordionStateIndex(null);
    }
  };

  const updatePayloadForCaching = (files) => {
    if (files?.length) {
      let tempCacheVals = [];

      files.forEach((selectedFile) => {
        let getFormDetailsForUploadedFile = toCacheValues.current.find(
          (form) => form.formId === selectedFile.formId
        );

        let pushObj = { ...getFormDetailsForUploadedFile };

        if (selectedFile?.savedFormCdnPath) {
          //we are saving the uploaded file's path inside savedformCdnPath in BaseAdditionalInfoUpload
          pushObj.cachedSavedFormCdnPath = selectedFile.savedFormCdnPath;
          pushObj.savedFormName = selectedFile.savedFormName;
          pushObj.candidateId = selectedFile.candidateId;
        }

        tempCacheVals.push(pushObj);
      });

      let newValue = [];

      toCacheValues.current.forEach((form) => {
        let ifPresent = tempCacheVals.find(
          (cache) => cache.formId === form.formId
        );

        if (ifPresent) {
          newValue.push(ifPresent);
        } else {
          newValue.push(form);
        }
      });

      toCacheValues.current = [...newValue];
      return newValue;
    }
    return toCacheValues.current;
  };

  return (
    <StyledBasePaper>
      {!loading &&
      !candidateSectionLoading &&
      ADDITIONAL_INFORMATION_DATA.length ? (
        <>
          <Box mb={2}>
            {!(
              ADDITIONAL_INFORMATION_DATA &&
              ADDITIONAL_INFORMATION_DATA[0]?.savedFormCdnPath
            ) ? (
              <AlertMessageComponent
                cond={() => {
                  return !(
                    ADDITIONAL_INFORMATION_DATA &&
                    ADDITIONAL_INFORMATION_DATA[0]?.savedFormCdnPath
                  );
                }}
                CONSTANT="ADDITIONAL_INFORMATION"
                toCacheValues={toCacheValues.current}
                sectionDetails={ADDITIONAL_INFORMATION_DATA}
                runBeforeDispatch={() =>
                  updatePayloadForCaching(uploadedfilesRef.current)
                }
                disableBtn={disableBtn}
              />
            ) : null}
          </Box>

          <DisplaySectionHeading
            icon={sectionData?.section?.sectionIcon}
            text={`${sectionData?.section?.candidateRequiredInfoText}.`}
          />

          <Box display="flex" alignItems="center" mb={4}>
            <Typography variant="h5" marginLeft="0.5rem">
              Please click on below form to download to fill, sign and upload
              back.
            </Typography>
          </Box>

          <Stack
            spacing={3}
            sx={{
              backgroundColor: (theme) => theme.palette.grey[200],
              borderRadius: "12px",
            }}
            pb={2}
            px={3}
          >
            <Grid xs={12} item>
              <Typography
                fontSize="1rem"
                fontWeight="500"
                color={(theme) => theme.palette.grey[700]}
              >
                {ADDITIONAL_INFORMATION_DATA?.formDescription}
              </Typography>
            </Grid>
            {ADDITIONAL_INFORMATION_DATA?.map((form, index) => (
              <Grid xs={12} item key={index}>
                <Box
                  p={2}
                  width={"100%"}
                  display="flex"
                  alignItems="center"
                  flexDirection={{ xs: "column", md: "row" }}
                  justifyContent={{ xs: "center", sm: "flex-start" }}
                  textAlign="center"
                  backgroundColor={(theme) => theme.palette.grey[100]}
                  borderRadius="10px"
                >
                  {/* <CustomTooltip title="View Form">
                        <a
                          href={form.formCdnPath}
                          target="_blank"
                          style={{ marginTop: "5px", marginRight: "5px" }}
                        >
                          <AssignmentReturnedOutlined />
                        </a>
                      </CustomTooltip> */}
                  <Typography fontWeight="500" variant="h4">
                    <a href={form.formCdnPath} target="_blank">
                      {form.formName}
                    </a>
                  </Typography>
                  <BaseAdditionalInfoUpload
                    key={index}
                    uploadFiles={uploadFiles}
                    setUploadFiles={setUploadFiles}
                    formId={form.formId}
                    toCacheValues={toCacheValues}
                    accordionStateIndex={accordionStateIndex}
                    setAccordionStateIndex={setAccordionStateIndex}
                    candidateId={candidateId}
                    setDisableBtn={setDisableBtn}
                  />
                </Box>
                {/* <BaseAccordion
                  key={index}
                  index={index}
                  // expanded={
                  //   accordionStateIndex === form.formId && form.formId === 1
                  // }
                  onChange={(status) =>
                    handleAccordionStatus(status, form.formId)
                  }
                  headerbg={theme.palette.accordion.bg}
                  bordercolor={theme.palette.accordion.border}
                  noPaddingInAccordionDetails
                  // helpText={
                  //   <Box display="flex" alignItems="center">
                  //     <PlaceOutlined />
                  //     <Typography fontSize={"18px"} marginLeft="0.5rem">
                  //       hello
                  //     </Typography>
                  //   </Box>
                  // }
                  header={(header) => (
                    <Box
                      px={{ xs: 1, md: 4 }}
                      width={"100%"}
                      display="flex"
                      alignItems="center"
                      flexDirection={{ xs: "column", md: "row" }}
                      justifyContent={{ xs: "center", sm: "flex-start" }}
                      textAlign="center"
                    >
                      {/* <CustomTooltip title="View Form">
                        <a
                          href={form.formCdnPath}
                          target="_blank"
                          style={{ marginTop: "5px", marginRight: "5px" }}
                        >
                          <AssignmentReturnedOutlined />
                        </a>
                      </CustomTooltip> */}
                {/* <Typography fontWeight="500" variant="h4">
                        <a href={form.formCdnPath} target="_blank">
                          {form.formName}
                        </a>
                      </Typography>
                      <BaseAdditionalInfoUpload
                        key={index}
                        uploadFiles={uploadFiles}
                        setUploadFiles={setUploadFiles}
                        formId={form.formId}
                        toCacheValues={toCacheValues}
                        accordionStateIndex={accordionStateIndex}
                        setAccordionStateIndex={setAccordionStateIndex}
                        candidateId={candidateId}
                        setDisableBtn={setDisableBtn}
                      />
                    </Box>
                  )}
                > */}
                {/* <Box p={{ xs: 1, md: 4 }}>
                      <EditablePdfForm
                        theme={theme}
                        formId={form.formId}
                        uploadFiles={uploadFiles}
                        toCacheValues={toCacheValues}
                        setUploadFiles={setUploadFiles}
                      />
                    </Box> */}
                {/* </BaseAccordion> */}
                {ADDITIONAL_INFORMATION_DATA.length - 1 !== index && (
                  <Box mt={3} px={3}>
                    <Divider />
                  </Box>
                )}
              </Grid>
            ))}
          </Stack>
          {apiErrorMsg && (
            <Typography
              mt={2}
              color="error"
              style={{ textTransform: "capitalize" }}
            >
              {apiErrorMsg}*
            </Typography>
          )}
        </>
      ) : (
        <CircularLoader />
      )}
    </StyledBasePaper>
  );
};

export { CandidateAdditionalInformation };
