import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import { Box, Grid, Typography, styled } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Field } from "formik";
import { BaseSelect } from "../../../base";
import { useSelector } from "react-redux";
import { getSubrolesOfRole } from "../../../../store/actions/hrActions";
import { useDispatch } from "react-redux";
import CircularLoader from "./../../../../common/CircularLoader";
import { getPermissionsPerPermissionType } from "../../../../store/actions/systemAdminActions";
import {
  GET_PERMISSIONS_DATA_AS_PER_PERMISSION_TYPE,
  GET_SUBROLES,
} from "../../../../store/actions/actionTypes";
import { useEffect } from "react";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction";

const ModalBox = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 0px 5px;
  min-height: 30vh;
  min-width: 50vw;
`;

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AddRemovalPermissionModal = ({
  open,
  handleClose,
  form,
  handleAddPermission,
  reinitializeFields,
}) => {
  const dispatch = useDispatch();

  const {
    permissionsListAsPerPermissionType,
    rolesLists,
    permissionTypeLoading,
  } = useSelector((state) => state.systemAdmin);
  const { subRolesLists, loading } = useSelector((state) => state.hr);

  useEffect(() => {
    reinitializeFields(form);
    form.setFieldValue("roleId", null);
    form.setFieldTouched("roleId", false);
    dispatch({ type: GET_SUBROLES, payload: null });
    dispatch({
      type: GET_PERMISSIONS_DATA_AS_PER_PERMISSION_TYPE,
      payload: null,
    });
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          maxWidth: "none",
          maxHeight: "95vh",
          overflow: "none",
        },
      }}
    >
      <ModalBox>
        <StyledDialogContent>
          <Grid container flexDirection="column" alignItems="center" gap={2}>
            <Grid item xs={12} md={10} width="100%">
              <Field
                component={BaseSelect}
                name="roleId"
                label="Select role*"
                optionLabel="roleName"
                optionValue="userRolesId"
                options={rolesLists}
                runWhenSelect={(val) => {
                  let logDetails = getCurrentFileNameAndFunction(
                    import.meta.url,
                    "runWhenSelect"
                  );

                  dispatch(getSubrolesOfRole(logDetails, { roleId: val }));
                  reinitializeFields(form);
                  dispatch({
                    type: GET_PERMISSIONS_DATA_AS_PER_PERMISSION_TYPE,
                    payload: null,
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} md={10} width="100%">
              {loading ? (
                <CircularLoader size={25} height="8vh" />
              ) : (
                <Field
                  component={BaseSelect}
                  name="subRoleId"
                  label="Select sub-role*"
                  optionLabel="title"
                  optionValue="id"
                  options={subRolesLists}
                  disable={subRolesLists === null}
                  runWhenSelect={(val) => {
                    let logDetails = getCurrentFileNameAndFunction(
                      import.meta.url,
                      "runWhenSelect"
                    );

                    dispatch(
                      getPermissionsPerPermissionType(
                        form.values?.permissionType,
                        val,
                        logDetails
                      )
                    );
                    reinitializeFields(form, true);
                    dispatch({
                      type: GET_PERMISSIONS_DATA_AS_PER_PERMISSION_TYPE,
                      payload: null,
                    });
                  }}
                />
              )}
            </Grid>

            <Grid item xs={12} md={10} width="100%">
              {permissionTypeLoading ? (
                <CircularLoader size={25} height="8vh" />
              ) : permissionsListAsPerPermissionType ? (
                permissionsListAsPerPermissionType?.length ? (
                  <>
                    {form.values?.permissionType === "action_permission" ? (
                      <Field
                        component={BaseSelect}
                        name="permissionsActionsId"
                        label="Select action permission to remove*"
                        optionLabel="actionName"
                        optionValue="permissionsActionsId"
                        options={permissionsListAsPerPermissionType}
                        disable={permissionsListAsPerPermissionType === null}
                      />
                    ) : (
                      <Field
                        component={BaseSelect}
                        name="permissionsPagesId"
                        label="Select page permission to remove*"
                        optionLabel="pageName"
                        optionValue="permissionsPagesId"
                        options={permissionsListAsPerPermissionType}
                        disable={permissionsListAsPerPermissionType === null}
                      />
                    )}
                  </>
                ) : (
                  <Typography textAlign="center" fontWeight={550}>
                    No permissions present
                  </Typography>
                )
              ) : null}
            </Grid>
          </Grid>
        </StyledDialogContent>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleClose}
            disableElevation
          >
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            color="warning"
            disableElevation
            loading={form.isSubmitting}
            onClick={() => handleAddPermission(form.values, form)}
            disabled={!permissionsListAsPerPermissionType?.length}
          >
            Add
          </LoadingButton>
        </DialogActions>
      </ModalBox>
    </Dialog>
  );
};

export default AddRemovalPermissionModal;
