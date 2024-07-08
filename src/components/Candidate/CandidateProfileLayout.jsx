import { Outlet } from "react-router-dom";
import { createElement, useEffect } from "react";
import { StyledBasePaper } from "../base/styled";
import { Box, Button, Grid } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import * as MuiIcons from "@mui/icons-material";

import {
  CandidateProfileSidebarItem,
  CandidateProfileSidebarItems,
} from "./sidebar";
import ScrollableGrid from "../../common/ScrollableGrid";
import { useDispatch, useSelector } from "react-redux";
import { initialCandidateDetails } from "../../store/actions/candidateAction";
import CircularLoader from "../../common/CircularLoader";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction";

const CandidateProfileLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    candidateInitialDetails,
    candidateSidebarState,
    candidateSectionBackUrl,
    candidateSectionSubmitHandler,
    candidateSectionDisableSubmitBtn,
  } = useSelector((state) => state.candidate);
  const { candidateProfileSections } = candidateInitialDetails;

  useEffect(() => {
    let logDetails = getCurrentFileNameAndFunction(
      import.meta.url,
      "useEffect"
    );
    dispatch(initialCandidateDetails(logDetails, navigate, location));
  }, []);

  return (
    <Box>
      {candidateSidebarState ? (
        <>
          {/*added scroll bar component here so that in md and below screens , the whole page is scrollable */}
          <ScrollableGrid
            container
            spacing={2}
            scrollHeight={{
              xxl: "90vh",
              md: "85vh",
              xs: "100vh",
            }}
          >
            <Grid item md={2} xs={12}>
              <StyledBasePaper
                sx={{
                  display: "flex ",
                  flexDirection: "column",
                }}
              >
                <Box mb={2}>
                  <CandidateProfileSidebarItems
                    items={candidateProfileSections}
                    value={
                      candidateProfileSections?.length > 1
                        ? location.pathname
                        : "/candidate/profile"
                    }
                    onChange={(_, v) => {
                      navigate(v);
                    }}
                    item={(item, index) => {
                      return (
                        <CandidateProfileSidebarItem
                          key={index}
                          icon={createElement(MuiIcons[item.sectionIcon])}
                          value={item.sectionPath || ""}
                          label={item.candidateProfileSectionDisplayName}
                          disabled={
                            candidateSidebarState === "all"
                              ? true
                              : candidateSidebarState === "except_welcome" &&
                                item.sectionPath === "/candidate/profile"
                              ? false
                              : candidateSidebarState === "onHold" &&
                                item.onHold
                              ? false
                              : candidateSidebarState === "none"
                              ? false
                              : true
                          }
                        />
                      );
                    }}
                  />
                </Box>
                {location.pathname !== "/candidate/profile" &&
                location.pathname !== "/candidate/profile/post-submit" ? (
                  <Box
                    sx={{ marginTop: "auto" }}
                    display={"flex"}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Button
                      color="primary"
                      variant="outlined"
                      startIcon={<ArrowBack />}
                      onClick={() => navigate(candidateSectionBackUrl)}
                      sx={{
                        marginRight:
                          location.pathname !== "/candidate/profile/review"
                            ? "15px"
                            : 0,
                      }}
                    >
                      Back
                    </Button>
                    {location.pathname !== "/candidate/profile/review" ? (
                      <Button
                        color="primary"
                        variant="contained"
                        endIcon={<ArrowForward />}
                        onClick={candidateSectionSubmitHandler}
                        disabled={candidateSectionDisableSubmitBtn}
                      >
                        Next
                      </Button>
                    ) : null}
                  </Box>
                ) : null}
              </StyledBasePaper>
            </Grid>
            <Grid item md={10} xs={12}>
              <Outlet />
            </Grid>
          </ScrollableGrid>
        </>
      ) : (
        <CircularLoader />
      )}
    </Box>
  );
};

export { CandidateProfileLayout };
