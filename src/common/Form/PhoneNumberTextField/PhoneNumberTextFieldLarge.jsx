import React from "react";
import {MuiTelInput} from 'mui-tel-input'

export const PhoneNumberTextFieldLarge = ({form, field, ...props}) => {
    const {name, value = ""} = field;
    const {handleChange, handleBlur} = form;
    const {
        label,
        required,
        placeholder,
        fullWidth = true,
        error,
    } = props;

    const handleInput = (value, info) => {
        form.setFieldValue(name, value);
    }

    return (
        <MuiTelInput
            id={name}
            name={name}
            value={value || ""}
            error={!!error}
            helperText={error}
            required={required}
            placeholder={placeholder}
            fullWidth={fullWidth}
            variant="outlined"
            onChange={handleInput}
            onBlur={handleBlur}
            defaultCountry="HK"
        />
    );
};
