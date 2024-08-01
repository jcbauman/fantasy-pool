import { Button, ClickAwayListener, Stack, TextField } from "@mui/material";
import { useState } from "react";
interface TextEditorFieldProps {
  onSave: (value: string) => void;
  defaultValue: string;
  onClickAway: () => void;
  placeholder?: string;
}

export const TextEditorField: React.FC<TextEditorFieldProps> = ({
  onSave,
  defaultValue,
  onClickAway,
  placeholder = "Enter value",
}) => {
  const [value, setValue] = useState(defaultValue);
  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Stack direction="row" sx={{ alignItems: "center" }} gap={1}>
        <TextField
          size="small"
          placeholder={placeholder}
          defaultValue={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button onClick={() => onSave(value)} variant="contained">
          Save
        </Button>
      </Stack>
    </ClickAwayListener>
  );
};
