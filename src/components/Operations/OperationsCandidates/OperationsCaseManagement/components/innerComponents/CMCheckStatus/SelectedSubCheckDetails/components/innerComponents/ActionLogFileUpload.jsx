import React from "react";
import UploadFileComponent from "./UploadFileComponent";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { WarningAmber } from "@mui/icons-material";
import { uniqueId } from "lodash";

const ActionLogFileUpload = ({
  fileUploadFormRef,
  disableSubmitBtn,
  setDisableSubmitBtn,
  handleSubmit,
}) => {
  return (
    <Formik
      enableReinitialize
      initialValues={{ files: [], attachFileToReport: {} }}
      innerRef={fileUploadFormRef}
    >
      {(form) => (
        <Form>
          <Grid item xs={12} sx={{ width: "100%" }}>
            <Box
              sx={{
                width: "100%",
                borderRadius: "5px",
                background: (theme) => `${theme.palette.grey[100]}`,
              }}
              display="flex"
              flexDirection="column"
              p={1.5}
            >
              {form.values?.files?.length ? (
                <Box
                  sx={{
                    width: "100%",
                    borderRadius: "5px",
                    background: "#FFF6E1",
                  }}
                  p={0.5}
                  display="flex"
                  alignItems="center"
                  mb={1}
                >
                  <WarningAmber sx={{ color: "#F59008" }} />{" "}
                  <Typography
                    fontWeight={550}
                    ml={1}
                    fontSize={12}
                    color="#F59008"
                  >
                    To attach any file to the report, select the corresponding
                    checkbox.
                  </Typography>
                </Box>
              ) : null}
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <UploadFileComponent
                  id={uniqueId()}
                  setFieldValue={form.setFieldValue}
                  setDisableBtn={setDisableSubmitBtn}
                  values={form.values}
                />
                <Button
                  variant="contained"
                  disabled={disableSubmitBtn}
                  onClick={handleSubmit}
                >
                  {" "}
                  Submit
                </Button>
              </Box>
            </Box>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default ActionLogFileUpload;
