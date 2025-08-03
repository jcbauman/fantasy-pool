import { Autocomplete, TextField } from "@mui/material";
import { FC } from "react";
import { capitalizeLocation } from "../utils/gameUtils";
import { UseFormRegisterReturn } from "react-hook-form";
import { useFetchLocations } from "../backend/getters";

interface LocationAutocompleteProps {
  value: string | undefined;
  setValue: (value: string) => void;
  register?: UseFormRegisterReturn<string>;
  label: string;
  sx?: any;
  size?: "small" | "medium";
  hasError?: boolean;
  errorMessage?: string;
}

export const LocationAutocomplete: FC<LocationAutocompleteProps> = ({
  value,
  setValue,
  register,
  label,
  sx,
  size = "medium",
  hasError,
  errorMessage,
}) => {
  const options = useFetchLocations();
  return (
    <Autocomplete
      size={size}
      fullWidth
      value={value}
      {...register}
      freeSolo
      sx={sx}
      onChange={(_e, newValue) => {
        if (typeof newValue === "string") {
          setValue(capitalizeLocation(newValue));
        }
      }}
      onInputChange={(_e, newInputValue) =>
        setValue(capitalizeLocation(newInputValue))
      }
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder="Select location or enter a new one"
          error={hasError}
          helperText={errorMessage}
        />
      )}
    />
  );
};
