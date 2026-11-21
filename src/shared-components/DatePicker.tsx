import { FC, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DateTimeValidationError } from "@mui/x-date-pickers";
import type { DatePickerProps as MuiDatePickerProps } from "@mui/x-date-pickers/DatePicker";

interface DatePickerProps {
  label?: string;
  onChange: (date: Date) => void;
  defValue?: string;
  minDate?: string;
  slotProps?: any;
}

export const DatePicker: FC<DatePickerProps> = ({
  label = "Select date and time",
  onChange,
  defValue,
  minDate,
  slotProps,
}) => {
  const [dateTime, setDateTime] = useState<Dayjs | null>(
    defValue ? dayjs(defValue) : dayjs()
  );
  const [error, setError] = useState<DateTimeValidationError>(null);

  const handleChange = (newValue: Dayjs | null) => {
    setDateTime(newValue);

    if (newValue && newValue.isValid()) {
      onChange(newValue.toDate());
    }
  };

  const getHelperText = () => {
    switch (error) {
      case "minDate":
      case "minTime":
        return "Date must be in the current pool season";
      case "maxDate":
      case "maxTime":
        return "Date cannot be in the future";
      default:
        return "";
    }
  };
  const resolvedSlotProps = slotProps ?? {
    textField: {
      fullWidth: true,
      error: !!error,
      helperText: getHelperText(),
    },
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        maxDateTime={dayjs()}
        minDate={minDate ? dayjs(minDate) : undefined}
        label={label}
        value={dateTime}
        onChange={handleChange}
        onError={(newError) => setError(newError)}
        slotProps={resolvedSlotProps}
      />
    </LocalizationProvider>
  );
};
