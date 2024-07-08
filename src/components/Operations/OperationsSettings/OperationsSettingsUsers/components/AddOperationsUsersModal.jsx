import { FastField, Form, Formik, Field } from "formik";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography, Box } from "@mui/material";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import { submitInternalUser } from "../../../../../store/actions/systemAdminActions";
import { BaseSelect, BaseTextField } from "../../../../base";
import { addOperationsUsersInitialValues } from "../helper/addOperationsUsersInitialValues";
import { addOperationsUsersSchema } from "../helper/addOperationsUsersSchema";
import { LoadingButton } from "@mui/lab";
import { getCurrentFileNameAndFunction } from "../../../../../utils/getCurrentFileNameAndFunction";

const HrModalBox = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 10px;
  min-width: 500px;
  min-height: 250px;
`;

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AddOperationsUsersModal = ({
  open,
  handleClose,
  clearSearchTextState,
}) => {
  const { subRolesLists } = useSelector((state) => state.hr);
  const dispatch = useDispatch();

  const handleSubmit = (values, form) => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSubmit"
    );

    form.setSubmitting(true);
    dispatch(
      submitInternalUser(
        logDetails,
        {
          loginEmail: values?.userEmail,
          userName: values?.userName,
          roleId: values?.role,
          subRoleId: values?.subRole,
        },
        true,
        handleClose,
        () => {
          clearSearchTextState();
          form.setSubmitting(false);
        }
      )
    );
  };

  return (
    <Formik
      initialValues={addOperationsUsersInitialValues}
      validationSchema={addOperationsUsersSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {(form) => (
        <Form>
          <Dialog open={open} onClose={handleClose}>
            <HrModalBox>
              <DialogTitle>
                <Typography variant="h2" style={{ fontWeight: "normal" }}>
                  Add an Operation User
                </Typography>
              </DialogTitle>
              <StyledDialogContent>
                <FastField
                  component={BaseTextField}
                  name="userName"
                  label="User Name*"
                />
                <FastField
                  component={BaseTextField}
                  name="userEmail"
                  label="User Email*"
                />

                <Field
                  component={BaseSelect}
                  name="subRole"
                  label="Select Sub Role*"
                  optionLabel="title"
                  optionValue="id"
                  options={subRolesLists}
                />
              </StyledDialogContent>
              <DialogActions>
                <Button
                  variant="standard"
                  onClick={handleClose}
                  disableElevation
                >
                  Cancel
                </Button>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  disableElevation
                  onClick={form.submitForm}
                  loading={form.isSubmitting}
                  disabled={form.isSubmitting}
                >
                  Add
                </LoadingButton>
              </DialogActions>
            </HrModalBox>
          </Dialog>
        </Form>
      )}
    </Formik>
  );
};

export default AddOperationsUsersModal;
