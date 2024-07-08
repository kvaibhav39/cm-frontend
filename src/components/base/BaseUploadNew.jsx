import React, { useCallback, memo } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Grid, Stack, styled, Typography } from "@mui/material";
import { useState } from "react";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useEffect } from "react";
import { setToastNotification } from "../../store/actions/toastNotificationActions";
import { ERROR } from "../../store/constant";
import { useDispatch } from "react-redux";
import { useRef } from "react";
import { useTheme } from "@mui/material/styles";
import _ from "lodash";
import { HourglassTop, CheckCircleOutline } from "@mui/icons-material";
import { CANDIDATE_SECTION_DISABLE_SUBMTI_BTN } from "../../store/actions/actionTypes";
import { getFileNameWithEllipsis } from "../../utils/getFileNameWithEllipsis";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction.js";

const StyledBaseUpload = styled(Box)`
  position: relative;
  .bu-header {
    z-index: 1;
    display: flex;
    min-height: 56px;
    align-items: center;
    background-color: ${(v) => `${v.headerbg || "white"}`};
  }
  .bu-body {
    position: relative;
    text-align: center;
    margin-top: -1rem;
    background-color: ${(v) => `${v.bg || "white"}`};
  }
  .bu-body,
  .bu-header {
    position: relative;
    border-radius: ${(v) => `${v.radius || "12px"}`};
    border: 1px solid ${(v) => `${v.bordercolor || "#dadce0"}`};
  }
  .bu-upload-icon {
    width: 48px;
    height: 48px;
  }
`;

const RenderUploadedFile = memo(
  ({
    uploadFiles,
    imgRef,
    radius,
    label,
    onChange,
    categoryName,
    form,
    setDisableBtn,
    attachFileErr = [],
    setAttachFileErr = () => {},
    ...props
  }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const uploadFilesRef = useRef();
    uploadFilesRef.current = uploadFiles;

    //checks if the file is already present in the state as we are not allowing a user to upload the same files
    const toCheckIfFileIsAlreadyPresent = (sentFile) => {
      let flag = false;
      uploadFilesRef.current?.find((file) => {
        if (
          props.multiple
            ? (file.attachmentName === sentFile.name ||
                file.file?.name === sentFile.name ||
                file.file?.path === sentFile.name) &&
              file.attachmentCategoryName === categoryName
            : file.attachmentName === sentFile.name ||
              file.file?.name === sentFile.name ||
              file.file?.path === sentFile.name
        ) {
          flag = true;
        }
      });

      return flag;
    };

    //react drop zone onDrop func listens to the dropped files
    const onDrop = useCallback((acceptedFiles) => {
      //to retrieve previous array so that when we add new files it just appends with old values
      let tempForOnChange = [];
      let newTemp = [];
      let flagInvalid = false;
      dispatch({ type: CANDIDATE_SECTION_DISABLE_SUBMTI_BTN, payload: true });
      let logDetails = getCurrentFileNameAndFunction(import.meta.url, "onDrop");

      acceptedFiles.forEach((file) => {
        if (!toCheckIfFileIsAlreadyPresent(file)) {
          let icon;

          if (file?.name?.length > 100) {
            dispatch(
              setToastNotification(ERROR, "File Name is Too Long!", logDetails)
            );
            flagInvalid = true;
            return dispatch({
              type: CANDIDATE_SECTION_DISABLE_SUBMTI_BTN,
              payload: false,
            });
          }

          if (
            file.type.includes("jpg") ||
            file.type.includes("jpeg") ||
            file.type.includes("png")
          ) {
            icon = <PermMediaOutlinedIcon />;
          } else if (file.type.includes("pdf")) {
            icon = <PictureAsPdfOutlinedIcon />;
          } else if (file.type.includes("doc") || file.type.includes("docx")) {
            icon = <ArticleOutlinedIcon />;
          } else {
            dispatch(
              setToastNotification(
                ERROR,
                "Please Upload a Valid File",
                logDetails
              )
            );
            flagInvalid = true;
            dispatch({
              type: CANDIDATE_SECTION_DISABLE_SUBMTI_BTN,
              payload: false,
            });

            return;
          }

          if (props.multiple) {
            newTemp.push({
              file,
              icon,
              attachmentCategoryName: categoryName,
              status: "pending",
            });
          } else {
            newTemp = [
              {
                file,
                icon,
              },
            ];
          }

          tempForOnChange.push({ file, attachmentCategoryName: categoryName });

          if (props.multiple) {
            let tempAttachFileArr = attachFileErr?.filter(
              (curr) => curr.errFileName !== props?.checkName
            );

            setAttachFileErr(tempAttachFileArr);
          } else {
            setAttachFileErr(false);
          }
        } else {
          dispatch({
            type: CANDIDATE_SECTION_DISABLE_SUBMTI_BTN,
            payload: false,
          });
          dispatch(
            setToastNotification(ERROR, "File already added!", logDetails)
          );
        }

        //to remove icon field and only have file in props.multiple inside onChange
      });

      if (!flagInvalid) {
        //disabling next and save progress btn
        setDisableBtn(true);

        if (props.multiple) {
          form.setFieldValue(props?.checkName, [
            ...uploadFilesRef.current,
            ...newTemp,
          ]);
          onChange([...tempForOnChange]);
        } else {
          form.setFieldValue(props?.checkName, [...newTemp]);
          onChange(acceptedFiles);
        }
      }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    //handles remove btn aside the file names
    const handleRemove = (name1, categoryName1, index) => {
      let tempFiles = uploadFiles.filter((pf) => {
        if (
          !(
            (pf?.attachmentName === name1 ||
              pf?.name === name1 ||
              pf?.file?.name === name1) &&
            (pf?.attachmentCategoryName === categoryName1 ||
              pf?.file?.attachmentCategory === categoryName1 ||
              pf?.file?.categoryName === categoryName1)
          )
        )
          return pf;
      });

      form.setFieldValue(props.checkName, tempFiles);
      onChange(null, { name1, categoryName1 });
    };

    return (
      <StyledBaseUpload
        bg={theme.palette.accordion.bg}
        radius={radius}
        headerbg={theme.palette.grey[100]}
        bordercolor={theme.palette.grey[400]}
        {...props}
      >
        {props.multiple && attachFileErr?.length
          ? attachFileErr.map(
              (curr, ind) =>
                curr.errFileName === props?.checkName && (
                  <Typography
                    key={ind}
                    color={theme.palette.error.main}
                    fontSize={{ xs: "16px", md: "17px" }}
                    style={{ wordBreak: "break-word", marginTop: "-20px" }}
                  >
                    Please Attach a File*
                  </Typography>
                )
            )
          : null}

        <Box
          className="bu-header"
          p={{ xs: 2, md: "0.5rem 2rem" }}
          id={props.id}
          mt={1}
          display="flex"
          justifyContent="space-between"
        >
          <Typography
            fontWeight={600}
            fontSize={{ xs: "16px", md: "17px" }}
            style={{ wordBreak: "break-word" }}
          >
            {label}
          </Typography>
          {!props.multiple && uploadFiles?.length ? (
            <DeleteOutlineOutlinedIcon
              style={{ cursor: "pointer" }}
              sx={{ color: theme.palette.error.main }}
              onClick={() => onChange(null, { categoryName }, "all")}
            />
          ) : (
            <>
              {uploadFiles?.length &&
              uploadFiles.find(
                (curr) => curr.attachmentCategoryName === categoryName
              ) ? (
                <DeleteOutlineOutlinedIcon
                  style={{ cursor: "pointer" }}
                  sx={{ color: theme.palette.error.main }}
                  onClick={() => {
                    let tempAllFiles = uploadFiles.filter(
                      (curr) => curr.attachmentCategoryName !== categoryName
                    );
                    onChange(null, { categoryName }, "all");
                    form.setFieldValue(props.checkName, tempAllFiles);
                  }}
                />
              ) : null}
            </>
          )}
        </Box>
        <Grid container>
          <Grid
            item
            xs={12}
            md={6}
            className="bu-body"
            p={{ xs: 2, md: "4rem 6rem 3rem 4rem" }}
            style={{ cursor: "pointer" }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              color={theme.palette.primary.main}
              className="bu-upload-icon feather feather-upload"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <Typography variant="h4" my={1} color={theme.palette.grey[700]}>
              Click to{" "}
              <Typography variant="span" sx={{ fontSize: "1rem" }}>
                Select File
              </Typography>{" "}
              or Drop File(s) Here
            </Typography>
            <Typography variant="p" sx={{ wordBreak: "break-word" }}>
              Your file should be in one of these
              formats(.pdf,.doc,.docx,.jpg,.jpeg,.png)
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            p={{ xs: 2, md: "4rem 6rem 3rem 4rem" }}
            direction="column"
            spacing={2}
            className="bu-body"
          >
            {!props.multiple && uploadFiles?.length ? (
              <Typography
                key={props?.checkName}
                sx={{
                  color: theme.palette.grey[700],
                  wordBreak: "break-word",
                }}
                display="flex"
                alignItems="center"
                mb={1}
              >
                <Grid item xs={2}>
                  {uploadFiles[0]?.icon}
                </Grid>
                <Grid item xs={7} textAlign="left" ml={1}>
                  {uploadFiles[0]?.path}
                </Grid>
                <Grid item xs={2}>
                  <DeleteOutlineOutlinedIcon
                    style={{ cursor: "pointer" }}
                    sx={{ color: theme.palette.error.main }}
                    onClick={() => onChange(null, { categoryName }, "all")}
                  />
                </Grid>
              </Typography>
            ) : (
              <>
                {uploadFiles?.map(
                  (file, index) =>
                    file.attachmentCategoryName === categoryName && (
                      <Typography
                        key={index}
                        sx={{
                          color: theme.palette.grey[700],
                          wordBreak: "break-word",
                        }}
                        display="flex"
                        alignItems="center"
                        mb={1}
                      >
                        <Grid item xs={2}>
                          {file.icon}
                        </Grid>
                        <Grid item xs={7} textAlign="left" ml={1}>
                          {getFileNameWithEllipsis(
                            file?.attachmentName ||
                              file?.file?.name ||
                              file?.file?.file?.name
                          )}
                        </Grid>
                        <Grid item xs={1} mx={1}>
                          {" "}
                          {file?.status === "pending" ? (
                            <HourglassTop />
                          ) : (
                            <CheckCircleOutline color="success" />
                          )}
                        </Grid>
                        <Grid item xs={1}>
                          <DeleteOutlineOutlinedIcon
                            style={{ cursor: "pointer" }}
                            sx={{ color: theme.palette.error.main }}
                            onClick={() =>
                              handleRemove(
                                file?.attachmentName ||
                                  file?.file?.name ||
                                  file?.file?.file?.name,
                                categoryName,
                                index
                              )
                            }
                          />
                        </Grid>
                      </Typography>
                    )
                )}
              </>
            )}
          </Grid>
        </Grid>
      </StyledBaseUpload>
    );
  },
  (prevProp, nextProp) => {
    return _.isEqual(prevProp.uploadFiles, nextProp.uploadFiles);
  }
);

const BaseUploadNew = ({
  accept = "images/*",
  radius = "12px",
  label = "Upload Your Files",
  onChange = () => {},
  uploadFiles = [],
  categoryName = "",
  form,
  setDisableBtn = () => {},
  ...props
}) => {
  //have used a ref and setting it with the files state
  const imgRef = useRef();

  //File Extension MIME Types
  const MIMEtypes = {
    jpe: "image/jpeg",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    pdf: "application/pdf",
    png: "image/png",
  };

  //will map through the already stored files , coming from the api
  let tempForInitialize = [];
  uploadFiles?.forEach((file) => {
    let icon = <ArticleOutlinedIcon />;
    if (
      MIMEtypes[
        file?.attachmentName?.split(".")[1] || file?.file?.name?.split(".")[1]
      ]?.includes("image")
    ) {
      icon = <PermMediaOutlinedIcon />;
    } else if (
      MIMEtypes[
        file?.attachmentName?.split(".")[1] || file?.file?.name?.split(".")[1]
      ]?.includes("pdf")
    ) {
      icon = <PictureAsPdfOutlinedIcon />;
    }
    tempForInitialize.push({ ...file, icon });
  });

  return (
    <RenderUploadedFile
      uploadFiles={tempForInitialize}
      imgRef={imgRef}
      radius={radius}
      label={label}
      onChange={onChange}
      categoryName={categoryName}
      form={form}
      setDisableBtn={setDisableBtn}
      {...props}
    />
  );
};

export default BaseUploadNew;
