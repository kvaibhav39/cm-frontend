import moment from "moment";
import { omit } from "lodash";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Formik, setNestedObjectValues } from "formik";
import { Box, Alert, Divider } from "@mui/material";
import { StyledBasePaper } from "../../base/styled";
import { newAddress } from "../helpers/initialState/address";
import { addressValidationSchema } from "../helpers/validationSchema/address";
import { getSectionData } from "../utils/getSectionData";
import { useDispatch, useSelector } from "react-redux";
import {
  CANDIDATE_CLEAR_API_ERROR,
  CANDIDATE_SECTION_BACK_URL,
  CANDIDATE_SECTION_SUBMIT_HANDLER,
} from "../../../store/actions/actionTypes";
import {
  getAddressDetailsData,
  submitCacheCandidateDetails,
  submitCandidateDetails,
} from "../../../store/actions/candidateAction";
import AlertMessageComponent from "../../../common/AlertMessageComponent";
import CircularLoader from "../../../common/CircularLoader";
import { checkGaps } from "./utils/checkGaps";
import { removeTimeFromDate } from "../utils/removeTimeFromDate";
import DisplayErrorsForMultipleFields from "../common/DisplayErrorsForMultipleFields";
import DisplaySectionListsForMultipleFields from "../common/DisplaySectionListsForMultipleFields";
import DisplayAddBtnForMultipleFields from "../common/DisplayAddBtnForMultipleFields";
import DisplaySectionHeading from "../common/DisplaySectionHeading";
import AddressFormDetails from "./components/AddressFormDetails";
import CandidateMultipleFieldsSectionLayout from "../common/CandidateMultipleFieldsSectionLayout";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const CandidateAddressPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const addressForm = useRef();
  const [gaps, setGaps] = useState([]);
  const toCacheValues = useRef();
  const {
    loading,
    candidateInitialDetails,
    apiErrorMsg,
    candidateCachedDetails,
    addressDetailsData,
    candidateSectionLoading,
  } = useSelector((state) => state.candidate);
  const { candidateProfileSections, allowProfileEdit } =
    candidateInitialDetails;

  const addressDetailsDataRef = useRef();
  addressDetailsDataRef.current = addressDetailsData;

  const pushNewAddressRef = useRef();

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );
    dispatch(getAddressDetailsData(logDetails));
  }, []);

  const addresses = useMemo(() => {
    if (addressDetailsData) {
      let tempAddress =
        !addressDetailsData || !addressDetailsData?.length
          ? (candidateCachedDetails &&
              candidateCachedDetails["ADDRESS_DETAILS"]) || [newAddress()]
          : addressDetailsData;

      if (tempAddress) {
        tempAddress = tempAddress.map((curr, index) => {
          return {
            ...curr,
            selectedTab: index === 0,
          };
        });
      }

      tempAddress.forEach((curr) => {
        if (curr.fromDate) {
          curr.fromDate = moment(curr.fromDate).toLocaleString();
        }
        if (curr.toDate) {
          curr.toDate = moment(curr.toDate).toLocaleString();
        }
      });

      return tempAddress;
    } else return undefined;
  }, [addressDetailsData, candidateCachedDetails]);

  const sectionData = useMemo(() => {
    let data = getSectionData(
      "ADDRESS_DETAILS",
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

  useEffect(() => {
    //passing handleSubmit and invoking it on next btn which is present in candidate nav section
    dispatch({
      type: CANDIDATE_SECTION_SUBMIT_HANDLER,
      payload: () =>
        handleSubmit(addressForm?.current?.values, addressForm?.current),
    });
    return () => {
      dispatch({ type: CANDIDATE_CLEAR_API_ERROR });
      // dispatch({ type: ADDRESS_DETAILS, payload: [] });

      //caching when dismounts
      if (
        (!addressDetailsDataRef.current ||
          !addressDetailsDataRef.current.length) &&
        toCacheValues.current
      ) {
        let logDetails = getCurrentFileNameAndFunction(
          import.meta.url,
          "useEffect"
        );

        dispatch(
          submitCacheCandidateDetails(
            logDetails,
            toCacheValues.current,
            "ADDRESS_DETAILS"
          )
        );
      }
    };
  }, []);

  useEffect(() => {
    if (addresses) {
      checkGaps({ addresses }, sectionData, setGaps);
    }
  }, [addresses, sectionData]);

  const handleSubmit = async (values, form) => {
    try {
      //we cannot make next btn in candidate nav section as type submit because it is not wrapped in formik form
      //so that's why to validate the form on onClick we have added validateForm()
      const validationErrors = await form.validateForm();

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

      let gaps = checkGaps(values, sectionData, setGaps);

      if (gaps.length === 0) {
        dispatch(
          submitCandidateDetails(
            {
              ADDRESS_DETAILS: values?.addresses?.map((address) => {
                delete address.isExpanded; //removing isExpanded property from the payload

                address.fromDate = removeTimeFromDate(address.fromDate);
                address.toDate = removeTimeFromDate(address.toDate);

                return omit(
                  address,
                  "candidatesAddressesId",
                  "countryName",
                  "selectedTab"
                );
              }),
            },
            "address-details",
            () => {
              toCacheValues.current = [];
              navigate(sectionData?.urls.nextUrl);
            },
            sectionData?.section?.onHold,
            sectionData?.section?.candidatesProfileSectionsId,
            navigate,
            logDetails
          )
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Fragment>
      {!loading &&
      !candidateSectionLoading &&
      addressDetailsData &&
      addresses &&
      sectionData ? (
        <StyledBasePaper>
          <Formik
            // enableReinitialize
            initialValues={{ addresses }}
            validationSchema={addressValidationSchema}
            innerRef={addressForm}
          >
            {(form) => {
              toCacheValues.current = [
                ...form.values?.addresses.map((address) => {
                  return {
                    ...address,
                    fromDate: removeTimeFromDate(address.fromDate),
                    toDate: removeTimeFromDate(address.toDate),
                  };
                }),
              ];
              return (
                <Form>
                  <CandidateMultipleFieldsSectionLayout
                    formHeadingComponent={
                      <>
                        <DisplaySectionHeading
                          icon={sectionData?.section?.sectionIcon}
                          text={sectionData?.section?.candidateRequiredInfoText}
                        />

                        {gaps.length > 0 && (
                          <Box mt={2}>
                            <Alert severity="error">
                              You seems to be missing address from{" "}
                              {gaps?.map((gap, index) => (
                                <strong>
                                  <br />
                                  {moment(gap[0]).format("MMM YYYY") !==
                                  moment(gap[1]).format("MMM YYYY")
                                    ? moment(gap[0]).format("MMM YYYY") +
                                      " to " +
                                      moment(gap[1]).format("MMM YYYY")
                                    : moment(gap[0]).format("MMM YYYY")}
                                </strong>
                              ))}
                            </Alert>
                          </Box>
                        )}

                        <DisplayErrorsForMultipleFields
                          errors={form.errors.addresses}
                          touched={form.touched.addresses}
                          apiErrorMsg={apiErrorMsg}
                        />
                      </>
                    }
                    formListsComponent={
                      <>
                        {/*Address lists */}
                        <DisplaySectionListsForMultipleFields
                          values={form?.values?.addresses}
                          setFieldValue={form.setFieldValue}
                          fieldArrayName="addresses"
                          sectionName="Address"
                        />

                        {/*Add address */}
                        <DisplayAddBtnForMultipleFields
                          values={form?.values?.addresses}
                          fieldArrayName="addresses"
                          form={form}
                          pushNewRef={pushNewAddressRef}
                          newFields={newAddress}
                          runWhenNewAdd={() =>
                            checkGaps(form.values, sectionData, setGaps)
                          }
                          addSectionText={() =>
                            form?.values?.addresses?.length > 0
                              ? "Add More Address"
                              : "Add Address"
                          }
                        />

                        {/*cache */}
                        {!addressDetailsData || !addressDetailsData.length ? (
                          <>
                            <Box my={3}>
                              <Divider />
                            </Box>
                            <AlertMessageComponent
                              cond={() => {
                                return (
                                  !addressDetailsData ||
                                  !addressDetailsData.length
                                );
                              }}
                              CONSTANT="ADDRESS_DETAILS"
                              toCacheValues={toCacheValues.current}
                              sectionDetails={addressDetailsData}
                            />
                          </>
                        ) : null}
                      </>
                    }
                    formDetailsComponent={
                      <AddressFormDetails
                        form={form}
                        pushNewAddressRef={pushNewAddressRef}
                        addressForm={addressForm}
                        sectionData={sectionData}
                        setGaps={setGaps}
                      />
                    }
                  />
                </Form>
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

export { CandidateAddressPage };
