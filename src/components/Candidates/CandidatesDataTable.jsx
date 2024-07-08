import moment from "moment";
import {
  Visibility,
  HighlightOff,
  InsertDriveFile,
  DoNotDisturbAlt,
  CheckCircleOutline,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  Paper,
  Table,
  Stack,
  styled,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  TableContainer,
  tableCellClasses,
  Typography,
  IconButton,
} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    fontSize: 13,
    color: "#655C77",
    textAlign: "center",
    textTransform: "uppercase",
    backgroundColor: "#F2F4FE",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    fontWeight: 500,
    color: "#9794A0",
    textAlign: "center",
    whiteSpace: "nowrap",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const headers = [
  {
    text: "Verification Result",
    value: "1",
  },
  {
    text: "Process Status",
    value: "1",
  },
  {
    text: "Check Status Preview",
    value: "1",
  },
  {
    text: "Candidate Name",
    value: "1",
  },
  {
    text: "Candidate Email",
    value: "1",
  },
  {
    text: "Hiring Country",
    value: "1",
  },
  {
    text: "Registered By",
    value: "1",
  },
  {
    text: "Registration Team",
    value: "1",
  },
  {
    text: "Registration Date",
    value: "1",
  },
  {
    text: "Actions",
    value: "1",
  },
];

const CandidatesDataTable = ({ items = [] }) => {
  return (
    <TableContainer variant="outlined" component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <StyledTableCell key={index}>{header.text}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell>
                <Box
                  display="flex"
                  alignItems="center"
                  sx={{
                    "> *:not(:first-child)": {
                      marginLeft: "0.5rem",
                    },
                  }}
                >
                  <Box height="24px" width="24px">
                    {item.verificationResultStatusName && (
                      <HighlightOff color="error" />
                    )}
                  </Box>
                  <Typography>
                    {item.verificationResultStatusName || "NO RESULTS YET"}
                  </Typography>
                </Box>
              </StyledTableCell>
              <StyledTableCell>
                <Chip
                  label={item.verificationProcessStatusName}
                  sx={{ color: "#00C95C", backgroundColor: "#D9F9EB" }}
                />
              </StyledTableCell>
              <StyledTableCell>
                <Box
                  borderRadius="4rem"
                  padding="0.25rem 0.5rem"
                  sx={{ backgroundColor: "#F2F4FE" }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Stack direction="row" alignItems="center" spacing="4px">
                      <Chip
                        label={10}
                        size="small"
                        sx={{
                          color: "#00C95C",
                          backgroundColor: "#D9F9EB",
                          width: "22px",
                          height: "22px",
                          "> span": {
                            padding: 0,
                          },
                        }}
                      />
                      <Chip
                        label={2}
                        size="small"
                        sx={{
                          color: "#FF989A",
                          backgroundColor: "#FBDDE2",
                          width: "22px",
                          height: "22px",
                          "> span": {
                            padding: 0,
                          },
                        }}
                      />
                      <Chip
                        label={1}
                        size="small"
                        sx={{
                          color: "#FCBB68",
                          backgroundColor: "#FDF0D4",
                          width: "22px",
                          height: "22px",
                          "> span": {
                            padding: 0,
                          },
                        }}
                      />
                      <Chip
                        label={0}
                        size="small"
                        sx={{
                          color: "#90919C",
                          backgroundColor: "#DCDDE1",
                          width: "22px",
                          height: "22px",
                          "> span": {
                            padding: 0,
                          },
                        }}
                      />
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Chip
                        label={2}
                        size="small"
                        sx={{
                          color: "#FF989A",
                          backgroundColor: "#FBDDE2",
                          width: "22px",
                          height: "22px",
                          "> span": {
                            padding: 0,
                          },
                        }}
                      />
                      <Typography fontSize="12px">10/10</Typography>
                    </Stack>
                  </Stack>
                </Box>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>{item.candidateName}</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>{item.candidateEmail}</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>{item.hiringCountryName}</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>{item.createdByUser?.userName}</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>{item.hrTeamName}</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>
                  {moment(item.createdAt).format("DD/MM/YYYY")}
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <IconButton aria-label="close" size="small">
                  <Visibility fontSize="inherit" color="primary" />
                </IconButton>
                <IconButton aria-label="close" size="small">
                  <InsertDriveFile fontSize="inherit" color="error" />
                </IconButton>
                <IconButton aria-label="close" size="small">
                  <HighlightOff fontSize="inherit" color="error" />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          ))}          
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export { CandidatesDataTable };
