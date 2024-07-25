import {
  Autocomplete,
  Button,
  Card,
  Checkbox,
  Collapse,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import DatePicker from "../../../shared-components/DatePicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { initializeGame } from "../../../redux/gameSlice";
import { useAppContext } from "../../../context/AppContext";
interface FormData {
  date: Date | null;
  location: string;
  playerIds: string[];
}

export const GameStartForm: FC = () => {
  const {
    authState: { player },
  } = useAppContext();

  const dispatch = useDispatch();
  const { players: allPlayers } = useAppContext();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      date: new Date(),
      location: player?.defaultLocation ?? "",
      playerIds: player?.id ? [player?.id] : [],
    },
  });
  const [checked, setChecked] = useState(true);

  const playerOptionIds = allPlayers.map((p) => p.id);
  const onSubmit = (data: FormData): void => {
    const resolvedData = {
      ...data,
      timestamp: data.date ? data.date.toString() : new Date().toString(),
      playerIds: data.playerIds,
    };
    dispatch(initializeGame({ ...resolvedData }));
  };

  return (
    <Card sx={{ p: 2 }}>
      <Typography sx={{ mb: 2 }} variant="overline">
        Start a new pool session
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" gap={2}>
          <Typography variant="caption">
            You can record scores for up to 4 players simultaneously.
          </Typography>
          <Controller
            name="playerIds"
            control={control}
            rules={{
              validate: (value) =>
                value.length > 0 || "At least one player must be selected",
            }}
            render={({ field }) => (
              <Autocomplete
                {...field}
                multiple
                value={field.value}
                id="tags-outlined"
                options={playerOptionIds}
                getOptionLabel={(option) =>
                  allPlayers.find((p) => p.id === option)?.name ?? ""
                }
                filterSelectedOptions
                onChange={(_event, newValue) => {
                  field.onChange(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Player(s)"
                    placeholder="Select players"
                    error={!!errors.playerIds}
                    helperText={errors.playerIds?.message}
                  />
                )}
              />
            )}
          />
          <Controller
            name="location"
            control={control}
            rules={{
              required: "Please enter the location of where you are playing",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                value={field.value}
                label="Location"
                defaultValue={player?.defaultLocation}
                error={!!errors.location}
                helperText={errors.location?.message}
              />
            )}
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
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Original game date"
                  {...field}
                  onChange={(date) => field.onChange(date)}
                />
              )}
            />
          </Collapse>
          <Button type="submit" fullWidth variant="contained">
            Start balling
          </Button>
        </Stack>
      </form>
    </Card>
  );
};
