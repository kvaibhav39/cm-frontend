import { useState, useEffect } from "react";
import { cacheTime } from "../../../store/constant";
import { useDispatch } from "react-redux";
import { submitCacheCandidateDetails } from "../../../store/actions/candidateAction";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction.js";

const useTimerForCaching = (
  cond,
  cachePayload,
  sectionDetails,
  CONSTANT,
  runBeforeDispatch
) => {
  const [seconds, setSeconds] = useState(cacheTime / 1000);
  const dispatch = useDispatch();

  useEffect(() => {
    let timer;
    if (cond()) {
      timer = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prevState) => prevState - 1);
        } else {
          if (CONSTANT === "ADDITIONAL_INFORMATION") {
            cachePayload = runBeforeDispatch();
          }

          let logDetails = getCurrentFileNameAndFunction(
            import.meta.url,
            "useEffect"
          );

          dispatch(
            submitCacheCandidateDetails(logDetails, cachePayload, CONSTANT)
          );
          setSeconds((prevState) => (prevState = cacheTime / 1000));
        }
      }, 1000);
    } else {
      timer && clearInterval(timer);
    }

    return () => timer && clearInterval(timer);
  }, [seconds, sectionDetails]);

  return seconds;
};

export default useTimerForCaching;
