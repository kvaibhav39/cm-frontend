import { Paper, styled } from "@mui/material";
import ScrollableGrid from "../../../common/ScrollableGrid";

const StyledPaper = styled(Paper)`
  padding: 1rem;
  box-shadow: 0 7px 20px rgba(0, 0, 0, 0.1);
  min-height: 100%;
`;

const StyledBasePaper = ({ children, scrollHeightRefree, ...props }) => {
  return (
    <>
      {/*Every candidate section component is wrapped in styledbasepaper component 
    which again is wrapped with our scroll component meaning all the sections will have 
    the scroll for md and above screens as applyScrollToScreenAndBelow property is sent as false.
    For md and below screens , in 'CandidateProfileLayout' page the whole return is wrapped with 
    scroll component which will handle the scrolling */}
      <ScrollableGrid
        scrollHeight={
          scrollHeightRefree || { xs: "85vh", lg2: "87vh", xxl: "90vh" }
        }
        applyScrollToScreenAndBelow={false}
      >
        <StyledPaper {...props}>{children}</StyledPaper>
      </ScrollableGrid>
    </>
  );
};

export { StyledBasePaper };
