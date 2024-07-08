import { useState, useEffect } from "react";
import { Field, Formik, Form } from "formik";
import {
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Switch,
  Box,
} from "@mui/material";
import { InputTextField } from "../../common/Form/InputTextField/InputTextField";
import DropZone from "../../common/dropZone/DropZone";
import SaveIcon from "@mui/icons-material/Save";
import PanelCard from "../../common/cards/PanelCard";
import HrTabNav from "./HrTabNav";
import { useDispatch } from "react-redux";
import { getLoggedInUserHrOrganizationId } from "../../utils/UserHelper";
import ScrollableGrid from "../../common/ScrollableGrid";
import { useTheme } from "@mui/material/styles";
import {
  getCompanyBranding,
  updateCompanyBranding,
} from "../../store/actions/hrActions";
import { InfoOutlined } from "@mui/icons-material";
import * as Yup from "yup";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction";

const CompanyBranding = () => {
  const [companyData, setCompanyData] = useState({});
  const [uploadedLogo, setUploadedLogo] = useState(null);
  const dispatch = useDispatch();
  // const scriptedRef = useScriptRef();
  const [showAccordion, setShowAccordion] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    let params = {
      orgId: getLoggedInUserHrOrganizationId(), //should be coming from current user details.
    };

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(
      getCompanyBranding(
        params,
        setCompanyData,
        (res) => {
          setShowAccordion(res?.isCustomBranding);
          setUploadedLogo(
            res?.hrOrganizationLogo !== null
              ? window?.atob(res?.hrOrganizationLogo)
              : null
          );
        },
        logDetails
      )
    );
  }, []);

  const updateCompanyState = () => {
    let params = {
      orgId: getLoggedInUserHrOrganizationId(), //should be coming from current user details.
    };
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "updateCompanyState"
    );
    dispatch(getCompanyBranding(params, setCompanyData, () => {}, logDetails));
  };

  const SwitchField = ({ form, field }) => {
    const { name, value } = field;
    const { setFieldValue } = form;

    return (
      <Switch
        name={name}
        label={name}
        onChange={(e) => {
          setShowAccordion(!value);
          setFieldValue(name, !value);
        }}
        size="small"
        onClick={(e) => e.stopPropagation()}
        checked={value}
      />
    );
  };

  return (
    <ScrollableGrid
      container
      spacing={2}
      screen="xl"
      scrollHeight="85vh"
      height="100%"
    >
      <Grid item md={2} xs={12} mt={{ xs: 10, md: 0 }}>
        <PanelCard>
          <HrTabNav value={0} />
        </PanelCard>
      </Grid>
      <ScrollableGrid item md={10}>
        <PanelCard>
          <Grid item xs={12}>
            <Formik
              enableReinitialize={true}
              initialValues={companyData}
              validationSchema={Yup.object().shape({
                hrOrganizationName: Yup.string().max(
                  50,
                  "Should not exceed 50 characters"
                ),
              })}
              onSubmit={async (
                values,
                { setErrors, setStatus, setSubmitting }
              ) => {
                try {
                  let customizedParams = {
                    hrOrganizationName: values?.hrOrganizationName,
                    isCustomBranding: values?.isCustomBranding,
                    hrOrganizationDisplayName: values?.hrOrganizationDisplayName
                      ? values?.hrOrganizationDisplayName
                      : values?.hrOrganizationName,
                    hrOrganizationLogo: uploadedLogo?.length
                      ? uploadedLogo
                      : null,
                  };

                  let logDetails = getCurrentFileNameAndFunction(
                    import.meta.url,
                    "onSubmit"
                  );

                  dispatch(
                    updateCompanyBranding(
                      customizedParams,
                      values?.hrOrganizationsId,
                      updateCompanyState,
                      (err) => {
                        setStatus({ success: false });
                        setErrors({ submit: err.message });
                        setSubmitting(false);
                      },
                      logDetails
                    )
                  );
                } catch (err) {
                  setStatus({ success: false });
                  setErrors({ submit: err.message });
                  setSubmitting(false);
                }
              }}
            >
              {({ values, errors, touched, setFieldValue }) => (
                <Form>
                  <Grid container item xs={12} padding="20px">
                    <Grid
                      container
                      item
                      display="flex"
                      flexDirection={{ sx: "column", sm: "row" }}
                      alignItems="center"
                    >
                      <Grid
                        item
                        xs={12}
                        sm={3}
                        style={{
                          color: theme.palette.grey[700],
                          wordBreak: "break-word",
                        }}
                      >
                        Company/Organization Name
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <Field
                          name="hrOrganizationName"
                          placeholder="Enter Company/Organization Name"
                          error={
                            touched.hrOrganizationName &&
                            errors.hrOrganizationName
                              ? errors.hrOrganizationName
                              : ""
                          }
                          required
                          component={InputTextField}
                        />
                      </Grid>
                    </Grid>
                    <Grid container item padding="30px 0px">
                      <Accordion
                        style={{
                          width: "100%",
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                          backgroundColor: theme.palette.background.paper,
                          border: "1px solid rgba(82, 122, 251, 0.17)",
                        }}
                        expanded={showAccordion}
                      >
                        <AccordionSummary
                          style={{
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                            borderBottom: 0,
                            backgroundColor: theme.palette.primary[100],
                            cursor: "default",
                          }}
                        >
                          <Grid container display={"contents"} column={16}>
                            <Grid item xs={12}>
                              <Typography
                                variant="h5"
                                sx={{
                                  width: "95%",
                                  flexShrink: 0,
                                }}
                              >
                                We would love to give you a touch of your
                                corporate brand Personalization In case you wish
                                to display your Corporate branding please opt in
                                now?
                              </Typography>
                            </Grid>
                            <Grid item display={"contents"} xs={5}>
                              <Field
                                name={`isCustomBranding`}
                                component={SwitchField}
                              />
                            </Grid>
                          </Grid>
                        </AccordionSummary>
                        <Grid
                          container
                          item
                          padding="12px 30px 20px 30px"
                          style={{ gap: "30px" }}
                        >
                          <Grid item sx={8}>
                            <Typography
                              variant="body1"
                              style={{
                                fontWeight: "500",
                                fontSize: "13px",
                                fontStyle: "italic",
                              }}
                            >
                              Display name will be used for email communications
                              to candidates and any branding wordings, logo will
                              be used for branding of verification report and
                              email notifications.
                            </Typography>
                          </Grid>
                          <Grid
                            xs={12}
                            container
                            item
                            flexDirection={{ sx: "column", sm: "row" }}
                            alignItems="center"
                          >
                            <Grid
                              item
                              xs={12}
                              sm={3}
                              style={{
                                color: theme.palette.grey[700],
                                wordBreak: "break-word",
                              }}
                            >
                              Company Display Name
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <Field
                                name="hrOrganizationDisplayName"
                                placeholder="Enter Company Display Name"
                                error={
                                  touched.hrOrganizationDisplayName &&
                                  errors.hrOrganizationDisplayName
                                }
                                component={InputTextField}
                              />
                            </Grid>
                          </Grid>
                          <Grid
                            container
                            flexDirection={{ sx: "column", sm: "row" }}
                            padding="18px"
                            sx={{
                              background: "#EAEFFF",
                              borderRadius: "12px",
                            }}
                          >
                            <DropZone setUploadedLogo={setUploadedLogo} />
                            <Grid
                              container
                              item
                              xs={12}
                              sm={uploadedLogo?.length ? 6 : 9}
                              direction="column"
                              style={{ color: theme.palette.grey[700] }}
                            >
                              <Box display="flex" alignItems="center" p={0.5}>
                                <Box>
                                  <InfoOutlined
                                    sx={{ margin: "5px 5px 0 0" }}
                                  />
                                </Box>
                                <Box>
                                  <Typography>
                                    Recommended size is 300 x 100.
                                  </Typography>
                                </Box>
                              </Box>
                              <Box display="flex" alignItems="center" p={0.5}>
                                <Box>
                                  <InfoOutlined sx={{ margin: "0 5px 0 0" }} />
                                </Box>
                                <Box>
                                  <Typography>
                                    Please use only .JPG, .JPEG, .PNG file with
                                    transparent or white background.
                                  </Typography>
                                </Box>
                              </Box>
                              <Box display="flex" alignItems="center" p={0.5}>
                                <Box>
                                  <InfoOutlined
                                    sx={{ margin: "5px 5px 0 0" }}
                                  />
                                </Box>
                                <Box>
                                  <Typography>
                                    Max size allowed is 1 MB.
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                            {uploadedLogo?.length && (
                              <Grid
                                container
                                item
                                xs={12}
                                sm={3}
                                direction="column"
                                style={{ color: theme.palette.grey[700] }}
                              >
                                <img
                                  src={uploadedLogo}
                                  name="hrOrganizationLogo"
                                  alt="logo preview"
                                  loading="lazy"
                                  width="100%"
                                  height="100px"
                                />
                              </Grid>
                            )}
                          </Grid>
                        </Grid>
                      </Accordion>
                    </Grid>

                    <Grid
                      container
                      sx={{
                        justifyContent: "end",
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        endIcon={<SaveIcon />}
                        disableElevation
                      >
                        save
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Grid>
        </PanelCard>
      </ScrollableGrid>
    </ScrollableGrid>
  );
};

export default CompanyBranding;
