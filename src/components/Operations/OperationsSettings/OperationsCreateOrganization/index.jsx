import { Button, Grid, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddHrModal from "./components/AddHrModal";
import AddIcon from "@mui/icons-material/Add";
import { getAllIndustries, getOrganizations } from "../../../../store/actions/organizationAction";
import SwitchAccountInOpsModal from "./../../OperationsCandidates/OperationsCaseManagement/components/innerComponents/CMCheckStatus/components/SwitchAccountInOpsModal";
import CustomTooltip from "../../../common/CustomTooltip";
import { DataGrid, GridActionsCellItem, GridToolbar } from "@mui/x-data-grid";
import LoginIcon from "@mui/icons-material/Login";
import { useSearchParams } from "react-router-dom";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .MuiDataGrid-columnHeaderTitleContainerContent": {
    width: "100%",
    justifyContent: "center",
  },

  "& .MuiDataGrid-row": {
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
    paddingBottom: "10px",

    width: `calc(100% - 1.2px)`,
  },

  "& .MuiDataGrid-cell": {
    borderBottom: "none",
    marginTop: "5px",
  },
}));

const OperationsCreateOrganization = () => {
  const [modal, setmodal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [selectedHr, setSelectedHr] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { organizations, loading, allIndustries } = useSelector(
    (state) => state.organizations
  );

  const dispatch = useDispatch();

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    if (!organizations?.length) {
      dispatch(getOrganizations(logDetails,{ isVendor: 1 }));
    }
    !allIndustries && dispatch(getAllIndustries(logDetails));
  }, []);

  const columnActionArray = (params) => {
    let tempActionArray = [];

    tempActionArray.push(
      <GridActionsCellItem
        icon={
          <CustomTooltip title="Login into hr">
            <LoginIcon color="info" />
          </CustomTooltip>
        }
        label="Login"
        onClick={() => {
          setLoginModal(true);
          setSelectedHr(params?.row?.hrOrganization[0]);
        }}
      />
    );

    return tempActionArray;
  };

  const columns = [
    {
      field: "hrOrganizationName",
      headerName: "Organization Name",
      flex: 1,
      minWidth: 350,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "isVendor",
      headerName: "Vendor",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "createdBy",
      headerName: "Created By",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "updatedBy",
      headerName: "Updated By",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      headerName: "ACTIONS",
      type: "actions",
      flex: 1,
      getActions: (params) => columnActionArray(params),
    },
  ];

  const handlePageChange = (newPage) => {
    setSearchParams((prevParams) => {
      return new URLSearchParams({
        ...Object.fromEntries(prevParams.entries()),
        page: newPage + 1,
      });
    });
  };

  return (
    <>
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
          Create Organization
        </Button>
      </Grid>

      <div
        style={{
          height: 450,
        }}
      >
        <StyledDataGrid
          initialState={{
            sorting: {
              sortModel: [{ field: "createdAt", sort: "desc" }],
            },
          }}
          components={{ Toolbar: GridToolbar }}
          rows={organizations}
          columns={columns}
          pageSize={6}
          rowsPerPageOptions={[20]}
          getRowId={(row) => row?.hrOrganizationsId}
          disableColumnFilter={false}
          density="standard"
          getRowHeight={() => "auto"}
          page={searchParams.get("page") ? +searchParams.get("page") - 1 : 0}
          onPageChange={(newPage) => handlePageChange(newPage)}
          loading={loading}
        />
      </div>

      {modal && <AddHrModal open={modal} handleClose={() => setmodal(false)} />}

      {loginModal ? (
        <SwitchAccountInOpsModal
          open={loginModal}
          handleClose={() => setLoginModal(false)}
          rows={organizations}
          selectedCandidate={selectedHr}
          switchAccountInto="HR"
        />
      ) : null}
    </>
  );
};

export default OperationsCreateOrganization;
