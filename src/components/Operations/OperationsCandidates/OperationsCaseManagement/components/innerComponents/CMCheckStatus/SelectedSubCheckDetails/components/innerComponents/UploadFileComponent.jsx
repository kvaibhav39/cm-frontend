import {
  Box,
  Button,
  Checkbox,
  Grid,
  Typography,
  InputLabel,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import { uploadingFiles } from "../../../../../../../../../Candidate/utils/uploadingFiles";
import { useDispatch } from "react-redux";
import { setToastNotification } from "../../../../../../../../../../store/actions/toastNotificationActions";
import { ERROR } from "../../../../../../../../../../store/constant";
import {
  AttachFile,
  CheckCircleOutline,
  Close,
  HourglassTop,
} from "@mui/icons-material";
import { useEffect } from "react";
import { getFileNameWithEllipsis } from "../../../../../../../../../../utils/getFileNameWithEllipsis";
import CustomTooltip from "../../../../../../../../../common/CustomTooltip";
import { useSearchParams } from "react-router-dom";
import { getCurrentFileNameAndFunction } from "../../../../../../../../../../utils/getCurrentFileNameAndFunction";

const UploadFileComponent = ({ id, setDisableBtn, setFieldValue, values }) => {
  const dispatch = useDispatch();
  const [searchParams, _] = useSearchParams();

  const handleFileUpload = async (e) => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleFileUpload"
    );

    let filesArr = Object.keys(e.target.files).map(
      (key) => e.target.files[key]
    );
    let newFileDataArray = []; // Array to store new file data
    let toUploadFiles = []; //Array to store selected files
    let uploadedFiles = []; //Array to store uploaded files i.e response from api

    let oldUploadFiles = [...values.files];

    for (let file of filesArr) {
      if (
        file.type !== "application/pdf" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/png"
      ) {
        dispatch(
          setToastNotification(
            ERROR,
            "Please select a pdf/image(jpeg or png)!",
            logDetails
          )
        );
      } else {
        if (file?.name?.length > 100) {
          return dispatch(
            setToastNotification(ERROR, "File Name is Too Long!", logDetails)
          );
        }

        //disabling submit btn
        setDisableBtn(true);

        // Making status to pending
        let newFileData = {
          attachmentName: file.name,
          status: "pending",
        };

        let ifAlreadyPresent = oldUploadFiles?.find(
          (curr) => curr.attachmentName === newFileData.attachmentName
        );

        if (ifAlreadyPresent) {
          dispatch(
            setToastNotification(ERROR, "File(s) already added!", logDetails)
          );
        } else {
          setFieldValue("attachFileToReport", {
            ...values.attachFileToReport,
            [file.name]: false,
          });
          newFileDataArray.push(newFileData);
          toUploadFiles.push(file);
        }
      }
    }
    // Update the 'files' array with status 'pending'
    setFieldValue("files", [...oldUploadFiles, ...newFileDataArray]);

    // Uploading file
    await uploadingFiles(
      toUploadFiles,
      dispatch,
      uploadedFiles,
      "EDUCATION_DOCS",
      "",
      () => {},
      { candidateCaseId: +searchParams.get("candidatesCasesId") }
    );

    uploadedFiles.forEach((curr) => {
      let ifPresent = newFileDataArray?.find(
        (val) => val.attachmentName === curr.attachmentName
      );
      if (ifPresent) {
        // Update the status to uploaded
        curr.status = "uploaded";
        delete curr.attachmentCategoryName;
      }
    });

    // Update the 'files' array with status 'uploaded'
    setFieldValue("files", [...oldUploadFiles, ...uploadedFiles]);

    // enabling next & save progress btn
    setDisableBtn(false);
  };

  const handleChangeCheckBox = (fileName) => {
    setFieldValue("attachFileToReport", {
      ...values.attachFileToReport,
      [fileName]: !values.attachFileToReport[fileName],
    });
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap={values?.files?.length ? 2 : null}
    >
      <Box>
        {values?.files?.length
          ? values?.files?.map((fileData) => (
              <Box
                key={fileData.attachmentName}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  background: (theme) => `${theme.palette.primary[100]}`,
                  borderRadius: "5px",
                }}
                p={1}
                mb={1}
              >
                <Checkbox
                  checked={values?.attachFileToReport[fileData?.attachmentName]}
                  onChange={() =>
                    handleChangeCheckBox(fileData?.attachmentName)
                  }
                  color="primary"
                />
                <Typography mr={1} variant="h5">
                  {getFileNameWithEllipsis(fileData?.attachmentName)}
                </Typography>

                <Box mt={0.5}>
                  {fileData?.status === "pending" ? (
                    <HourglassTop />
                  ) : (
                    <CheckCircleOutline color="success" />
                  )}

                  <Close
                    ml={0.5}
                    sx={{
                      transform: "scale(0.6)",
                      cursor: "pointer",
                      color: (theme) => theme.palette.error.main,
                    }}
                    onClick={(e) => {
                      let temp = values.files?.filter(
                        (curr) =>
                          curr.attachmentName !== fileData.attachmentName
                      );
                      setFieldValue("files", [...temp]);

                      e.stopPropagation();
                    }}
                  />
                </Box>
              </Box>
            ))
          : null}
      </Box>
      <Box display="flex" alignItems="center">
        <label htmlFor={`fileUpload-action-log-${id}`}>
          <Button variant="contained" component="span">
            <CustomTooltip title="Attach File(s)">
              <AttachFile
                sx={{
                  transform: "rotate(45deg) scale(0.8)",
                }}
              />
            </CustomTooltip>
          </Button>
        </label>
        <input
          multiple
          name={`fileUpload-action-log-${id}`}
          id={`fileUpload-action-log-${id}`}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileUpload}
          onClick={(e) => {
            e.target.value = null;
          }}
        />
      </Box>
    </Box>
  );
};

export default UploadFileComponent;
