import { Chip, Grid, Switch, Typography } from "@mui/material";
import { Field } from "formik";
import { InfoOutlined } from "@mui/icons-material";
import CustomTooltip from "../../../../common/CustomTooltip";
import { useMemo } from "react";

const SwitchField = ({ form, field }) => {
  const { name, value } = field;
  const { setFieldValue } = form;
  return (
    <Switch
      name={name}
      label={name}
      // onChange={(e) => {
      //   console.log(e,name,value)
      //   name !== 'checks[-1].checkEnabled' && setFieldValue(name, !value);
      // }}
      size="small"
      // onClick={(e) => e.stopPropagation()}
      checked={value}
      sx={{ marginLeft: "10px" }}
    />
  );
};
const CheckAccordionHeader = ({
  title,
  description,
  checkOrderId,
  amount,
  isoCode,
  key,
  checksCategory,
  selectedCountry,
  hideInfoIcon,
  titleSize,
  selectedCheckTypes,
  showCheckPrice,
  defaultCheckConfig,
  ...props
}) => {
  
  let checkAmount = useMemo(() => {
    if (selectedCountry?.length && showCheckPrice) {
      let val = "Not Available";

      let selectedCheckPrice = selectedCountry?.find((checkVal) => {
        if (
          checkVal?.checkId === defaultCheckConfig?.checksId &&
          selectedCheckTypes?.includes(defaultCheckConfig?.checkTypeId)
        ) {
          return checkVal;
        }
      });

      if (selectedCheckPrice?.cost && selectedCheckPrice?.costCurrencyISOCode) {
        val = `${selectedCheckPrice?.cost} ${selectedCheckPrice?.costCurrencyISOCode}`;
      }

      return val;
    }
  }, [selectedCountry, selectedCheckTypes]);

  return (
    <Grid container display={"contents"} column={16}>
      <Grid item xs={12} display="flex" alignItems="center">
        {hideInfoIcon ? null : (
          <CustomTooltip
            title={description}
            placement="bottom-start"
            onClick={(e) => e.stopPropagation()}
            tooltipmaxwidth="50vw"
          >
            <InfoOutlined
              color="secondary"
              style={{ marginTop: "-5px", marginRight: "5px" }}
            />
          </CustomTooltip>
        )}

        <Typography
          variant={titleSize}
          gutterBottom
          sx={{
            width: "95%",
            flexShrink: 0,
          }}
        >
          {title}
        </Typography>

        {/* <CheckDescription description={description} /> */}
      </Grid>
      <Grid item display={"contents"} xs={5}>
        {checkAmount && showCheckPrice ? (
          <Chip size="small" key={key} variant="filled" label={checkAmount} />
        ) : null}
        <Field
          name={
            checksCategory === "extraChecks"
              ? `extraChecks[${checkOrderId}].checkEnabled`
              : `checks[${checkOrderId}].checkEnabled`
          }
          component={SwitchField}
        />
      </Grid>
    </Grid>
  );
};

export default CheckAccordionHeader;
