import { useFormikContext } from "formik";
import { useEffect } from "react";

const HandleEmploymentsGapsFieldUpdate = ({ empGap, setEmpGap }) => {
  const { values } = useFormikContext();
  useEffect(() => {
    let temp = [];

    if (values?.employmentsGaps?.length) {
      values.employmentsGaps?.forEach((val, ind1) => {
        empGap.forEach((gap, ind2) => {
          if (ind1 === ind2) {
            temp.push({
              reasonOfGapId: val.reasonOfGapId,
              additionalComments: val?.additionalComments || "",
              gapStartDate: gap.gapStartDate,
              gapEndDate: gap.gapEndDate,
            });
          }
        });
      });
    } else {
      temp = empGap;
    }

    setEmpGap([...temp]);
  }, [values?.employmentsGaps]);
  return null;
};

export default HandleEmploymentsGapsFieldUpdate;
