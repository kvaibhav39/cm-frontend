import { ErrorMessage } from "formik";
import { styled } from "@mui/material";

const StyledBaseInput = styled("div")(
  (props) => `
  flex: 1;
  display: flex;
  flex-direction: column;
  > label {
    color: #565261;
    margin-bottom: 0.25rem;
    font-size: ${props?.makeFontSizeSmaller ? "12px" : "inherit"};
  }
  fieldset {
    border-radius: 12px;
  }
  .Mui-focused {
    input {
      border-width: 2px;
      border-color: #527afb;
    }
  }
  .MuiIconButton-edgeStart {
    padding: 12px !important;
  }
  .base-input-error {
    margin: 0;
    color: #f44336;
    font-size: small;
    margin-top: 0.25rem;
  }
  .MuiInputAdornment {
    &-positionStart {
      height: 100%;
      border-right: 1px solid rgba(0, 0, 0, 0.23);
    }
  }
`
);

const uid = (len = 10) => Math.random().toString(32).slice(-len);

const BaseInput = ({ id, name, label, children, noValidate, ...props }) => {
  return (
    <StyledBaseInput {...props}>
      {label && <label htmlFor={id}>{label}</label>}
      {children}
      {!noValidate && (
        <p className="base-input-error">
          <ErrorMessage name={name} />
        </p>
      )}
    </StyledBaseInput>
  );
};

export { uid, BaseInput };
