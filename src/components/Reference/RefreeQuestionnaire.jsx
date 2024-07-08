import { Navigate, useSearchParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import {
  getRefreeQuestionnaireData,
  submitRefreeQuestionnaireData,
} from "../../store/actions/authorizationAction";
import { useDispatch, useSelector } from "react-redux";
import Questionnaire from "../common/Questionnaire";
import Thankyou from "./components/Thankyou";
import Loader from "../../common/Loader";
import { declarationValidationSchema } from "../Candidate/helpers/validationSchema/declaration";
import Decline from "./components/Decline";
import { setNestedObjectValues } from "formik";
import AskConfirmationForReference from "./components/AskConfirmationForReference";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction";

const RefreeQuestionnaire = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [errMsg, setErrMsg] = useState("");
  const checkAuthRef = useRef(false);
  const declarationForm = useRef();
  const dispatch = useDispatch();
  const refreeQuestionnireData = useSelector(
    (state) => state?.authorization?.refreeQuestionnaireData
  );

  let token = searchParams.get("token");
  if (!token && !checkAuthRef.current) {
    checkAuthRef.current = true;
    return <Navigate to="/not-found" />;
  }
  const { exp } = jwtDecode(token);
  if (exp * 1000 < Date.now() && !checkAuthRef.current) {
    checkAuthRef.current = true;
    return <Navigate to="/not-found" />;
  }
  let decline = searchParams.get("decline");
  let accept = searchParams.get("accept");

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    dispatch(getRefreeQuestionnaireData(token, setErrMsg, logDetails));
  }, []);

  const handleSubmit = async (form) => {
    const validationErrors = await form.validateForm();

    if (Object.keys(validationErrors)?.length) {
      return form.setTouched(setNestedObjectValues(validationErrors, true));
    }

    let values = form?.values;

    const data = {
      isDeclined: false,
      refereeQuestionsResponse:
        values?.declarations[0].questionnaireQuestions.map((question) => {
          let temp = {
            questionTypeId: question?.questionTypeId,
            candidateRefereeQuestionnairesQuestionsId:
              question.candidateRefereeQuestionnairesQuestionsId,
            answer: question?.answer,
          };

          // yes/no justification
          if (
            question?.questionTypeId === 5 &&
            question?.answer?.answeroption === "Yes"
          ) {
            delete question?.answer?.justification;
          }

          return temp;
        }),
    };

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSubmit"
    );
    
    dispatch(submitRefreeQuestionnaireData(data, token, logDetails));
  };

  const handleAcceptConfirmation = () => {
    setSearchParams((prevParams) => {
      return new URLSearchParams({
        ...Object.fromEntries(prevParams.entries()),
        accept: true,
      });
    });
  };

  const handleDeclineConfirmation = () => {
    setSearchParams((prevParams) => {
      return new URLSearchParams({
        ...Object.fromEntries(prevParams.entries()),
        decline: "TRUE",
      });
    });
  };

  if (!refreeQuestionnireData?.candidateRefereeQuestions && !errMsg) {
    return <Loader />;
  }

  if (
    !refreeQuestionnireData?.candidateRefereeQuestions &&
    errMsg &&
    !checkAuthRef.current
  ) {
    checkAuthRef.current = true;
    return <Navigate to="/not-found" />;
    // throw errMsg;
  }
  if (decline === "TRUE") {
    //check declined flag if true
    if (
      refreeQuestionnireData?.isDeclined &&
      refreeQuestionnireData?.isResponseSubmitted
    ) {
      //show Thankyou page with accept option
      return (
        <Thankyou
          allowAccept={true}
          token={token}
          reasonOfDecline={refreeQuestionnireData.reasonOfDecline}
        />
      );
    } else if (!refreeQuestionnireData?.isResponseSubmitted) {
      //show page with decline input text if already not decliend
      //call API to decline reference
      return <Decline token={token} />;
    } else {
      //show Thankyou page after final submission
      return <Thankyou />;
    }
  } else {
    if (
      refreeQuestionnireData?.isResponseSubmitted &&
      !refreeQuestionnireData?.isDeclined
    ) {
      //show Thankyou page after final submission
      return <Thankyou />;
    } else if (
      refreeQuestionnireData?.isDeclined &&
      refreeQuestionnireData?.isResponseSubmitted &&
      !accept
    ) {
      return (
        <Thankyou
          allowAccept={true}
          token={token}
          reasonOfDecline={refreeQuestionnireData.reasonOfDecline}
        />
      );
    } else {
      // call for Questionier Question

      //need response with decline and submitted status true

      if (refreeQuestionnireData?.candidateRefereeQuestions?.length > 0) {
        if (accept) {
          return (
            <Questionnaire
              questions={refreeQuestionnireData?.candidateRefereeQuestions}
              handleSubmit={handleSubmit}
              validationSchema={declarationValidationSchema}
              alwaysExpanded
              declarationForm={declarationForm}
            />
          );
        } else {
          return (
            <AskConfirmationForReference
              handleAcceptConfirmation={handleAcceptConfirmation}
              handleDeclineConfirmation={handleDeclineConfirmation}
            />
          );
        }
      } else {
        if (!checkAuthRef.current) {
          checkAuthRef.current = true;
          return <Navigate to="/not-found" />;
        }
      }
    }
  }
};
export default RefreeQuestionnaire;
