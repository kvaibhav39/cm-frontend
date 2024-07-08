import { StyledCandidateProfileSidebarItem } from "../styled/StyledCandidateProfileSidebar";

import DefaultIcon from "@mui/icons-material/AdjustOutlined";

const CandidateProfileSidebarItem = ({ icon = <DefaultIcon />, ...props }) => {
  return (
    <StyledCandidateProfileSidebarItem
      icon={icon}
      iconPosition="start"
      {...props}
    />
  );
};

export { CandidateProfileSidebarItem };
