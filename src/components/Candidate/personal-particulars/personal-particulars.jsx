import { useMemo, Fragment, useEffect } from "react";
import { omit } from "lodash";
import { useNavigate } from "react-router-dom";
import {
  FastField,
  FieldArray,
  Formik,
  Form,
  setNestedObjectValues,
} from "formik";
import { StyledBasePaper } from "../../base/styled";
import { PhoneNumberTextField } from "../../../common/Form/PhoneNumberTextField/PhoneNumberTextField";
import {
  IOSSwitch,
  BaseAccordion,
  BaseTextField,
  BaseDatePicker,
  BaseCountrySelect,
  BaseAutocomplete,
  BaseSelect,
} from "../../base";

import { DeleteOutline } from "@mui/icons-material";

import {
  Box,
  Card,
  Grid,
  Button,
  Divider,
  Typography,
  IconButton,
  FormControlLabel,
} from "@mui/material";
import moment from "moment";
import {
  newPersonalParticular,
  newNickName,
  newFormerName,
  newOtherName,
} from "../helpers/initialState/personal-particulars";
import { personalPerticularsValidationSchema } from "../helpers/validationSchema/personal-particulars";
import { getSectionData } from "../utils/getSectionData";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import {
  CANDIDATE_CLEAR_API_ERROR,
  CANDIDATE_SECTION_BACK_URL,
  CANDIDATE_SECTION_SUBMIT_HANDLER,
  PERSONAL_PARTICULAR,
} from "../../../store/actions/actionTypes";
import {
  getLanguages,
  getPersonalParticularData,
  submitCacheCandidateDetails,
  submitCandidateDetails,
} from "../../../store/actions/candidateAction";
import { useRef } from "react";
import AlertMessageComponent from "../../../common/AlertMessageComponent";
import CircularLoader from "../../../common/CircularLoader";
import { removeTimeFromDate } from "../utils/removeTimeFromDate";
import DisplayErrorsForMultipleFields from "../common/DisplayErrorsForMultipleFields";
import DisplaySectionHeading from "../common/DisplaySectionHeading";
import { CHECKS } from "../../../store/constant";
import { checkConditionToDisplayExtraFields } from "./../utils/checkConditionToDisplayExtraFields";
import UploadConsentFormComponent from "../common/UploadConsentFormComponent";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const CandidatePersonalParticularsPage = () => {
  const {
    loading,
    candidateDetails,
    candidateInitialDetails,
    apiErrorMsg,
    candidateCachedDetails,
    personalParticularData,
    candidateSectionLoading,
    languages,
  } = useSelector((state) => state.candidate);
  const { candidateProfileSections, allowProfileEdit } =
    candidateInitialDetails;

  const personalParticularDataRef = useRef();
  personalParticularDataRef.current = personalParticularData;

  const personalParticularForm = useRef();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toCacheValues = useRef();
  const theme = useTheme();

  let vendorUser =
    JSON.parse(
      JSON.parse(localStorage.getItem("first_login"))?.CheckMinistryUser
    )?.subRoleId === 11;

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(getPersonalParticularData(logDetails));
    !languages && dispatch(getLanguages(logDetails));
  }, []);

  const personalPerticular = useMemo(() => {
    let tempPersonalParticular = personalParticularData;

    if (!personalParticularData) {
      tempPersonalParticular =
        (candidateCachedDetails &&
          candidateCachedDetails["PERSONAL_PARTICULAR"]) ||
        newPersonalParticular();
    }

    if (tempPersonalParticular.dateOfBirth) {
      tempPersonalParticular.dateOfBirth = moment(
        tempPersonalParticular.dateOfBirth
      ).toLocaleString();
    }

    if (tempPersonalParticular?.formerNames?.length) {
      tempPersonalParticular?.formerNames?.forEach((name) => {
        name.formerNameDateChange = moment(
          name.formerNameDateChange
        ).toLocaleString();
      });
    }

    if (!tempPersonalParticular?.personalParticularNumber) {
      tempPersonalParticular.personalParticularNumber = [
        {
          mobileNumberCountryCode:
            tempPersonalParticular?.mobileNumberCountryCode,
          mobileNumber: tempPersonalParticular?.mobileNumber,
        },
      ];
    }

    return tempPersonalParticular;
  }, [personalParticularData, candidateCachedDetails]);

  useEffect(() => {
    //passing handleSubmit and invoking it on next btn which is present in candidate nav section
    dispatch({
      type: CANDIDATE_SECTION_SUBMIT_HANDLER,
      payload: () =>
        handleSubmit(
          personalParticularForm?.current?.values,
          personalParticularForm?.current
        ),
    });

    return () => {
      dispatch({ type: CANDIDATE_CLEAR_API_ERROR });
      dispatch({ type: PERSONAL_PARTICULAR, payload: null });

      //caching when dismounts
      if (!personalParticularDataRef.current && toCacheValues.current) {
        let logDetails = getCurrentFileNameAndFunction(
          import.meta.url,
          "useEffect"
        );
        dispatch(
          submitCacheCandidateDetails(
            logDetails,
            toCacheValues.current,
            "PERSONAL_PARTICULAR"
          )
        );
      }
    };
  }, []);

  const sectionData = useMemo(() => {
    let data = getSectionData(
      "PERSONAL_PERTICULAR",
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

  //driver license
  const conditionToDisplayDriverLicenseFields = useMemo(() => {
    if (candidateDetails) {
      //research country is China, India, Japan, Philippines, Taiwan & driver license check is present
      let countryIds = [46, 104, 113, 176, 218];
      let checkIds = [CHECKS.driverLicenceCheck];

      return checkConditionToDisplayExtraFields(
        candidateDetails,
        countryIds,
        checkIds
      );
    }
    return false;
  }, [candidateDetails]);

  //DIN number
  const conditionToDisplayDINnumberFields = useMemo(() => {
    if (candidateDetails) {
      //research country is India & director ship check is present
      let countryIds = [104];
      let checkIds = [CHECKS.directorshipCheck];

      return checkConditionToDisplayExtraFields(
        candidateDetails,
        countryIds,
        checkIds
      );
    }
    return false;
  }, [candidateDetails]);

  const handleSubmit = async (values, form) => {
    try {
      //we cannot make next btn in candidate nav section as type submit because it is not wrapped in formik form
      //so that's why to validate the form on onClick we have added validateForm()
      const validationErrors = await form.validateForm();

      if (vendorUser) {
        delete validationErrors?.personalParticularNumber;
      }

      //to stop the api call when there are errors , we will simply return
      if (Object.keys(validationErrors)?.length) {
        //since we are submitting our form on 'onClick' event on next btn fields wont get touched
        //so we have to explicitly touch them so that validation error msgs below fields can get displayed
        //and this can be achieved by using 'setTouched' &  'setNestedObjectValues' which is provided by formik
        return form.setTouched(setNestedObjectValues(validationErrors, true));
      }

      dispatch({ type: CANDIDATE_CLEAR_API_ERROR });

      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "handleSubmit"
      );

      const omitKeys = [
        "candidatesPersonalParticularsId",
        "mobileNumberCountryCode",
        "otherNameLanguageId",
        "otherName",
        "formerNameDateChange",
        "formerName",
        "countryOfBirthName",
        "personalParticularNumber",
        "validDriverLicenseExist",
      ];

      //add keys that actually required instead of omitting that value

      if (!values.middleName) omitKeys.push("middleName");
      if (values.otherNameExists) {
        values.otherNames?.map((curr) => {
          delete curr.id;
          delete curr.candidatesPersonalParticularId;
          delete curr.otherNameLanguageName;
          delete curr.name;

          if (curr.otherNameLanguageId !== 185) {
            delete curr.pinyinName;
          }
        });
      }

      if (values.formerNameExists) {
        values.formerNames?.forEach((curr) => {
          delete curr.id;
          curr.formerNameDateChange = removeTimeFromDate(
            curr.formerNameDateChange
          );
        });
      } else {
        omitKeys.push("formerNames");
      }

      if (values.otherNameExists) {
        values.otherNames?.forEach((curr) => delete curr.id);
      } else {
        omitKeys.push("otherNames");
      }

      if (!values.nickNameExists) {
        omitKeys.push("nickName");
      } else {
        values.nickName = values.nickName?.map((name) => {
          const newName = {
            lastName: name.lastName,
            firstName: name.firstName,
          };
          if (name.middleName) newName.middleName = name.middleName;
          return newName;
        });
      }

      if (vendorUser) {
        omitKeys.push("personalEmail");
        omitKeys.push("personalParticularNumber");
      }

      if (values.dateOfBirth) {
        values.dateOfBirth = removeTimeFromDate(values.dateOfBirth);
      }

      if (values?.personalParticularNumber) {
        values.mobileNumber = values?.personalParticularNumber[0]?.mobileNumber;
      }

      dispatch(
        submitCandidateDetails(
          {
            PERSONAL_PERTICULAR: omit(values, omitKeys),
          },
          "personal-particular",
          () => {
            toCacheValues.current = {};
            navigate(sectionData?.urls.nextUrl);
          },
          sectionData?.section?.onHold,
          sectionData?.section?.candidatesProfileSectionsId,
          navigate,
          logDetails
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      {!loading && !candidateSectionLoading && languages ? (
        <StyledBasePaper>
          <Formik
            initialValues={personalPerticular}
            validationSchema={() =>
              personalPerticularsValidationSchema(vendorUser)
            }
            enableReinitialize
            innerRef={personalParticularForm}
          >
            {(form) => {
              toCacheValues.current = {
                ...form.values,
                dateOfBirth: removeTimeFromDate(form.values?.dateOfBirth),
                formerNames: [
                  ...(form.values?.formerNames?.map((formerName) => {
                    return {
                      ...formerName,
                      formerNameDateChange: removeTimeFromDate(
                        formerName?.formerNameDateChange
                      ),
                    };
                  }) || []),
                ],
              };

              return (
                <>
                  <Box mb={2}>
                    {" "}
                    {!personalParticularData ? (
                      <AlertMessageComponent
                        cond={() => {
                          return !personalParticularData;
                        }}
                        CONSTANT="PERSONAL_PARTICULAR"
                        toCacheValues={toCacheValues.current}
                        sectionDetails={personalParticularData}
                      />
                    ) : null}
                  </Box>
                  <DisplaySectionHeading
                    icon={sectionData?.section?.sectionIcon}
                    text={sectionData?.section?.candidateRequiredInfoText}
                  />

                  <Form>
                    <Grid container spacing={4}>
                      <Grid item xs={12} md={6}>
                        <Card variant="outlined">
                          <Box
                            p={{ xs: 2, sm: 3, md: 4 }}
                            pb={{ md: 12, lg: 7.5, xl: 7.5 }}
                          >
                            <Grid container spacing={{ xs: 1, sm: 3 }}>
                              <Grid item xs={12} sm={6}>
                                <FastField
                                  component={BaseTextField}
                                  name="firstName"
                                  label="First Name*"
                                  error={
                                    form.touched.firstName &&
                                    form.errors.firstName
                                      ? true
                                      : false
                                  }
                                  placeholder="Enter first name"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FastField
                                  component={BaseTextField}
                                  name="middleName"
                                  label="Middle Name"
                                  placeholder="Enter middle name"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FastField
                                  component={BaseTextField}
                                  name="lastName"
                                  label="Last Name*"
                                  placeholder="Enter last name"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FastField
                                  component={BaseDatePicker}
                                  label="Date of Birth*"
                                  name="dateOfBirth"
                                  views={["year", "month", "day"]}
                                  placeholder="DD-MMM-YYYY"
                                  inputFormat="dd-MMM-yyyy"
                                  maxDate={moment("1/31/2008").toDate()}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FastField
                                  component={BaseCountrySelect}
                                  label="Place of Birth*"
                                  name="countryOfBirthId"
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FastField
                                  component={BaseSelect}
                                  name="gender"
                                  label="Gender*"
                                  placeholder="Choose your gender"
                                  options={[
                                    { value: "M", label: "Male" },
                                    { value: "F", label: "Female" },
                                    { value: "O", label: "Other" },
                                  ]}
                                />
                              </Grid>
                              {vendorUser ? null : (
                                <>
                                  <Grid item xs={12} sm={6}>
                                    <FastField
                                      component={BaseTextField}
                                      name="personalEmail"
                                      label="Personal Email Address*"
                                      placeholder="Write your email address"
                                    />
                                  </Grid>
                                  <FieldArray name="personalParticularNumber">
                                    <Grid item xs={12} sm={6}>
                                      <Typography
                                        varient="h5"
                                        sx={{ marginBottom: "4px" }}
                                      >
                                        Phone*
                                      </Typography>
                                      <FastField
                                        name="personalParticularNumber.0.mobileNumber"
                                        codeName="personalParticularNumber.0.mobileNumberCountryCode"
                                        placeholder="Your phone number"
                                        className="round_phone"
                                        component={PhoneNumberTextField}
                                      />
                                    </Grid>
                                  </FieldArray>{" "}
                                </>
                              )}
                            </Grid>
                          </Box>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <BaseAccordion
                          expandIcon={false}
                          expanded={form?.values?.otherNameExists}
                          onChange={(e) => {
                            form.setFieldValue("otherNameExists", e);
                            form.setFieldValue(
                              "otherNames",
                              form.values?.otherNames?.length
                                ? form.values?.otherNames
                                : [newOtherName()]
                            );
                          }}
                          headerbg={theme.palette.accordion.bg}
                          bordercolor={theme.palette.accordion.border}
                          header={(header) => (
                            <Box
                              width={"100%"}
                              display={"flex"}
                              alignItems={"center"}
                              justifyContent={"space-between"}
                            >
                              <span>Do you have name in other language?</span>
                              <IOSSwitch checked={header?.expanded} />
                            </Box>
                          )}
                        >
                          <FieldArray name="otherNames">
                            {({ remove, push }) => (
                              <Fragment>
                                {form.values.otherNameExists && (
                                  <Fragment>
                                    {form.values.otherNames?.map(
                                      (curr, index) => (
                                        <Box key={curr.id} mt={2}>
                                          <Grid
                                            container
                                            spacing={{ xs: 2 }}
                                            display="flex"
                                            alignItems="center"
                                          >
                                            <Grid item xs={12} md={5}>
                                              <FastField
                                                options={languages}
                                                component={BaseAutocomplete}
                                                itemLabel="name"
                                                label={`${
                                                  index + 1
                                                }) Select language*`}
                                                name={`otherNames.${index}.otherNameLanguageId`}
                                                itemValue="languageMasterId"
                                                id={curr.id}
                                              />
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                              <FastField
                                                component={BaseTextField}
                                                name={`otherNames.${index}.otherName`}
                                                id={curr.id}
                                                shouldUpdate={() => true}
                                                placeholder="Write name here"
                                                label={`${
                                                  index + 1
                                                }) Name In Selected Language*`}
                                              />
                                            </Grid>
                                            {curr?.otherNameLanguageId ===
                                            185 ? (
                                              <Grid item xs={11}>
                                                <FastField
                                                  component={BaseTextField}
                                                  name={`otherNames.${index}.pinyinName`}
                                                  id={curr.id}
                                                  shouldUpdate={() => true}
                                                  placeholder="Write name here"
                                                  label={`${
                                                    index + 1
                                                  }) Name In Pinyin*`}
                                                />
                                              </Grid>
                                            ) : null}
                                            {form.values.otherNames?.length >
                                              1 && (
                                              <Grid item xs={0.5} mt={2}>
                                                <Box>
                                                  <IconButton
                                                    aria-label="delete"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      remove(index);
                                                    }}
                                                    color="error"
                                                  >
                                                    <DeleteOutline />
                                                  </IconButton>
                                                </Box>
                                              </Grid>
                                            )}
                                          </Grid>
                                        </Box>
                                      )
                                    )}
                                    <Box
                                      mt={2}
                                      display="flex"
                                      justifyContent="flex-end"
                                    >
                                      <Button
                                        type="button"
                                        color="primary"
                                        variant="contained"
                                        onClick={() => {
                                          push(newOtherName());
                                        }}
                                        xs={{ width: "100%" }}
                                      >
                                        Add
                                      </Button>
                                    </Box>
                                  </Fragment>
                                )}
                              </Fragment>
                            )}
                          </FieldArray>
                        </BaseAccordion>
                        <Box mt={{ xs: 2, sm: 4, md: 5, lg: 5, xl: 5 }}>
                          <BaseAccordion
                            expandIcon={false}
                            expanded={form?.values?.formerNameExists}
                            onChange={(e) => {
                              form.setFieldValue("formerNameExists", e);
                              if (e) {
                                form.setFieldValue(
                                  "formerNames",
                                  form.values?.formerNames?.length
                                    ? form.values?.formerNames
                                    : [newFormerName()]
                                );
                              }
                            }}
                            headerbg={theme.palette.accordion.bg}
                            bordercolor={theme.palette.accordion.border}
                            header={(header) => (
                              <Box
                                width={"100%"}
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"space-between"}
                              >
                                <span>Do you have any former name?</span>
                                <IOSSwitch checked={header.expanded} />
                              </Box>
                            )}
                          >
                            <FieldArray name="formerNames">
                              {({ remove, push }) => (
                                <Fragment>
                                  {form.values.formerNameExists && (
                                    <Fragment>
                                      {form.values.formerNames?.map(
                                        (curr, index) => (
                                          <Box key={curr.id} mt={2}>
                                            <Grid
                                              container
                                              spacing={{ xs: 2 }}
                                              display="flex"
                                              alignItems="center"
                                            >
                                              <Grid item xs={12} md={5}>
                                                <FastField
                                                  component={BaseTextField}
                                                  name={`formerNames.${index}.formerName`}
                                                  id={curr.id}
                                                  label={`${
                                                    index + 1
                                                  }) Former Name*`}
                                                  placeholder="Write former name here..."
                                                />
                                              </Grid>
                                              <Grid item xs={12} md={6}>
                                                <FastField
                                                  component={BaseDatePicker}
                                                  views={[
                                                    "year",
                                                    "month",
                                                    "day",
                                                  ]}
                                                  placeholder="DD-MMM-YYYY"
                                                  inputFormat="dd-MMM-yyyy"
                                                  label={`${
                                                    index + 1
                                                  }) Former Name Date Change*`}
                                                  name={`formerNames.${index}.formerNameDateChange`}
                                                  id={curr.id}
                                                />
                                              </Grid>
                                              {form.values.formerNames?.length >
                                                1 && (
                                                <Grid item xs={1} mt={2}>
                                                  <Box>
                                                    <IconButton
                                                      aria-label="delete"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        remove(index);
                                                      }}
                                                      color="error"
                                                    >
                                                      <DeleteOutline />
                                                    </IconButton>
                                                  </Box>
                                                </Grid>
                                              )}
                                            </Grid>
                                          </Box>
                                        )
                                      )}
                                      <Box
                                        mt={2}
                                        display="flex"
                                        justifyContent="flex-end"
                                      >
                                        <Button
                                          type="button"
                                          color="primary"
                                          variant="contained"
                                          onClick={() => {
                                            push(newFormerName());
                                          }}
                                          xs={{
                                            width: "100%",
                                          }}
                                        >
                                          Add
                                        </Button>
                                      </Box>
                                    </Fragment>
                                  )}
                                </Fragment>
                              )}
                            </FieldArray>
                          </BaseAccordion>
                        </Box>
                      </Grid>
                    </Grid>

                    <FieldArray name="nickName">
                      {({ remove, push }) => (
                        <Fragment>
                          <Divider sx={{ my: 4 }} />

                          {/* NICK NAMES */}
                          <FormControlLabel
                            sx={{ ml: 0 }}
                            labelPlacement="start"
                            control={
                              <IOSSwitch
                                name="nickNameExists"
                                checked={form.values.nickNameExists}
                                onChange={(_, checked) => {
                                  form.setFieldValue("nickNameExists", checked);
                                  if (
                                    checked &&
                                    form.values.nickName?.length === 0
                                  ) {
                                    push(newNickName());
                                  }
                                }}
                              />
                            }
                            label={
                              <Typography fontWeight={500} sx={{ mr: 4 }}>
                                Do you have any Alias/Nickname?
                              </Typography>
                            }
                          />
                          {form.values.nickNameExists && (
                            <Fragment>
                              {form.values.nickName?.map((nickName, index) => (
                                <Box mt={{ xs: 2, md: 6 }} key={index}>
                                  <BaseAccordion
                                    index={index}
                                    expanded={nickName?.isExpanded || false}
                                    listValues={form.values.nickName}
                                    listKey={"nickName"}
                                    setFieldValue={form.setFieldValue}
                                    helpTransition="none"
                                    headerbg={theme.palette.accordion.bg}
                                    bordercolor={theme.palette.accordion.border}
                                    helpText={
                                      <Box
                                        p={{ xs: 2, sm: 0 }}
                                        display="flex"
                                        alignItems="center"
                                      >
                                        <Typography
                                          fontSize="18px"
                                          fontWeight="500"
                                          sx={{
                                            whiteSpace: "normal !important",
                                            wordBreak: "break-word !important",
                                          }}
                                        >
                                          {[
                                            nickName.firstName,
                                            nickName.middleName,
                                            nickName.lastName,
                                          ]
                                            .filter(Boolean)
                                            .join(" ")}
                                        </Typography>
                                      </Box>
                                    }
                                    header={
                                      <Box
                                        px={{ xs: 0, md: 4 }}
                                        width={"100%"}
                                        display={"flex"}
                                        alignItems={"center"}
                                        justifyContent={"space-between"}
                                      >
                                        <Typography
                                          fontSize="22px"
                                          fontWeight="500"
                                        >
                                          Nickname {index + 1}
                                        </Typography>
                                        {form.values.nickName?.length > 1 && (
                                          <Box>
                                            <IconButton
                                              aria-label="delete"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                remove(index);
                                              }}
                                            >
                                              <DeleteOutline />
                                            </IconButton>
                                          </Box>
                                        )}
                                      </Box>
                                    }
                                  >
                                    <Box display={"flex"} className="space-x-6">
                                      <Grid
                                        container
                                        spacing={{ xs: 1, sm: 3 }}
                                      >
                                        <Grid item xs={12} md={4}>
                                          <FastField
                                            component={BaseTextField}
                                            label="First Name*"
                                            name={`nickName.${index}.firstName`}
                                          />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                          <FastField
                                            component={BaseTextField}
                                            label="Middle Name"
                                            name={`nickName.${index}.middleName`}
                                          />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                          <FastField
                                            component={BaseTextField}
                                            label="Last Name"
                                            name={`nickName.${index}.lastName`}
                                          />
                                        </Grid>
                                      </Grid>
                                    </Box>
                                  </BaseAccordion>
                                </Box>
                              ))}
                              <Box mt={6}>
                                <Button
                                  type="button"
                                  color="primary"
                                  variant="contained"
                                  onClick={async (e) => {
                                    let nickNames = form.values.nickName?.map(
                                      (nickN, index) => {
                                        nickN.isExpanded = false;
                                        return nickN;
                                      }
                                    );
                                    form.setFieldValue("nickName", nickNames);

                                    e.stopPropagation();
                                    push(newNickName());
                                  }}
                                  xs={{ width: "100%" }}
                                >
                                  Add more Nickname
                                </Button>
                              </Box>
                            </Fragment>
                          )}

                          <DisplayErrorsForMultipleFields
                            section="Nickname"
                            errors={form.errors.nickName}
                            touched={form.touched.nickName}
                          />
                        </Fragment>
                      )}
                    </FieldArray>

                    {/*Driving License fields*/}
                    {conditionToDisplayDriverLicenseFields ? (
                      <Box my={{ xs: 2, sm: 4, md: 5, lg: 5, xl: 5 }}>
                        <Divider sx={{ my: 4 }} />
                        <Grid container spacing={4}>
                          <Grid item xs={12}>
                            <FormControlLabel
                              sx={{ ml: 0 }}
                              labelPlacement="start"
                              control={
                                <IOSSwitch
                                  name="driverLicenseNumberExists"
                                  checked={
                                    form.values.driverLicenseNumberExists
                                  }
                                  onChange={(_, checked) => {
                                    form.setFieldValue(
                                      "driverLicenseNumberExists",
                                      checked
                                    );

                                    if (!checked) {
                                      form.setFieldTouched(
                                        "driverLicenseNumber",
                                        false
                                      );
                                      form.setFieldTouched(
                                        "driverLicenseFrontCopy",
                                        false
                                      );
                                      form.setFieldTouched(
                                        "driverLicenseBackCopy",
                                        false
                                      );

                                      form.setFieldValue(
                                        "driverLicenseNumber",
                                        null
                                      );
                                      form.setFieldValue(
                                        "driverLicenseFrontCopy",
                                        null
                                      );
                                      form.setFieldValue(
                                        "driverLicenseBackCopy",
                                        null
                                      );
                                    }
                                  }}
                                />
                              }
                              label={
                                <Typography fontWeight={500} sx={{ mr: 4 }}>
                                  Do you have a valid driver license?
                                </Typography>
                              }
                            />
                          </Grid>
                          {form.values.driverLicenseNumberExists ? (
                            <>
                              <Grid item xs={6}>
                                <FastField
                                  component={BaseTextField}
                                  name="driverLicenseNumber"
                                  label="Driving License Number*"
                                  error={
                                    form.touched.driverLicenseNumber &&
                                    form.errors.driverLicenseNumber
                                      ? true
                                      : false
                                  }
                                />
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                display="flex"
                                alignItems="center"
                              >
                                <Box>
                                  Please attach <strong>front side</strong> copy
                                  of your driver license{" "}
                                </Box>
                                <Box ml={2}>
                                  <UploadConsentFormComponent
                                    form={form}
                                    section="personal_details"
                                    fieldName="driverLicenseFrontCopy"
                                    formId="driverLicenseFrontCopy"
                                    fileName="Front Side"
                                  />
                                </Box>
                              </Grid>
                              {form.touched.driverLicenseFrontCopy &&
                              form.errors.driverLicenseFrontCopy ? (
                                <Box sx={{ color: "red" }} ml={4}>
                                  {form.errors.driverLicenseFrontCopy}
                                </Box>
                              ) : null}

                              <Grid
                                item
                                xs={12}
                                display="flex"
                                alignItems="center"
                              >
                                <Box>
                                  {" "}
                                  Please attach <strong>back side</strong> copy
                                  of your driver license{" "}
                                </Box>
                                <Box ml={2}>
                                  <UploadConsentFormComponent
                                    form={form}
                                    section="personal_details"
                                    fieldName="driverLicenseBackCopy"
                                    formId="driverLicenseBackCopy"
                                    fileName="Back Side"
                                  />
                                </Box>
                              </Grid>
                              {form.touched.driverLicenseBackCopy &&
                              form.errors.driverLicenseBackCopy ? (
                                <Box sx={{ color: "red" }} ml={4}>
                                  {form.errors.driverLicenseBackCopy}
                                </Box>
                              ) : null}
                            </>
                          ) : null}
                        </Grid>
                      </Box>
                    ) : null}

                    {/*DIN number fields*/}
                    {conditionToDisplayDINnumberFields ? (
                      <Box my={{ xs: 2, sm: 4, md: 5, lg: 5, xl: 5 }}>
                        <Divider sx={{ my: 4 }} />
                        <Grid container spacing={4}>
                          <Grid item xs={12}>
                            <FormControlLabel
                              sx={{ ml: 0 }}
                              labelPlacement="start"
                              control={
                                <IOSSwitch
                                  name="DINNumberExists"
                                  checked={form.values.DINNumberExists}
                                  onChange={(_, checked) => {
                                    form.setFieldValue(
                                      "DINNumberExists",
                                      checked
                                    );

                                    if (!checked) {
                                      form.setFieldTouched("DINNumber", false);
                                      form.setFieldValue("DINNumber", null);
                                    }
                                  }}
                                />
                              }
                              label={
                                <Typography fontWeight={500} sx={{ mr: 4 }}>
                                  Are you Director in any Company resisted with
                                  MCA(Ministry of Corporate Affairs) OR have a
                                  valid DIN number?
                                </Typography>
                              }
                            />
                          </Grid>
                          {form.values.DINNumberExists ? (
                            <Grid item xs={12} md={6}>
                              <FastField
                                component={BaseTextField}
                                name="DINNumber"
                                label="DIN Number*"
                                error={
                                  form.touched.DINNumber &&
                                  form.errors.DINNumber
                                    ? true
                                    : false
                                }
                              />
                            </Grid>
                          ) : null}
                        </Grid>
                      </Box>
                    ) : null}

                    {apiErrorMsg && (
                      <Typography
                        mt={2}
                        color="error"
                        style={{ textTransform: "capitalize" }}
                      >
                        {apiErrorMsg}*
                      </Typography>
                    )}
                  </Form>
                </>
              );
            }}
          </Formik>
        </StyledBasePaper>
      ) : (
        <CircularLoader />
      )}
    </Fragment>
  );
};

export { CandidatePersonalParticularsPage };
