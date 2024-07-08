import {
  Alert,
  Box, 
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography, 
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

// assets
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CustomTooltip from "../../../common/CustomTooltip";

const AuthResetPwFields = ({
  touched,
  errors,
  theme,
  values,
  showPassword,
  setShowPassword,
  handleBlur,
  handleChange,
}) => {
  return (
    <>
      <FormControl
        fullWidth
        error={Boolean(touched.password && errors.password)}
        sx={{ ...theme.typography.customInput }}
      >
        <InputLabel htmlFor="outlined-adornment-password-login">
          Password
        </InputLabel>
        <CustomTooltip
          title={
            <>
              <Typography color="inherit">
                {" "}
                {values?.password?.length >= 8 ? (
                  <span className="tooltip-check-svg">
                    <CheckIcon />
                  </span>
                ) : (
                  <span className="tooltip-clear-svg">
                    <ClearIcon />
                  </span>
                )}
                At Least 8 Characters
              </Typography>
              <Typography color="inherit">
                {" "}
                {/[A-Z]/.test(values.password) ? (
                  <span className="tooltip-check-svg">
                    <CheckIcon />
                  </span>
                ) : (
                  <span className="tooltip-clear-svg">
                    <ClearIcon />
                  </span>
                )}
                At Least 1 Capital Letter
              </Typography>
              <Typography color="inherit">
                {/[0-9]/.test(values.password) ? (
                  <span className="tooltip-check-svg">
                    <CheckIcon />
                  </span>
                ) : (
                  <span className="tooltip-clear-svg">
                    <ClearIcon />
                  </span>
                )}
                At Least 1 Number
              </Typography>
              <Typography color="inherit">
                {/_|[^\w]/.test(values.password) ? (
                  <span className="tooltip-check-svg">
                    <CheckIcon />
                  </span>
                ) : (
                  <span className="tooltip-clear-svg">
                    <ClearIcon />
                  </span>
                )}
                At Least 1 Special Character
              </Typography>
            </>
          }
          placement="top-end"
          arrow
          tooltipbgcolor="#f5f5f9"
          tooltipcolor="rgba(0, 0, 0, 0.87)"
        >
          <OutlinedInput
            id="outlined-adornment-password-login"
            type={showPassword ? "text" : "password"}
            value={values.password || ""}
            name="password"
            onBlur={handleBlur}
            onChange={handleChange}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                  edge="end"
                  size="large"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            inputProps={{}}
          />
        </CustomTooltip>
        {touched.password && errors.password && (
          <FormHelperText error id="standard-weight-helper-text-password-login">
            {errors.password}
          </FormHelperText>
        )}
      </FormControl>

      <FormControl
        fullWidth
        error={Boolean(touched.password && errors.password)}
        sx={{ ...theme.typography.customInput }}
      >
        <InputLabel htmlFor="outlined-adornment-confirm-password-login">
          Confirm Password
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-confirm-password-login"
          type={showPassword ? "text" : "password"}
          value={values.confirmPassword || ""}
          name="confirmPassword"
          onBlur={handleBlur}
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={(e) => e.preventDefault()}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          label="Confirm Password"
          inputProps={{}}
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <FormHelperText
            error
            id="standard-weight-helper-text-confirm-password-login"
          >
            {errors.confirmPassword}
          </FormHelperText>
        )}
      </FormControl>
      {errors.submit && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="error">{errors.submit}</Alert>
        </Box>
      )}
    </>
  );
};

export default AuthResetPwFields;
