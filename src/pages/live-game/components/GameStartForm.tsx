import {
  Autocomplete,
  Button,
  Card,
  Checkbox,
  Collapse,
  FormControlLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { useGameStartForm } from "../hooks/useGameStartForm";
import DatePicker from "../../../shared-components/DatePicker";

export const GameStartForm: FC = () => {
  const formState = useGameStartForm();
  const [checked, setChecked] = useState(true);

  const playerOptions = formState.allPlayers.map((p) => {
    return {
      value: p.id,
      label: p.name,
    };
  });
  const defaultPlayerOption = formState.player?.id
    ? [
        {
          value: formState.player?.id ?? "",
          label: formState.player?.name ?? "",
        },
      ]
    : [];
  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="overline">Start a new game</Typography>
      <form>
        <Stack direction="column" gap={2}>
          <Autocomplete
            multiple
            id="tags-outlined"
            options={playerOptions}
            getOptionLabel={(option) => option.label}
            defaultValue={defaultPlayerOption}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Player(s)"
                placeholder="Select players"
              />
            )}
          />
          <TextField
            label="Location"
            defaultValue={formState.player?.defaultLocation}
          />
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked
                onChange={(_e, checked) => setChecked(checked)}
              />
            }
            label="Playing now"
          />
          <Collapse in={!checked}>
            <DatePicker label="Original game date" />
          </Collapse>
          <Button type="submit" fullWidth variant="contained">
            Start balling
          </Button>
        </Stack>
      </form>
    </Card>
  );
};
