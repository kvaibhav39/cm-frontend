import { useState, useEffect, useRef } from "react";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import OperationSubmit from "./components/OperationSubmit";
import { getOrganizations } from "../../../store/actions/organizationAction";
import {
  getProcessStatus,
  getResultStatus,
  submitOperation,
} from "../../../store/actions/operationActions";
import { uploadFileUtils } from "../../../store/actions/helperActions";
import ViewCandidateInHR from "../../../common/ViewCandidateInHR";
import { SET_OPS_COMPONENT } from "../../../store/actions/actionTypes";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

export const CandidateRegisterSchema = Yup.object().shape({
  hrOrganizationsId: Yup.number()
    .required("Field is required!")
    .typeError("Field is required!"),
  candidatesCasesId: Yup.number()
    .required("Field is required!")
    .typeError("Field is required!"),
  candidatesVerificationResultStatusId: Yup.number()
    .required("Field is required!")
    .typeError("Field is required!"),
  candidatesVerificationProcessStatusId: Yup.number()
    .required("Field is required!")
    .typeError("Field is required!"),
  verificationResultComment: Yup.string().typeError("Field is required!"),
});

const OperationsTemp = () => {
  const [fileUploadError, setFileUploadError] = useState(false);
  const operationRef = useRef();
  const dispatch = useDispatch();
  const tempRef = useRef(false);

  const organizationsList = useSelector(
    ({ organizations }) => organizations.organizations
  );
  const processStatus = useSelector(
    ({ operations }) => operations.processStatus
  );
  const resultStatus = useSelector(({ operations }) => operations.resultStatus);

  const { opsComponent } = useSelector((state) => state.operations);

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );
    dispatch(getOrganizations(logDetails));
    dispatch(getProcessStatus(logDetails));
    dispatch(getResultStatus(logDetails));
    dispatch({ type: SET_OPS_COMPONENT, payload: "ops-screen" });
  }, []);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (values.report.length === 0) {
        setFileUploadError(true);
      } else {
        let logDetails = getCurrentFileNameAndFunction(
          import.meta.url,
          "handleSubmit"
        );

        dispatch(
          uploadFileUtils(
            logDetails,
            {
              file: values.report[0],
            },
            {
              category: "CANDIDATE_REPORT",
              multiple: true,
            },
            (res) =>
              dispatch(
                submitOperation(
                  {
                    organizationId: values.hrOrganizationsId,
                    candidateCaseId: values.candidatesCasesId,
                    verificationResultComment: values.verificationResultComment,
                    attachment: {
                      reportCdnPath: res?.fileAttachmentPath,
                      attachmentName: res?.fileName,
                      attachmentCategoryName: "CANDIDATE_REPORT",
                    },
                    verificationResultId:
                      values.candidatesVerificationResultStatusId,
                    verificationProcessId:
                      values.candidatesVerificationProcessStatusId,
                  },
                  resetForm,
                  logDetails
                )
              ),
            {
              candidateCaseId: values.candidatesCasesId,
            }
          )
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const setOpsComponent = (value) => {
    dispatch({ type: SET_OPS_COMPONENT, payload: value });
  };

  return (
    <>
      {organizationsList?.length &&
      processStatus?.length &&
      resultStatus?.length ? (
        <Formik
          initialValues={{
            hrOrganizationsId: null,
            candidatesCasesId: null,
            candidatesVerificationProcessStatusId: null,
            candidatesVerificationResultStatusId: null,
            verificationResultComment: "",
            report: [],
            resultStatus,
            processStatus,
            candidatesList: [],
            organizationsList,
          }}
          validationSchema={CandidateRegisterSchema}
          enableReinitialize
          onSubmit={handleSubmit}
          innerRef={operationRef}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
            setFieldValue,
            setTouched,
            validateForm,
          }) => (
            <>
              {opsComponent === "ops-screen" ? (
                <OperationSubmit
                  errors={errors}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  touched={touched}
                  values={values}
                  setFieldValue={setFieldValue}
                  setTouched={setTouched}
                  validateForm={validateForm}
                  fileUploadError={fileUploadError}
                  setFileUploadError={setFileUploadError}
                  tempRef={tempRef}
                  setOpsComponent={setOpsComponent}
                />
              ) : opsComponent === "view-candidate" ? (
                <ViewCandidateInHR
                  candidatesCasesId={values?.candidatesCasesId}
                  setOpsComponent={setOpsComponent}
                />
              ) : null}
            </>
          )}
        </Formik>
      ) : null}
    </>
  );
};
export default OperationsTemp;
