// material-ui
import {
  Alert,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";

// assets
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link } from "react-router-dom";

const AuthLoginFields = ({
  touched,
  errors,
  theme,
  values,
  handleBlur,
  handleChange,
  showPassword,
  setShowPassword,
  checked,
  setChecked,
}) => {
  return (
    <>
      <FormControl
        fullWidth
        error={Boolean(touched.email && errors.email)}
        sx={{ ...theme.typography.customInput }}
      >
        <InputLabel htmlFor="outlined-adornment-email-login">
          Email Address
        </InputLabel>
        <OutlinedInput
          id="outlined-adornment-email-login"
          type="email"
          value={values.email || ""}
          name="email"
          onBlur={handleBlur}
          onChange={handleChange}
          label="Email Address"
          inputProps={{}}
        />
        {touched.email && errors.email && (
          <FormHelperText error id="standard-weight-helper-text-email-login">
            {errors.email}
          </FormHelperText>
        )}
      </FormControl>

      <FormControl
        fullWidth
        error={Boolean(touched.password && errors.password)}
        sx={{ ...theme.typography.customInput }}
      >
        <InputLabel htmlFor="outlined-adornment-password-login">
          Password
        </InputLabel>
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
        {touched.password && errors.password && (
          <FormHelperText error id="standard-weight-helper-text-password-login">
            {errors.password}
          </FormHelperText>
        )}
      </FormControl>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              name="checked"
              color="primary"
            />
          }
          label="Remember me"
        />
        <Typography
          variant="subtitle1"
          color="secondary"
          component={Link}
          to="/forgot-password"
          sx={{ textDecoration: "none", cursor: "pointer" }}
        >
          Forgot Password?
        </Typography>
      </Stack>
      {errors.submit && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="error">{errors.submit}</Alert>
        </Box>
      )}
    </>
  );
};

export default AuthLoginFields;
