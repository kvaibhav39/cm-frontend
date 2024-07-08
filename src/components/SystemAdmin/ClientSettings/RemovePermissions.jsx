import { Box, Button, Grid, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Field, Form, Formik, setNestedObjectValues } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import { removePermissionsSchema } from "../helpers/Schema/removePermissions";
import { PERMISSION_TYPES } from "../../../store/constant";
import { BaseSelect } from "../../base";
import {
  addRemovalPermissionsData,
  deleteRemovalPermissionsData,
  getRemovalPermissionsData,
  getRolesLists,
} from "../../../store/actions/systemAdminActions";

import AddRemovalPermissionModal from "./components/AddRemovalPermissionModal";
import SystemAdminTable from "../common/SystemAdminTable";
import { getTimestampFromString } from "./../../../utils/DateTimeHelper";
import { GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import DeleteClientSettingsModal from "./components/DeleteClientSettingsModal";
import { GET_REMOVAL_PERMISSIONS_DATA } from "../../../store/actions/actionTypes";
import { LoadingButton } from "@mui/lab";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const RemovePermissions = () => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const formRef = useRef();

  const { selectedOrg, removalPermissionsData, rolesLists, loading } =
    useSelector((state) => state.systemAdmin);

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    //hr, candidate
    dispatch(getRolesLists([2, 3], logDetails));
    return () =>
      dispatch({
        type: GET_REMOVAL_PERMISSIONS_DATA,
        payload: null,
      });
  }, []);

  useEffect(() => {
    let form = formRef.current;
    onPermissionTypeSelect(form?.values?.permissionType, form);
  }, [selectedOrg]);

  let permissionTypeList = [
    {
      permissionType: PERMISSION_TYPES.ACTION_PERMISSION,
      permissionName: "ACTION PERMISSION",
    },
    {
      permissionType: PERMISSION_TYPES.PAGE_PERMISSION,
      permissionName: "PAGE PERMISSION",
    },
  ];

  let removepermissionsInitialValues = useMemo(() => {
    let initialObj = {
      permissionType: formRef.current?.values?.permissionType || "",
      roleId: null,
      subRoleId: null,
      permissionsActionsId: null,
      permissionsPagesId: null,
    };

    return initialObj;
  }, [selectedOrg]);

  const onPermissionTypeSelect = (permissionType, form) => {
    if (permissionType) {
      reinitializeFields(form);
      setModal(false);

      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "onPermissionTypeSelect"
      );

      dispatch(
        getRemovalPermissionsData(selectedOrg, permissionType, logDetails)
      );
    }
  };

  const reinitializeFields = (form, onlyPermissionFields = false) => {
    form.setFieldValue("permissionsActionsId", null);
    form.setFieldTouched("permissionsActionsId", false);

    form.setFieldValue("permissionsPagesId", null);
    form.setFieldTouched("permissionsPagesId", false);

    if (!onlyPermissionFields) {
      form.setFieldValue("subRoleId", null);
      form.setFieldTouched("subRoleId", false);
    }
  };

  const columns = [
    {
      field: "actionName",
      headerName: "Action Permission",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "pageName",
      headerName: "Page Permission",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "subRoleName",
      headerName: "Sub Role",
      flex: 1,
      minWidth: 150,
      renderCell: (params) =>
        params.row?.orgSubRoleName || params.row?.teamSubRoleName,
    },
    {
      field: "createdAt",
      headerName: "Created On",
      flex: 1,
      minWidth: 150,
      type: "date",
      valueFormatter: ({ value }) => getTimestampFromString(value),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => columnActionArray(params),
    },
  ];

  const columnActionArray = (params) => {
    let tempActionArray = [];

    tempActionArray.push(
      <GridActionsCellItem
        icon={<DeleteIcon color="error" />}
        label="delete"
        onClick={() => {
          setDeleteModal(true);
          setSelectedRowId(params.id);
        }}
      />
    );

    return tempActionArray;
  };

  const handleAddPermission = async (values, form) => {
    const validationErrors = await form.validateForm();

    if (Object.keys(validationErrors)?.length) {
      return form.setTouched(setNestedObjectValues(validationErrors, true));
    }

    form.setSubmitting(true);

    delete values?.roleId;

    if (values?.permissionsActionsId) {
      delete values.permissionsPagesId;
    } else {
      delete values.permissionsActionsId;
    }

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleAddPermission"
    );

    dispatch(
      addRemovalPermissionsData(
        selectedOrg,
        values,
        () => {
          form.setSubmitting(false);
          setModal(false);
        },
        logDetails
      )
    );
  };

  const handleRemovePermission = () => {
    let selectedPermissionData = removalPermissionsData?.find(
      (curr) => curr.id === selectedRowId
    );

    let params = {
      hrOrganizationId: selectedOrg,
      permissionType: formRef.current?.values?.permissionType,
      removalMappingId: selectedPermissionData?.id,
      permissionsActionsId:
        selectedPermissionData?.permissionsActionsId || null,
      permissionsPagesId: selectedPermissionData?.permissionsPagesId || null,
    };

    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleRemovePermission"
    );

    dispatch(
      deleteRemovalPermissionsData(
        params,
        () =>
          onPermissionTypeSelect(
            formRef.current?.values?.permissionType,
            formRef.current
          ),
        logDetails
      )
    );
    setDeleteModal(false);
  };

  return (
    <>
      {selectedOrg ? (
        <Box sx={{ height: "70vh", overflow: "scroll" }} px={1}>
          <Formik
            enableReinitialize
            initialValues={removepermissionsInitialValues}
            validationSchema={removePermissionsSchema}
            innerRef={formRef}
          >
            {(form) => (
              <Form>
                <Grid
                  container
                  justifyContent="center"
                  sx={{ marginBottom: "1em" }}
                >
                  <Grid item xs={12} md={6}>
                    <Field
                      component={BaseSelect}
                      name="permissionType"
                      label="Select permission type*"
                      optionLabel="permissionName"
                      optionValue="permissionType"
                      options={permissionTypeList}
                      runWhenSelect={(val) => onPermissionTypeSelect(val, form)}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    display="flex"
                    justifyContent={{ xs: "center", md: "flex-end" }}
                    mt={1}
                  >
                    <LoadingButton
                      variant="contained"
                      size="small"
                      disableElevation
                      disabled={
                        !form.values.permissionType || !rolesLists || loading
                      }
                      loading={loading}
                      onClick={() => setModal(true)}
                    >
                      Remove permission
                    </LoadingButton>
                  </Grid>
                </Grid>
                <SystemAdminTable
                  columns={columns}
                  rows={removalPermissionsData || []}
                  disableColumnFilter={false}
                  loading={loading}
                />
                {modal ? (
                  <AddRemovalPermissionModal
                    open={modal}
                    handleClose={() => setModal(false)}
                    form={form}
                    handleAddPermission={handleAddPermission}
                    reinitializeFields={reinitializeFields}
                  />
                ) : null}
                {deleteModal && (
                  <DeleteClientSettingsModal
                    deleteText="Do you want to delete this permission setting?"
                    open={deleteModal}
                    handleClose={() => setDeleteModal(false)}
                    handleDelete={handleRemovePermission}
                  />
                )}
              </Form>
            )}
          </Formik>
        </Box>
      ) : (
        <Typography textAlign="center" mt={4} fontWeight={600}>
          Please select an organization
        </Typography>
      )}
    </>
  );
};

export default RemovePermissions;
