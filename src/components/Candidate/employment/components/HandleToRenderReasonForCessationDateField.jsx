import { Grid } from "@mui/material";
import { FastField, useFormikContext } from "formik";
import moment from "moment";
import { useState, useEffect } from "react";
import { BaseTextField } from "../../../base";

const HandleToRenderReasonForCessationDateField = ({
  employment,
  index,
  hrOrganizationName,
  doNotDisplayClientName,
}) => {
  const [flag, setFlag] = useState(false);
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    if (!employment.canContactEmployer) {
      let currentDate = moment();
      let cessationDate = moment(employment?.cessationDate);
      let diff = cessationDate.diff(currentDate, "days");

      if (diff >= 30) {
        setFlag(true);
      } else {
        setFieldValue(
          `employments[${index}].reasonOfChoosingLateCessationDate`,
          ""
        );
        setFlag(false);
      }
    }
  }, [employment]);
  return (
    <>
      {!employment.canContactEmployer && flag ? (
        <Grid item xs={12}>
          <FastField
            component={BaseTextField}
            name={`employments.${index}.reasonOfChoosingLateCessationDate`}
            id={employment.reasonOfChoosingLateCessationDate}
            shouldUpdate={() => true}
            label={`Please provide your reason of choosing the date more than a month.The reason will also be visible to ${
              doNotDisplayClientName ? "your organization" : hrOrganizationName
            }*`}
          />
        </Grid>
      ) : null}
    </>
  );
};

export default HandleToRenderReasonForCessationDateField;
