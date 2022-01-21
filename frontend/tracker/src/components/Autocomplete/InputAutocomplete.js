import React from "react";
import Autocomplete from "@mui/material/Autocomplete";

function InputAutocomplete({ options, getOption }) {
  return (
    <label style={{ width: "60%" }}>
      <Autocomplete
        sx={{
          display: "inline-block",
          "& input": {
            width: 261,
            color: (theme) =>
              theme.palette.getContrastText(theme.palette.background.paper),
          },
        }}
        id="custom-input-demo"
        options={options}
        onChange={(event, value) => getOption(value)}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <div ref={params.InputProps.ref}>
            <input type="text" {...params.inputProps} required />
          </div>
        )}
      />
    </label>
  );
}

export default InputAutocomplete;
