
import { StyledCandidateProfileSidebarItems } from "../styled/StyledCandidateProfileSidebar";

const CandidateProfileSidebarItems = ({ value, items, item, onChange }) => {
  return (
    <StyledCandidateProfileSidebarItems
      value={value || ""}
      variant="scrollable"
      orientation="vertical"
      aria-label="Candidate Profile Tabs"
      onChange={onChange}
    >
      {items?.map((v, i) => item(v, i))}
    </StyledCandidateProfileSidebarItems>
  );
};

export { CandidateProfileSidebarItems };
