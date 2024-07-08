import { Alert, styled } from "@mui/material";

export const StyledAlert = styled(Alert)`
  color: #565261;
  max-width: 1200px;
  border: 1px solid #dcdddf;
  background-color: #f2f5fe;
  .MuiAlert-icon {
    display: none;
  }
  .MuiAlert-message {
    max-width: 950px;
  }
  a {
    color: #5874f6;
    text-decoration: none;
  }
`;

export const StyledRadioAlert = styled(Alert)`
  max-width: 1080px;
  align-items: center;
  padding-right: 2rem;
  border: 1px solid #6983f6;
  word-break:break-word;
  .MuiAlert-message {
    padding: 0;
    max-width: 768px;
  }
  .MuiAlert-icon {
    display: none;
  }
`;
