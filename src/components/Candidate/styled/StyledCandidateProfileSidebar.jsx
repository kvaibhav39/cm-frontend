import { styled, Tab, Tabs } from "@mui/material";

const StyledCandidateProfileSidebarItems = styled(Tabs)`
  .MuiTabs-indicator {
    display: none;
  }
`;

const StyledCandidateProfileSidebarItem = styled(Tab)(({ theme }) => ({
  textAlign: "left",
  justifyContent: "flex-start",
  color: "#5E5873",
  // padding: "0px",
  borderRadius: "4px",
  fontSize: "14px",
  minHeight: "42px",
  "&.Mui-selected": {
    color: "#5874F6",
    backgroundColor: "#F0F3FE",
  },
}));

export {
  StyledCandidateProfileSidebarItems,
  StyledCandidateProfileSidebarItem,
};
