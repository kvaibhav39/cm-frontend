import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { ListSubheader, Grid } from "@mui/material";
import { rangeSelectors, verficationProcess } from "../constants/filterData";
import MobileDatePicker from "../../common/Form/DatePicker/MobileDatePicker";
import LaptopDatePicker from "../../common/Form/DatePicker/DesktopDatePicker";

const CandidatesFilter = ({ setCustomRange, customRange }) => {
  return (
    <>
      <List
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Select Range s
          </ListSubheader>
        }
      >
        {rangeSelectors.map((value, index) => {
          const labelId = `checkbox-list-label-${index}`;

          return value.value == "custom" ? (
            <>
              <ListItem key={index} disablePadding>
                <ListItemButton role={undefined} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={value.label} />
                </ListItemButton>
              </ListItem>
              <Grid container direction="row" sx={{ paddingRight: "0.5rem" }}>
                <Grid sm={12} sx={{ paddingRight: "0.25rem" }}>
                  <MobileDatePicker name="from" label="From" required={true} />
                  <LaptopDatePicker name="from" label="From" required={true} />
                </Grid>
                <Grid sm={12} sx={{ paddingLeft: "0rem" }}>
                  <MobileDatePicker name="to" label="To" required={true} />
                  <LaptopDatePicker name="to" label="To" required={true} />
                </Grid>
              </Grid>
            </>
          ) : (
            <ListItem key={index} disablePadding>
              <ListItemButton role={undefined} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={value.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <List
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Verification Process
          </ListSubheader>
        }
      >
        {verficationProcess.map((value, index) => {
          const labelId = `checkbox-list-label-${index}`;

          return (
            <ListItem key={index} disablePadding>
              <ListItemButton role={undefined} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={value.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <List
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Verification Result
          </ListSubheader>
        }
      >
        {verficationProcess.map((value, index) => {
          const labelId = `checkbox-list-label-${index}`;

          return (
            <ListItem key={index} disablePadding>
              <ListItemButton role={undefined} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={value.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

export default CandidatesFilter;
