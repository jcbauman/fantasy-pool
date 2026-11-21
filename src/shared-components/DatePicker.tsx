import { FC, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

interface DatePickerProps {
  label?: string;
  onChange: (date: Date) => void;
  defValue?: string;
}

export const DatePicker: FC<DatePickerProps> = ({
  label = "Select date and time",
  onChange,
  defValue,
}) => {
  const [dateTime, setDateTime] = useState<Dayjs | null>(
    defValue ? dayjs(defValue) : dayjs()
  );

  const handleChange = (newValue: Dayjs | null) => {
    setDateTime(newValue);

    if (newValue && newValue.isValid()) {
      onChange(newValue.toDate());
    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={label}
        value={dateTime}
        onChange={handleChange}
        slotProps={{
          textField: {
            fullWidth: true,
          },
        }}
      />
    </LocalizationProvider>
  );
};
