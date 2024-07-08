import { Paper, Table, TableContainer, styled } from "@mui/material";

const StyledMainTable = styled(Table)(({ theme, removeTableBottomBorder }) => ({
  borderRadius: "5px",
  border: `1px solid ${theme.palette.grey[400]}`,
  marginBottom: "10px",
  borderCollapse: "initial",

  "& .MuiTableHead-root": {
    //backgroundColor: theme.palette.grey[100],
    backgroundColor: "transparent",
    "& .MuiTableCell-root": {
      fontWeight: 550,
      borderBottom: `1px solid ${theme.palette.grey[400]}`,
    },
    // "& .MuiTableCell-root:first-child": {
    //   borderRadius: "10px 0 0 0",
    // },
    // "& .MuiTableCell-root:last-child": {
    //   borderRadius: "0 10px 0 0",
    // },
  },

  "& .MuiTableCell-root": {
    fontSize: "12px",
    padding: "10px",
    borderBottom: removeTableBottomBorder
      ? "none"
      : `1px solid ${theme.palette.grey[400]}`,
  },
}));

const CMTableComponent = ({ children, removeTableBottomBorder = false }) => {
  return (
    <TableContainer component={Paper}>
      <StyledMainTable
        size="small"
        removeTableBottomBorder={removeTableBottomBorder}
      >
        {children}
      </StyledMainTable>
    </TableContainer>
  );
};

export default CMTableComponent;
