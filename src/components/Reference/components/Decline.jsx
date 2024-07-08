import * as Yup from "yup";
import { FastField, Form, Formik, setNestedObjectValues } from "formik";

import { Box, Typography } from "@mui/material";
import { ApprovalOutlined } from "@mui/icons-material";
import { BaseTextField } from "../../base";

import { LoadingButton } from "@mui/lab";
import { StyledBasePaper } from "../..//base/styled";
import { useDispatch } from "react-redux";
import { submitRefreeQuestionnaireData } from "../../../store/actions/authorizationAction";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const Decline = ({ token }) => {
  const dispatch = useDispatch();

  const initialState = {
    reasonOfDecline: "",
  };

  const validationSchema = Yup.object().shape({
    reasonOfDecline: Yup.string()
      .min(3, "Reason is too short!")
      .max(1500, "Reason is too long!")
      .required("Required"),
  });

  const handleSubmit = async (form) => {
    const validationErrors = await form.validateForm();

    if (Object.keys(validationErrors)?.length) {
      return form.setTouched(setNestedObjectValues(validationErrors, true));
    }

    let values = form?.values;

    const data = {
      isDeclined: true,
      reasonOfDecline: values.reasonOfDecline,
    };

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSubmit"
    );

    dispatch(submitRefreeQuestionnaireData(data, token, logDetails));
  };

  return (
    <Box pt={2} maxWidth={{ xs: "100vw", md: "80vw" }} margin="0 auto">
      <StyledBasePaper>
        <Box p={{ xs: 0, md: 1 }}>
          <Box display="flex" alignItems="center">
            <ApprovalOutlined />
            <Typography variant="h4" marginLeft="0.5rem">
              {"Please provide reason for declining to refer."}
            </Typography>
          </Box>
          <Box mt={4}>
            <Formik
              initialValues={{ initialState }}
              validationSchema={validationSchema}
              enableReinitialize
            >
              {(form) => (
                <Form>
                  <Box>
                    <Typography>Reason For Decline</Typography>
                    <FastField
                      size={"2rem"}
                      component={BaseTextField}
                      name={"reasonOfDecline"}
                    />
                  </Box>

                  <Box
                    mt={6}
                    display={"flex"}
                    className="space-x-4"
                    justifyContent={"center"}
                  >
                    <LoadingButton
                      loading={form.isSubmitting}
                      color="primary"
                      variant="contained"
                      onClick={() => handleSubmit(form)}
                    >
                      Submit
                    </LoadingButton>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </StyledBasePaper>
    </Box>
  );
};

export default Decline;
