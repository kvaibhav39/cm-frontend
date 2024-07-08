import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import { ListSubheader } from "@mui/material";

const CheckTypesList = ({
  checkTypes,
  selectedCheckTypes,
  onSelectCheckType,
  checks,
  setDisableBtn,
}) => {
  const handleToggle = (value) => () => {
    const currentIndex = selectedCheckTypes.indexOf(value);
    const newChecked = [...selectedCheckTypes];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
      let flag = true;

      checks?.forEach((check) => {
        if (check?.checkTypeId === value) {
          check.checkEnabled = false;
        }

        if (check?.checkEnabled) {
          flag = false;
        }
      });

      setDisableBtn(flag);
    }

    onSelectCheckType(newChecked);
  };

  return (
    <List
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Check Types
        </ListSubheader>
      }
    >
      {checkTypes.map((value) => {
        const labelId = `checkbox-list-label-${value.checkTypesId}`;

        return (
          <ListItem key={value.checkTypesId} disablePadding>
            <ListItemButton
              role={undefined}
              onClick={handleToggle(value.checkTypesId)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={
                    selectedCheckTypes.indexOf(value.checkTypesId) !== -1
                  }
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value.checkTypeName} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default CheckTypesList;
