import { get } from "lodash";
import { BaseInput, uid } from "./BaseInput";
import { Box, TextField, InputAdornment } from "@mui/material";

const BaseTextField = ({
  field,
  label,
  id = uid(4),
  prepend = false,
  form: { touched, errors, setFieldValue },
  ...props
}) => {
  let error = !!get(touched, field.name) && !!get(errors, field.name);

  return (
    <BaseInput id={id} label={label} name={field.name} {...props}>
      <TextField
        {...props}
        {...field}
        id={id}
        error={error}
        InputProps={{
          startAdornment: prepend && (
            <InputAdornment position="start">
              <Box p={1}>{prepend}</Box>
            </InputAdornment>
          ),
        }}
        fullWidth
        size="small"
        variant="outlined"
      />
    </BaseInput>
  );
};

export { BaseTextField };
