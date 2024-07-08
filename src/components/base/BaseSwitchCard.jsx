import { IOSSwitch } from "./IOSSwitch";
import { Box, styled, Typography } from "@mui/material";

const StyledSwitchCard = styled(Box)`
  width: 100%;
  display: flex;
  cursor: pointer;
  min-height: 56px;
  border-radius: 12px;
  align-items: center;
  background-color: ${({ bgcolor }) => bgcolor || "#ededed"};
  justify-content: space-between;
`;

const BaseSwitchCard = ({
  label,
  box = {},
  field = {},
  form = {
    setFieldValue: () => {},
  },
  index = 0,
}) => {
  const onToggleChecked = () => {
    form.setFieldValue(field.name, !field.value);
    if (label === "Can we contact this employer now?") {
      form.setFieldValue(`employments.${index}.cessationDate`, null);
      form.setFieldValue(`employments.${index}.reasonOfChoosingLateCessationDate`, "");
    }
  };
  return (
    <StyledSwitchCard
      {...box}
      onClick={onToggleChecked}
      p={{ xs: 2, md: "0.5rem 1.5rem 0.5rem 2rem" }}
    >
      <Typography fontWeight={500}>{label}</Typography>
      <IOSSwitch checked={field.value} />
    </StyledSwitchCard>
  );
};

export { BaseSwitchCard, StyledSwitchCard };
