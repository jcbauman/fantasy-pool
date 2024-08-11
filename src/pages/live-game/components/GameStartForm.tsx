import {
  Autocomplete,
  Button,
  Card,
  Checkbox,
  Collapse,
  createFilterOptions,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useEffect, useMemo, useState } from "react";
import DatePicker from "../../../shared-components/DatePicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { initializeGame } from "../../../redux/gameSlice";
import { useAppContext } from "../../../context/AppContext";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useFetchLocations } from "../../../backend/getters";
import { addNewLocation } from "../../../backend/setters";
interface FormData {
  date: Date | null;
  location: string;
  playerIds: string[];
}

export const GameStartForm: FC<{
  setShowInfoDialog: (show: boolean) => void;
}> = ({ setShowInfoDialog }) => {
  const {
    authState: { player },
  } = useAppContext();

  const dispatch = useDispatch();
  const { players: allPlayers } = useAppContext();
  const [lastGameAddedLocation, setLastGameAddedLocation] = useState<
    string | undefined
  >(undefined);
  const locations = useFetchLocations();
  const locationOptions = useMemo(() => {
    return locations.map((l) => l.name).sort();
  }, [locations]);

  // useEffect(() => {
  //   const fetchLastLoc = async (): Promise<void> => {
  //     const res = await getLastGameAdded();
  //     if (res) {
  //       console.log(res, "bruh");
  //       setLastGameAddedLocation(res.location ?? undefined);
  //     }
  //   };
  //   fetchLastLoc();
  // }, []);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      date: new Date(),
      location: lastGameAddedLocation ?? player?.defaultLocation ?? "",
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
      authorPlayerId: player?.id ?? "",
    };
    if (!locations.some((l) => l.name === data.location)) {
      addNewLocation({ name: data.location });
    }
    dispatch(initializeGame({ ...resolvedData }));
    try {
      const audio = new Audio("/ball-release-sound.mp3");
      audio.play();
    } catch (e) {
      console.error(e);
    }
  };

  const filter = createFilterOptions<string>();
  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" sx={{ alignItems: "center", mb: 1 }}>
        <Typography variant="overline">Start a new pool session</Typography>
        <IconButton
          size="small"
          onClick={() => setShowInfoDialog(true)}
          sx={{}}
        >
          <InfoOutlinedIcon />
        </IconButton>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" gap={2}>
          <Typography variant="caption">
            Record scores for yourself or another player. <br />
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
              <Autocomplete
                {...field}
                freeSolo
                onChange={(_e, newValue) => {
                  setValue("location", newValue || "");
                }}
                onInputChange={(_e, newInputValue) =>
                  setValue("location", newInputValue || "")
                }
                options={locationOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={!!errors.location}
                    label="Location"
                    placeholder="Select location or enter a new one"
                    helperText={errors.location?.message}
                  />
                )}
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