import { useState } from "react";
import { IconButton, Popover } from "@mui/material";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import EditIcon from "@mui/icons-material/Edit";

interface EmojiPickerInputProps {
  name: string;
  value?: string;
  onChange?: (emoji: string) => void;
}

export function EmojiPickerInput({
  name,
  value,
  onChange,
}: EmojiPickerInputProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <EditIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Picker
          data={data}
          theme="dark"
          onEmojiSelect={(emoji: any) => {
            onChange?.(emoji.native);
            setAnchorEl(null);
          }}
        />
      </Popover>
    </>
  );
}
