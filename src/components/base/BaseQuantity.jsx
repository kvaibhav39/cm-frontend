import { useRef } from "react";
import { useEffect } from "react";
import { Add, Remove } from "@mui/icons-material";
import { Box, IconButton, styled } from "@mui/material";

const StyledBaseQuantity = styled(Box)`
  align-items: center;
  display: inline-flex;
  justify-content: center;

  border-radius: 4rem;
  padding: 0.2rem 0.5rem;
  border: 1px solid #7f97f8;

  button {
    padding: 0;
  }
  input {
    border: none;
    font-size: 1em;
    font-weight: 600;
    text-align: center;
    margin: 0 0.25rem;
    &:focus {
      outline: none;
    }
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    margin: 0;
    -webkit-appearance: none;
  }
`;

const BaseQuantity = ({ form, field, min = 1, max = Infinity, ...props }) => {
  const inputRef = useRef(null);

  const handleChange = (event) => {
    const newValue = typeof event !== "number" ? +event.target.value : event;

    if (typeof min === "number" && newValue < min) return;
    if (typeof max === "number" && newValue > max) return;

    return form.setFieldValue(field.name, newValue);
  };

  const handleClickMinus = () => {
    if (field.value - 1 === 0) {
      return;
    }
    return handleChange(field.value - 1);
  };

  const handleClickPlus = () => {
    return handleChange(field.value + 1);
  };

  useEffect(
    () => {
      if (!inputRef.current) return;
      inputRef.current.style.width = `${
        (field.value || 1).toString().length + 1
      }ch`;
    },
    //
    [field.value, inputRef.current]
  );

  return (
    <StyledBaseQuantity {...props}>
      <IconButton onClick={handleClickMinus}>
        <Remove fontSize="13" sx={{ color: "#5874F6" }} />
      </IconButton>
      <input
        type="number"
        name={field.name}
        value={field.value || 1}
        onChange={handleChange}
        ref={inputRef}
      />
      <IconButton onClick={handleClickPlus}>
        <Add fontSize="13" sx={{ color: "#5874F6" }} />
      </IconButton>
    </StyledBaseQuantity>
  );
};

export { BaseQuantity };
