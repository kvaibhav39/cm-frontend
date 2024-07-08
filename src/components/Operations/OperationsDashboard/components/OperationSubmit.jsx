import { FastField, Form } from "formik";
import { Fragment, useEffect } from "react";
import { Button, Box, Grid, Stack, Typography } from "@mui/material";
import { Preview } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { StyledBasePaper } from "../../../base/styled";
import { BaseSelect, BaseTextField } from "../../../base";
import BaseUploadNew from "../../../base/BaseUploadNew";
import { OPsCandidatesByOrgId } from "../../../../store/actions/operationActions";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction";

const OperationSubmit = ({
  errors,
  touched,
  handleSubmit,
  values,
  setFieldValue,
  setFileUploadError,
  fileUploadError,
  tempRef,
  setOpsComponent,
}) => {
  const dispatch = useDispatch();
  const { OPsCandidatesByOrgIdLists } = useSelector(
    (state) => state.operations
  );

  useEffect(async () => {
    tempRef.current = true;
    setFieldValue("candidatesList", OPsCandidatesByOrgIdLists);
    setFieldValue("candidatesCasesId", null);
    await Promise.resolve();
    setTimeout(() => {
      tempRef.current = false;
    }, 500);
  }, [OPsCandidatesByOrgIdLists]);

  useEffect(() => {
    tempRef.current = true;
    setTimeout(() => {
      tempRef.current = false;
    }, 500);
  }, [values]);

  useEffect(() => {
    if (values.hrOrganizationsId) {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      dispatch(
        OPsCandidatesByOrgId(
          values.hrOrganizationsId,
          {
            fromDate: "1971-01-01",
            toDate: "3000-01-01",
            hrTeamId: "All",
          },
          logDetails
        )
      );
    }
  }, [values.hrOrganizationsId]);

  return (
    <Fragment>
      <StyledBasePaper>
        <Box p={{ xs: 0, md: 1 }}>
          <Box display="flex" alignItems="center">
            <Typography variant="h4" marginLeft="0.5rem">
              Operation Submission
            </Typography>
          </Box>
          <Stack
            mt={{ xs: 3, md: 4 }}
            spacing={3}
            sx={{ backgroundColor: "#F3F3F3", borderRadius: "12px" }}
            p={4}
          >
            <Form>
              <Grid
                container
                item
                xs={12}
                spacing={3}
                sx={{ justifyContent: "center" }}
              >
                <Grid
                  item
                  xs={12}
                  spacing={2}
                  display="flex"
                  justifyContent="space-around"
                >
                  <Grid item xs={6} md={2.5}>
                    <FastField
                      component={BaseSelect}
                      shouldUpdate={() => {
                        if (tempRef?.current) {
                          return true;
                        } else {
                          return false;
                        }
                      }}
                      label="Organizations*"
                      optionLabel="hrOrganizationName"
                      optionValue="hrOrganizationsId"
                      name={`hrOrganizationsId`}
                      options={values?.organizationsList}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    md={2.5}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item xs={values?.candidatesCasesId ? 11 : 12}>
                      <FastField
                        component={BaseSelect}
                        shouldUpdate={() => {
                          if (tempRef?.current) {
                            return true;
                          } else {
                            return false;
                          }
                        }}
                        label="Candidates*"
                        optionLabel="candidateName"
                        optionValue="candidatesCasesId"
                        name={`candidatesCasesId`}
                        options={values?.candidatesList}
                      />
                    </Grid>
                    {values?.candidatesCasesId && (
                      <Grid item xs={1}>
                        <Preview
                          color="primary"
                          style={{
                            cursor: "pointer",
                            transform: "scale(1.2)",
                            margin: "22 5 0",
                          }}
                          onClick={() => setOpsComponent("view-candidate")}
                        />
                      </Grid>
                    )}
                  </Grid>
                  <Grid item xs={6} md={2.5}>
                    <FastField
                      component={BaseSelect}
                      shouldUpdate={() => {
                        if (tempRef?.current) {
                          return true;
                        } else {
                          return false;
                        }
                      }}
                      label="Process Status*"
                      optionLabel="verificationProcessStatusName"
                      optionValue="candidatesVerificationProcessStatusId"
                      name={`candidatesVerificationProcessStatusId`}
                      options={values?.processStatus}
                    />
                  </Grid>
                  <Grid item xs={6} md={2.5}>
                    <FastField
                      component={BaseSelect}
                      shouldUpdate={() => {
                        if (tempRef?.current) {
                          return true;
                        } else {
                          return false;
                        }
                      }}
                      label="Result Status*"
                      optionLabel="verificationResultStatusName"
                      optionValue="candidatesVerificationResultStatusId"
                      name={`candidatesVerificationResultStatusId`}
                      options={values?.resultStatus}
                    />
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  spacing={2}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-around"
                >
                  <Grid item xs={12} md={5.5}>
                    {fileUploadError && (
                      <Typography
                        color="red"
                        fontSize={{ xs: "16px", md: "17px" }}
                        style={{ wordBreak: "break-word", marginTop: "-20px" }}
                      >
                        Please Attach a File*
                      </Typography>
                    )}
                    <BaseUploadNew
                      uploadFiles={values.report}
                      label="Upload Your File"
                      onChange={async (files) => {
                        // console.log("files", files);
                        setFileUploadError(false);

                        if (files) {
                          setFieldValue("report", files);
                        } else {
                          setFieldValue("report", []);
                        }

                        await Promise.resolve();
                      }}
                      form={{ setFieldValue }}
                      checkName="report"
                      attachFileErr={fileUploadError}
                      setAttachFileErr={setFileUploadError}
                    />
                  </Grid>
                  <Grid item xs={12} md={5.5}>
                    <FastField
                      component={BaseTextField}
                      rows={8}
                      multiline
                      name="verificationResultComment"
                      placeholder="Comment"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} display="flex" justifyContent="center" mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  disableElevation
                  disabled={false}
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              </Grid>
            </Form>
          </Stack>
        </Box>
      </StyledBasePaper>
    </Fragment>
  );
};

export default OperationSubmit;
