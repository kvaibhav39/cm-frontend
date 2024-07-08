import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { ListSubheader } from "@mui/material";
import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const PackageFilter = ({
  industries,
  showDefaultPackages,
  showCustomPackages,
  selectedIndustries,
  onSelectIndustry,
  onDefaultToggle,
  onCustomToggle,
}) => {
  const theme = useTheme();

  const handleToggle = (value) => () => {
    const currentIndex = selectedIndustries.indexOf(value);
    const newChecked = [...selectedIndustries];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    onSelectIndustry(newChecked);
  };

  const defaultToggle = () => {
    onDefaultToggle(!showDefaultPackages);
  };

  const customToggle = () => {
    onCustomToggle(!showCustomPackages);
  };
  return (
    <>
      <List>
        <ListItem key={"default"} disablePadding>
          <ListItemButton
            role={undefined}
            onClick={defaultToggle}
            dense
            sx={{
              padding: "0px",
              height: "2rem",
            }}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                sx={{ py: 0, px: 2 }}
                icon={<RadioButtonUnchecked />}
                checkedIcon={<CheckCircle />}
                checked={showDefaultPackages}
                tabIndex={-1}
                disableRipple
                inputProps={{
                  "aria-labelledby": "checkbox-list-label-default",
                }}
              />
            </ListItemIcon>
            <ListItemText id={"default"} primary={"Show Default Packages"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"default2"} disablePadding>
          <ListItemButton
            sx={{
              padding: "0px",
              height: "2rem",
            }}
            role={undefined}
            onClick={customToggle}
            dense
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                sx={{ py: 0, px: 2 }}
                icon={<RadioButtonUnchecked />}
                checkedIcon={<CheckCircle />}
                checked={showCustomPackages}
                tabIndex={-1}
                disableRipple
                inputProps={{
                  "aria-labelledby": "checkbox-list-label-default2",
                }}
              />
            </ListItemIcon>
            <ListItemText id={"default2"} primary={"Show Custom Packages"} />
          </ListItemButton>
        </ListItem>
      </List>
      {showDefaultPackages && (
        <List
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              INDUSTRIES
            </ListSubheader>
          }
          sx={{
            [theme.breakpoints.down("xl")]: {
              overflowY: "scroll",
              height: "70vh",
            },
            [theme.breakpoints.down("md")]: {
              overflowY: "scroll",
              height: "35vh",
            },
            [theme.breakpoints.up("xl")]: {
              overflowY: "scroll",
              height: "75vh",
            },
          }}
        >
          {industries.map((value) => {
            const labelId = `checkbox-list-label-${value.industriesId}`;

            return (
              selectedIndustries.indexOf(value.industriesId) !== -1 && (
                <ListItem key={value.industriesId} disablePadding>
                  <ListItemButton
                    role={undefined}
                    onClick={handleToggle(value.industriesId)}
                    sx={{
                      py: 0,
                      padding: "0px",
                      height: "2rem",
                      minHeight: 32,
                    }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        sx={{ py: 0, px: 2 }}
                        icon={<RadioButtonUnchecked />}
                        checkedIcon={<CheckCircle />}
                        checked={true}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={value.industryName} />
                  </ListItemButton>
                </ListItem>
              )
            );
          })}
          {industries.map((value) => {
            const labelId = `checkbox-list-label-${value.industriesId}`;

            return (
              selectedIndustries.indexOf(value.industriesId) == -1 && (
                <ListItem key={value.industriesId} disablePadding>
                  <ListItemButton
                    role={undefined}
                    onClick={handleToggle(value.industriesId)}
                    sx={{
                      py: 0,
                      padding: "0px",
                      height: "2rem",
                      minHeight: 32,
                    }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        sx={{ py: 0, px: 2 }}
                        icon={<RadioButtonUnchecked />}
                        checkedIcon={<CheckCircle />}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={value.industryName} />
                  </ListItemButton>
                </ListItem>
              )
            );
          })}
        </List>
      )}
    </>
  );
};

export default PackageFilter;
