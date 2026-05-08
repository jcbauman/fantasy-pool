import React, { useState } from "react";
import { TextField } from "@mui/material";

interface DatePickerProps {
  label?: string;
  onChange: (date: Date) => void;
  defValue?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  onChange,
  defValue = "",
}) => {
  const [date, setDate] = useState(defValue);
  const [error, setError] = useState("");

  const formatDate = (value: string): string => {
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;

    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };

  const parseDateWithCurrentTime = (value: string): Date | null => {
    const match = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!match) return null;

    const [, month, day, year] = match;
    const now = new Date();

    const parsedDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds(),
    );

    // Prevent dates like 02/31/2026 from rolling into March
    if (
      parsedDate.getFullYear() !== Number(year) ||
      parsedDate.getMonth() !== Number(month) - 1 ||
      parsedDate.getDate() !== Number(day)
    ) {
      return null;
    }

    return parsedDate;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDate(event.target.value);
    setDate(formattedValue);

    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/;

    if (formattedValue === "") {
      setError("");
      return;
    }

    if (!regex.test(formattedValue)) {
      setError("Invalid date format");
      return;
    }

    const parsedDate = parseDateWithCurrentTime(formattedValue);

    if (!parsedDate) {
      setError("Invalid date");
      return;
    }

    setError("");
    onChange(parsedDate);
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
