import { FastField, Form, Formik, Field } from "formik";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography, Box } from "@mui/material";
import styled from "@emotion/styled";
import { useDispatch, useSelector } from "react-redux";
import { BaseSelect, BaseTextField } from "../../../base";
import { addInternalUsersSchema } from "../../helpers/Schema/AddInternalUsers";
import { addInternalUsersInitialValues } from "../../helpers/InitialValues/AddInternalUsers";
import { submitInternalUser } from "../../../../store/actions/systemAdminActions";
import { useEffect, useState } from "react";
import { getSubrolesOfRole } from "../../../../store/actions/hrActions.js";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction.js";

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

const AddInternalUsersModal = ({ open, handleClose }) => {
  const { rolesLists } = useSelector((state) => state.systemAdmin);
  const { subRolesLists } = useSelector((state) => state.hr);
  const dispatch = useDispatch();
  const [disable, setDisable] = useState(true);

  const onRoleSelection = (subRolesLists) => {
    if (!subRolesLists) {
      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "onRoleSelection"
      );

      dispatch(getSubrolesOfRole(logDetails, { roleId: 4 }));
    }
    setDisable(false);
  };

  const handleSubmit = (values) => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleSubmit"
    );

    dispatch(
      submitInternalUser(
        logDetails,
        {
          loginEmail: values?.userEmail,
          userName: values?.userName,
          roleId: values?.role,
          subRoleId: values?.subRole,
        },
        false,
        handleClose
      )
    );
    // handleClose();
  };

  return (
    <Formik
      initialValues={addInternalUsersInitialValues}
      validationSchema={addInternalUsersSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {(form) => (
        <Form>
          <Dialog open={open} onClose={handleClose}>
            <HrModalBox>
              <DialogTitle>
                <Typography variant="h2" style={{ fontWeight: "normal" }}>
                  Add an User
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
                  name="role"
                  label="Select Role*"
                  optionLabel="roleName"
                  optionValue="userRolesId"
                  options={rolesLists}
                  onRoleSelection={() => onRoleSelection(subRolesLists)}
                />

                <Field
                  component={BaseSelect}
                  name="subRole"
                  label="Select Sub Role*"
                  optionLabel="title"
                  optionValue="id"
                  options={subRolesLists}
                  disable={disable}
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
                <Button
                  variant="outlined"
                  style={{
                    backgroundColor: "#527AFB",
                    color: "#fff",
                    paddingLeft: "30px",
                    paddingRight: "30px",
                    marginLeft: "20px",
                    border: "1px solid #527AFB",
                  }}
                  type="submit"
                  disableElevation
                  onClick={form.submitForm}
                >
                  Add
                </Button>
              </DialogActions>
            </HrModalBox>
          </Dialog>
        </Form>
      )}
    </Formik>
  );
};

export default AddInternalUsersModal;
