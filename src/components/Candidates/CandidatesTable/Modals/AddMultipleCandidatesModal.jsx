import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { Grid, Box, useMediaQuery } from "@mui/material";
import styled from "@emotion/styled";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import BaseMultipleCandidatesUpload from "../../../base/BaseMultipleCandidatesUpload";
import { mainColumnsForFailedCandidates } from "../../utils/mainColumnsForFailedCandidates";
import CloseIcon from "@mui/icons-material/Close";
import UpdateFailedDataModal from "./UpdateFailedDataModal";
import { useDispatch } from "react-redux";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { deleteFailedCandidateData } from "../../../../store/actions/hrActions";
import { getCurrentFileNameAndFunction } from "../../../../utils/getCurrentFileNameAndFunction.js";

const HrModalBox = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 0px 10px;
  min-height: 55vh;
  min-width: 90vw;
  overflow-y: scroll;
`;

const StyledDialogContent = styled(DialogContent)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AddMultipleCandidatesModal = ({
  open,
  handleClose,
  resetOpsCandidatesTableFilters,
}) => {
  const [excelDataFailedToUpload, setExcelDataFailedToUpload] = useState([]);
  const [columns, setColumns] = useState([]);
  const [updateFailedDataModal, setUpdateFailedDataModal] = useState(false);
  const [selectedFailedData, setSelectedFailedData] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);

  const theme = useTheme();
  const dispatch = useDispatch();

  const smallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const bigScreen = useMediaQuery(theme.breakpoints.up("xxl"));

  //adding custom fields data inside columns
  const addCustomFieldsDataInColumns = (resultedArr) => {
    //getting default column names
    let tempColumns = mainColumnsForFailedCandidates(
      setUpdateFailedDataModal,
      setSelectedFailedData,
      dispatch,
      theme,
      setDeleteModal
    );

    resultedArr?.forEach((row, index) => {
      row?.customFields?.forEach((customField, ind) => {
        for (let objKey in customField) {
          if (!tempColumns.find((curr) => curr.field === objKey)) {
            tempColumns.push({
              headerName: objKey,
              field: objKey,
              width: 200,
              headerAlign: "center",
              align: "center",
              valueGetter: (params) => {
                //searching if customFields array has any 'objKey' field , if there is one then
                //we will simple access it's value through '[objKey]'
                let tempObj = params.row?.customFields?.find((curr) =>
                  curr?.hasOwnProperty(objKey)
                );
                return tempObj ? tempObj[objKey] : "";
              },
            });
          }
        }
      });
    });
    setColumns((prev) => (prev = tempColumns));
  };

  //adding custom fields as a new key inside each row data
  const addCustomFieldsInsideArray = (jsonData) => {
    let tempColumns = mainColumnsForFailedCandidates(
      setUpdateFailedDataModal,
      setSelectedFailedData,
      dispatch,
      theme,
      setDeleteModal
    );

    let tempArr = [...jsonData];

    tempArr?.forEach((row, index) => {
      let customFields = [];

      let tempColumn1 = tempColumns.map((curr) => curr.field);

      for (let objKey in row) {
        if (!tempColumn1.includes(objKey)) {
          customFields.push({ [objKey]: row[objKey] });
          delete row[objKey];
        }
      }
      row.customFields = customFields;
    });
    return tempArr;
  };

  const handleDeleteFailedData = () => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "handleDeleteFailedData"
    );

    dispatch(
      deleteFailedCandidateData(
        selectedFailedData.id,
        setDeleteModal,
        logDetails
      )
    );
  };
  return (
    <>
      <Grid item xs={12}>
        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              maxWidth: "none",
              maxHeight: "95vh",
              overflowY: "scroll",
            },
          }}
        >
          <HrModalBox>
            <StyledDialogContent>
              {/* file upload */}
              <Grid xs={12} container>
                <Grid
                  item
                  xs={11}
                  display="flex"
                  alignItems="center"
                  flexDirection={{ xs: "column", md: "row" }}
                  justifyContent={{ xs: "center" }}
                  textAlign="center"
                >
                  <BaseMultipleCandidatesUpload
                    key="add_multiple_candidates"
                    id="add_multiple_candidates"
                    theme={theme}
                    setExcelDataFailedToUpload={setExcelDataFailedToUpload}
                    addCustomFieldsDataInColumns={addCustomFieldsDataInColumns}
                    addCustomFieldsInsideArray={addCustomFieldsInsideArray}
                    updateFailedDataModal={updateFailedDataModal}
                    resetOpsCandidatesTableFilters={
                      resetOpsCandidatesTableFilters
                    }
                  />
                </Grid>
                <Grid item xs={1} display="flex" justifyContent="flex-end">
                  <CloseIcon onClick={handleClose} sx={{ cursor: "pointer" }} />
                </Grid>
              </Grid>

              {/*table of failed datas */}
              <div
                style={{
                  height: bigScreen ? 750 : 350,
                }}
              >
                <DataGrid
                  initialState={{
                    sorting: {
                      sortModel: [{ field: "createdAt", sort: "desc" }],
                    },
                  }}
                  components={{ Toolbar: smallScreen ? "none" : GridToolbar }}
                  disableColumnFilter
                  disableColumnSelector
                  rows={excelDataFailedToUpload}
                  columns={columns}
                  density="standard"
                  getRowId={(row) => row.candidateEmail}
                  xs={{ width: "100vw" }}
                  hideFooter
                  hideFooterPagination
                />
              </div>
            </StyledDialogContent>
          </HrModalBox>
        </Dialog>
      </Grid>
      {updateFailedDataModal ? (
        <UpdateFailedDataModal
          key="update-failed-data-modal"
          open={updateFailedDataModal}
          handleClose={() => setUpdateFailedDataModal(false)}
          selectedFailedData={selectedFailedData}
          columns={columns}
          smallScreen={smallScreen}
          resetOpsCandidatesTableFilters={resetOpsCandidatesTableFilters}
        />
      ) : null}
      {deleteModal ? (
        <DeleteConfirmationModal
          key="delete-failed-data-modal"
          open={deleteModal}
          handleClose={() => setDeleteModal(false)}
          handleDeleteFailedData={handleDeleteFailedData}
        />
      ) : null}
    </>
  );
};

export default AddMultipleCandidatesModal;
