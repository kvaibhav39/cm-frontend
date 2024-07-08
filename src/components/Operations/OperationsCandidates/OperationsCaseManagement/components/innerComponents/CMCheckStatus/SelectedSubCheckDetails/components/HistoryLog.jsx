import { Box, Divider, Typography, styled } from "@mui/material";
import React, { useEffect, useMemo } from "react";
import {
  History,
  PermMediaOutlined,
  PictureAsPdfOutlined,
  ArticleOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSearchParams } from "react-router-dom";
import { getActionLog } from "../../../../../../../../../store/actions/operationActions";
import { useDispatch, useSelector } from "react-redux";
import CircularLoader from "../../../../../../../../../common/CircularLoader";
import moment from "moment";
import CustomToolTip from "../../../../../../../../common/CustomTooltip";
import CommonHeadingComponent from "./innerComponents/CommonHeadingComponent";
import { getCurrentFileNameAndFunction } from "../../../../../../../../../utils/getCurrentFileNameAndFunction";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  background: `${theme.palette.primary[100]}`,
  fontSize: 10,

  "& .MuiDataGrid-columnHeaders": {
    // border: `1px solid ${theme.palette.grey[700]}`,
    // borderRadius: "10px",
    border: "none",
    background: "transparent",
  },

  "& .MuiDataGrid-columnHeaderTitleContainerContent": {
    width: "100%",
    justifyContent: "center",
  },

  "& .MuiDataGrid-row": {
    // marginTop: "10px",
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
    paddingBottom: "10px",
    // border: "none",
    // borderRadius: "10px",
    width: `calc(100% - 1.2px)`,
  },

  "& .MuiDataGrid-cell": {
    borderBottom: "none",
    marginTop: "5px",
  },

  "& .MuiDataGrid-footerContainer": {
    borderTop: "none",
  },
}));

const HistoryLog = () => {
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const {
    loading,
    actionLogLists = [],
    subChecksList,
    selectedSubCheckId,
  } = useSelector((state) => state.operations);

  let selectedSubCheck = useMemo(() => {
    return subChecksList?.find((curr) => curr.id === selectedSubCheckId);
  }, [subChecksList, selectedSubCheckId]);

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );

    if (selectedSubCheck) {
      dispatch(
        getActionLog(
          selectedSubCheck?.id,
          +searchParams.get("candidatesCasesId"),
          logDetails
        )
      );
    }
  }, [selectedSubCheck]);

  const columns = [
    {
      field: "categoryNameL1",
      headerName: "Category",
      align: "center",
      flex: 1,
    },
    {
      field: "categoryNameL2",
      headerName: "Sub Category",
      align: "center",
      flex: 1,
    },
    {
      field: "categoryNameL3",
      headerName: "Additional Category",
      align: "center",
      flex: 1,
    },
    {
      field: "logDetails",
      headerName: "Details/Descriptions",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        const logDetails = JSON.parse(params.row.logDetails);

        const renderKeyValuePairs = (obj) => {
          return Object.entries(obj).map(([key, value]) => (
            <Box key={key} mb={0.5}>
              {!key.includes("Please") ? (
                <strong style={{ textTransform: "capitalize" }}>{key}:</strong>
              ) : null}{" "}
              {value}
            </Box>
          ));
        };

        const renderField = (field) => {
          if (logDetails[field] && typeof logDetails[field] === "object") {
            // Handle extra fields if present
            const extraFields = logDetails[field];
            const extraFieldLabel = extraFields.label
              ? `${extraFields.label}`
              : "";

            // Render extra field text at the top
            const extraFieldLabelElement = extraFieldLabel ? (
              <Box key={`${field}-label`} mb={0.5} textTransform="capitalize">
                <strong>{extraFieldLabel}</strong>
              </Box>
            ) : null;

            //to avoid duplicate labels getting rendered
            delete extraFields.label;

            return (
              <Box key={field} mb={0.5}>
                {extraFieldLabelElement}
                {renderKeyValuePairs(extraFields)}
              </Box>
            );
          } else {
            // Render normal key-value pair
            return renderKeyValuePairs({ [field]: logDetails[field] });
          }
        };

        return (
          <Typography
            fontWeight={500}
            fontSize={10}
            sx={{
              overflow: "auto !important",
              whiteSpace: "normal !important",
              wordBreak: "break-word !important",
              color: "#6e6b7b",
            }}
          >
            {Object.keys(logDetails).map((field) => renderField(field))}
          </Typography>
        );
      },
    },
    {
      field: "attachmentsData",
      headerName: "Attachment(s)",
      align: "center",
      minWidth: 160,
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" flexWrap="wrap" gap={0.25}>
          {params.row.attachmentsData?.length ? (
            <>
              {params.row.attachmentsData?.map((file) => {
                let icon;
                if (
                  file.attachmentName.includes("jpg") ||
                  file.attachmentName.includes("jpeg") ||
                  file.attachmentName.includes("png")
                ) {
                  icon = <PermMediaOutlined />;
                } else if (file.attachmentName.includes("pdf")) {
                  icon = <PictureAsPdfOutlined />;
                } else if (
                  file.attachmentName.includes("doc") ||
                  file.attachmentName.includes("docx")
                ) {
                  icon = <ArticleOutlined />;
                }
                return (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={0.5}
                    sx={{
                      background: "#fff",
                      borderRadius: "5px",
                      transform: "scale(0.8)",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      window.open(file.attachmentPath, "_blank", "noreferrer")
                    }
                  >
                    <CustomToolTip title={file?.attachmentName}>
                      {icon}
                    </CustomToolTip>
                  </Box>
                );
              })}
            </>
          ) : null}
        </Box>
      ),
    },
    {
      field: "updatedBy",
      headerName: "Updated By",
      align: "center",
      flex: 1,
    },
    {
      field: "updatedAt",
      headerName: "Updated On",
      align: "center",
      flex: 1,
      renderCell: (params) => (
        <Typography textAlign="center" fontSize={10}>
          {moment(params.row.updatedAt).format("DD MMM YYYY [at] h:mm:ss A")}
        </Typography>
      ),
    },
  ];

  return (
    <>
      <Divider
        sx={{ width: "95%", margin: "10px auto", color: "#000", height: "4px" }}
      />
      <Box px={2} py={1} gap={1}>
        <CommonHeadingComponent
          open={open}
          setOpen={setOpen}
          IconComponent={<History />}
          title="Sub-Check Audit History Trail"
        />

        {open ? (
          <>
            {" "}
            {!loading ? (
              <Box sx={{ height: "60vh", width: "100%" }} mt={1}>
                <StyledDataGrid
                  getRowId={(row) => row?.updatedAt}
                  getRowHeight={() => "auto"} //row height will increase if cell data is too large
                  density="comfortable"
                  rows={actionLogLists || []}
                  columns={columns}
                  pageSize={7}
                  rowsPerPageOptions={[20]}
                  disableRowSelectionOnClick
                  disableColumnMenu
                  editMode={false}
                />
              </Box>
            ) : (
              <CircularLoader size={40} height="10vh" />
            )}
          </>
        ) : null}
      </Box>
    </>
  );
};

export default HistoryLog;
