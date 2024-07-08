import React, { useEffect, useState } from "react";
import { Slider } from "@mui/material";

export const SliderField = ({ form, field, ...props }) => {
  const { setFieldValue } = form;
  const { setSelectedYears, noOfYears } = props;
  const { name, value = noOfYears } = field;
  const marks = new Array(6)
    .fill()
    .map((c, i) => {
      return i != 0 && i;
    })
    .filter((val) => val != false)
    .map((i) => {
      return {
        value: i,
        label: i * 2,
      };
    });

  return (
    <Slider
      name={name}
      // defaultValue={value/2 || ""}
      value={value / 2 || ""}
      size={"small"}
      step={1}
      valueLabelDisplay="off"
      max={5}
      marks={marks}
      min={1}
      onChange={(e) => {
        if (setSelectedYears) {
          setSelectedYears(e.target.value * 2);
        }
        setFieldValue(name, e.target.value * 2);
      }}
    />
  );
};
