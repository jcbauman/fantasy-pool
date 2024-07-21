import React, { useState } from "react";
import { TextField } from "@mui/material";

interface DatePickerProps {
  label?: string;
  onChange: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ label, onChange }) => {
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  // Function to format input value as mm/dd/yyyy
  const formatDate = (value: string): string => {
    // Remove non-digit characters
    const digits = value.replace(/\D/g, "");
    // Format digits as mm/dd/yyyy
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };

  // Handle input change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const formattedValue = formatDate(value);
    setDate(formattedValue);
    onChange(new Date(formattedValue));

    // Validate date format (basic validation)
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/;
    if (regex.test(formattedValue) || formattedValue === "") {
      setError("");
    } else {
      setError("Invalid date format");
    }
  };

  return (
    <TextField
      label={label ?? "Date"}
      value={date}
      onChange={handleChange}
      placeholder="mm/dd/yyyy"
      inputProps={{
        maxLength: 10,
      }}
      helperText={error || "Format: mm/dd/yyyy"}
      error={!!error}
      fullWidth
    />
  );
};

export default DatePicker;
