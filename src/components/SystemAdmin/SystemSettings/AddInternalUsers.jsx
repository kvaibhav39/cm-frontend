import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import PanelCard from "../../../common/cards/PanelCard";
import {
  getInternalUsersLists,
  getRolesLists,
} from "../../../store/actions/systemAdminActions";
import AddInternalUsersModal from "./components/AddInternalUsersModal";
import SystemAdminTable from "../common/SystemAdminTable";
import { getTimestampFromString } from "../../../utils/DateTimeHelper";
import { getCurrentFileNameAndFunction } from "../../../utils/getCurrentFileNameAndFunction";

const AddInternalUsers = () => {
  const dispatch = useDispatch();
  const [modal, setmodal] = useState(false);
  const { internalUsersLists, loading } = useSelector(
    (state) => state.systemAdmin
  );

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    //only ops user
    dispatch(getRolesLists([4], logDetails));
    dispatch(getInternalUsersLists(logDetails));
  }, []);

  const columns = [
    {
      field: "userName",
      headerName: "User Name",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "loginEmail",
      headerName: "User Email",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "roleName",
      headerName: "Role",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "subRoleName",
      headerName: "Sub Role",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "createdBy",
      headerName: "Created By",
      width: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "createdAt",
      headerName: "Created On",
      width: 180,
      align: "center",
      headerAlign: "center",
      type: "date",
      valueFormatter: ({ value }) => getTimestampFromString(value),
    },
  ];

  return (
    <>
      <PanelCard>
        <Grid
          container
          justifyContent={{ xs: "center", sm: "flex-end" }}
          sx={{ marginBottom: "2em" }}
        >
          <Button
            variant="contained"
            size="small"
            disableElevation
            startIcon={<AddIcon />}
            onClick={() => setmodal(true)}
          >
            Add Internal Users
          </Button>
        </Grid>

        <SystemAdminTable
          columns={columns}
          rows={internalUsersLists || []}
          rowId="usersId"
          loading={loading}
        />
      </PanelCard>

      {modal && (
        <AddInternalUsersModal
          open={modal}
          handleClose={() => setmodal(false)}
        />
      )}
    </>
  );
};

export default AddInternalUsers;
