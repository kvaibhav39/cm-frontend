import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import {
  Box,
  FormControl,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  styled,
  Typography,
} from "@mui/material";
import { rangeSelectors } from "../constants/filterData";
import { LaptopDatePicker2 } from "../../common/Form/DatePicker/DesktopDatePicker";
import { useDispatch, useSelector } from "react-redux";
import { getOrganizationTeams } from "../../store/actions/hrActions";
import { getLoggedInUserHrOrganizationId } from "../../utils/UserHelper";
import { useTheme } from "@mui/material/styles";
import { getCurrentFileNameAndFunction } from "../../utils/getCurrentFileNameAndFunction";

const BaseSelect = styled(Select)`
  fieldset {
    border-radius: 12px;
    border-color: #e7e7e7;
  }
`;

const BaseListItem = styled(ListItemButton)`
  border-radius: 12px;
  &.Mui-selected {
    color: white;
    background-color: #5974f6;
    &:hover {
      background-color: #5974f6;
    }
  }
`;

const TeamRangeSelection = ({ onChange = () => {}, toSaveFilters }) => {
  const loggedInUser = useSelector((state) => state.authorization.currentUser);
  const [range, setRange] = useState(() => rangeSelectors[0]);
  const [filter, _setFilter] = useState(() => ({
    hrTeamId: "All",
    ...range.dates,
  }));

  const organizationTeamsData = useSelector(
    (state) => state?.hr?.organizationTeams
  );

  const { HrCandidatesFilter } = useSelector((state) => state.hr);

  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    if (organizationTeamsData?.length === 0) {
      const params = {
        orgId: getLoggedInUserHrOrganizationId(),
      };

      let logDetails = getCurrentFileNameAndFunction(
        import.meta.url,
        "useEffect"
      );

      dispatch(getOrganizationTeams(params, logDetails));
    }
    if (toSaveFilters) {
      setRange(HrCandidatesFilter?.rangeValue);
      setFilter(HrCandidatesFilter);
    } else {
      setFilter(filter);
    }
  }, []);

  const setFilter = useCallback((payload) => {
    return _setFilter((prevFilter) => {
      onChange({
        ...prevFilter,
        ...payload,
      });

      return {
        ...prevFilter,
        ...payload,
      };
    });
  }, []);

  const onClickRange = (item) => {
    setRange(item);
    setFilter({ ...item.dates, rangeValue: item });
  };

  const onChangeDate = (type) => (date) => {
    setRange(rangeSelectors[4]);
    setFilter({
      [type]: moment(date).format("YYYY-MM-DD"),
      rangeValue: rangeSelectors[4],
    });
  };

  return (
    <Box>
      {/* TEAM */}
      <FormControl fullWidth size="small">
        <Box
          fontWeight="bold"
          margin="0 0 0.5rem 0.5rem"
          color={theme.palette.grey[700]}
          htmlFor=""
        >
          Select Team
        </Box>
        <BaseSelect
          fullWidth
          value={filter.hrTeamId || ""}
          onChange={(e) => setFilter({ hrTeamId: e.target.value })}
        >
          <MenuItem key="All" value="All">
            All Teams
          </MenuItem>
          {organizationTeamsData?.map((team) => {
            return (
              <MenuItem key={team.hrTeamsId} value={team.hrTeamsId}>
                {team.hrTeamName}
              </MenuItem>
            );
          })}
        </BaseSelect>
      </FormControl>

      {/* RANGE */}
      <FormControl fullWidth size="small">
        <Box
          color={theme.palette.grey[700]}
          fontWeight="bold"
          margin="2rem 0 0.5rem 0.5rem"
        >
          Select Range
        </Box>
        <List disablePadding>
          {rangeSelectors.map((item) => (
            <BaseListItem
              key={item.value}
              selected={item.value === range?.value}
              onClick={() => onClickRange(item)}
            >
              <ListItemText
                primary={item.label}
                sx={{
                  "> span": {
                    fontWeight: 500,
                    color:
                      item.value === range?.value
                        ? "white !important"
                        : "#817F89 !important",
                  },
                }}
              />
            </BaseListItem>
          ))}
        </List>
        {range?.value === "CUSTOM RANGE" && (
          <Paper sx={{ padding: "1rem 0.5rem" }}>
            {/*<Typography fontWeight={500} color="#817F89">*/}
            {/*    Custom*/}
            {/*</Typography>*/}
            <Grid container direction="row">
              <Grid sm={12} sx={{ paddingRight: "0.25rem" }}>
                <Typography
                  color={theme.palette.grey[700]}
                  marginBottom="4px"
                  fontSize="13px"
                  fontWeight={500}
                >
                  From
                </Typography>
                <LaptopDatePicker2
                  name="from"
                  label="From"
                  required={true}
                  value={filter.fromDate || ""}
                  onChange={onChangeDate("fromDate")}
                />
              </Grid>
              <Grid sm={12}>
                <Typography
                  color={theme.palette.grey[700]}
                  marginBottom="4px"
                  fontSize="13px"
                  fontWeight={500}
                >
                  To
                </Typography>
                <LaptopDatePicker2
                  name="to"
                  label="To"
                  required={true}
                  value={filter.toDate || ""}
                  onChange={onChangeDate("toDate")}
                />
              </Grid>
            </Grid>
          </Paper>
        )}
      </FormControl>
    </Box>
  );
};

export default TeamRangeSelection;
