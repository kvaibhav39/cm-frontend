import React, { useEffect } from "react";
import { Box, Stack, Typography, Grid, Divider, Button } from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useState } from "react";
import { ERROR } from "../../store/constant";
import { setToastNotification } from "../../store/actions/toastNotificationActions";
import { useDispatch } from "react-redux";
import { uploadingFiles } from "../Candidate/utils/uploadingFiles";
import { HourglassTop, CheckCircleOutline } from "@mui/icons-material";
import { CANDIDATE_SECTION_DISABLE_SUBMTI_BTN } from "../../store/actions/actionTypes";
import { getFileNameWithEllipsis } from "../../utils/getFileNameWithEllipsis";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction";

const BaseAdditionalInfoUpload = ({
  uploadFiles,
  setUploadFiles,
  formId,
  toCacheValues,
  accordionStateIndex,
  setAccordionStateIndex,
  candidateId,
  setDisableBtn = () => {},
}) => {
  const [fileData, setFileData] = useState({
    formId,
    fileName: "",
    status: "",
  });

  // const fileObjectToGetName = uploadFiles.find(
  //   (curr) => curr?.formId === formId
  // );
  // const fileNameToDisplay = fileObjectToGetName?.savedFormName;

  useEffect(() => {
    if (
      fileData?.formId === formId &&
      !fileData?.fileName &&
      uploadFiles?.length
    ) {
      let newFileData = {
        formId,
        fileName: uploadFiles?.find((curr) => curr?.formId === formId)
          ?.savedFormName,
        status: "uploaded",
      };

      setFileData((prev) => (prev = newFileData));
    }
  }, [uploadFiles]);

  const dispatch = useDispatch();

  const handleFileUpload = async (e) => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleFileUpload"
    );

    if (e.target.files[0]?.name?.length > 100) {
      return dispatch(
        setToastNotification(ERROR, "File Name is Too Long!", logDetails)
      );
    }

    if (
      e.target.files[0]?.type.includes("pdf") ||
      e.target.files[0]?.type.includes("jpg") ||
      e.target.files[0]?.type.includes("jpeg") ||
      e.target.files[0]?.type.includes("png")
    ) {
      //disabling next & save progress btn
      dispatch({ type: CANDIDATE_SECTION_DISABLE_SUBMTI_BTN, payload: true });
      setDisableBtn(true);

      //making status to pending
      let newFileData = {
        formId,
        fileName: e.target.files[0].name,
        status: "pending",
      };
      setFileData((prev) => (prev = newFileData));

      //uploading file
      let savedFormCdnPath = await uploadingFiles(
        e.target.files[0],
        dispatch,
        [],
        // "EDUCATION_DOCS",
        "ADDITIONAL_INFORMATION",
        "additional-info"
      );

      if (!savedFormCdnPath) {
        setFileData({
          formId,
          fileName: "",
          status: "",
        });

        dispatch(
          setToastNotification(
            ERROR,
            "An error occurred, please try again!",
            logDetails
          )
        );

        dispatch({
          type: CANDIDATE_SECTION_DISABLE_SUBMTI_BTN,
          payload: false,
        });

        return setDisableBtn(false);
      }

      //opening editable pdf accordion
      setAccordionStateIndex(formId);

      //parent state which handles all the files
      let temp1 = [...uploadFiles];
      let temp2 = temp1.filter((curr) => curr?.formId !== formId);

      setUploadFiles([
        ...temp2,
        {
          formId,
          savedFormName: e.target.files[0].name,
          candidateId,
          savedFormCdnPath,
        },
      ]);

      //making status to uploaded
      newFileData = {
        formId,
        fileName: e.target.files[0].name,
        status: "uploaded",
      };

      setFileData((prev) => (prev = newFileData));

      //enabling next & save progress btn
      dispatch({ type: CANDIDATE_SECTION_DISABLE_SUBMTI_BTN, payload: false });
      return setDisableBtn(false);
    } else {
      return dispatch(
        setToastNotification(
          ERROR,
          "Please upload a valid pdf / jpg / jpeg / png file",
          logDetails
        )
      );
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection={{ xs: "column", md: "row" }}
    >
      <Box my={{ xs: 2 }} mx={4}>
        <input
          name={`fileUpload-${formId}`}
          id={`fileUpload-${formId}`}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileUpload}
          onClick={(e) => {
            e.target.value = null;
          }}
        />
        <label htmlFor={`fileUpload-${formId}`}>
          <Button color="primary" variant="outlined" component="span">
            Upload
          </Button>
        </label>
      </Box>
      {fileData?.formId === formId && fileData?.fileName && (
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography mr={1} variant="h5">
            {getFileNameWithEllipsis(fileData?.fileName)}
          </Typography>

          <Box mx={1}>
            {fileData?.status === "pending" ? (
              <HourglassTop />
            ) : (
              <CheckCircleOutline color="success" />
            )}
          </Box>

          <DeleteOutlineOutlinedIcon
            style={{ cursor: "pointer" }}
            sx={{
              color: (theme) => theme.palette.error.main,
              marginTop: "-5px",
            }}
            onClick={(e) => {
              let temp = uploadFiles.filter((curr) => curr.formId !== formId);
              setUploadFiles([...temp]);

              //closing respective accordion if file gets deleted
              if (accordionStateIndex === formId) {
                setAccordionStateIndex(null);
              }

              //reseting file data state
              let resetFileData = {
                formId,
                fileName: "",
                status: "uploaded",
              };
              setFileData(resetFileData);

              //removing caching of the respective form
              toCacheValues.current?.forEach((curr) => {
                if (curr.formId === formId) {
                  delete curr.cachedSavedFormCdnPath;
                  delete curr.candidateId;
                  curr.savedFormName = null;
                }
              });
              e.stopPropagation();
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default BaseAdditionalInfoUpload;
