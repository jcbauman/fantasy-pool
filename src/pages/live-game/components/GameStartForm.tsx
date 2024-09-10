import {
  Autocomplete,
  Button,
  Card,
  Checkbox,
  Chip,
  Collapse,
  FormControlLabel,
  FormLabel,
  IconButton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
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
import {
  isMoreThanTwoHoursAgo,
  sortGamesByDate,
} from "../../../utils/gameUtils";
import { Link } from "react-router-dom";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import SportsMmaOutlinedIcon from "@mui/icons-material/SportsMmaOutlined";
interface FormData {
  date: Date | null;
  location: string;
  playerIds: string[];
}

export const GameStartForm: FC<{
  setShowInfoDialog: (show: boolean) => void;
}> = ({ setShowInfoDialog }) => {
  const {
    games,
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

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      date: new Date(),
      location: player?.defaultLocation ?? "",
      playerIds: player?.id ? [player?.id] : [],
    },
  });
  const watchAll = watch();
  useEffect(() => {
    const dateSortedGames = sortGamesByDate(games);
    if (dateSortedGames.length > 0) {
      const lastGameIsOld = isMoreThanTwoHoursAgo(dateSortedGames[0].timestamp);
      if (!lastGameIsOld) {
        if (dateSortedGames[0].location) {
          setValue("location", dateSortedGames[0].location);
          setLastGameAddedLocation(dateSortedGames[0].location);
        }
      }
    }
  }, [games, setValue]);
  const [checked, setChecked] = useState(true);
  const [gameStyle, setGameStyle] = useState<"singles" | "doubles" | "unset">(
    "unset"
  );
  const playerOptionIds = allPlayers.map((p) => p.id);
  const onSubmit = (data: FormData): void => {
    const resolvedData = {
      ...data,
      timestamp: data.date ? data.date.toString() : new Date().toString(),
      playerIds: data.playerIds,
      authorPlayerId: player?.id ?? "",
    };
    if (
      !locations.some(
        (l) =>
          l.name.trim().toLowerCase() === data.location.trim().toLowerCase()
      )
    ) {
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
          <Collapse in={watchAll.playerIds.length === 2}>
            <ToggleButtonGroup
              fullWidth
              exclusive
              value={gameStyle}
              sx={{ mb: 1 }}
              id="style-selection"
              onChange={(_e, value) => {
                if (value !== null) setGameStyle(value);
              }}
            >
              <ToggleButton value="unset">Unset</ToggleButton>
              <ToggleButton value="singles">
                <SportsMmaOutlinedIcon sx={{ mr: 1 }} />
                Singles
              </ToggleButton>
              <ToggleButton value="doubles">
                <HandshakeOutlinedIcon sx={{ mr: 1 }} />
                Doubles
              </ToggleButton>
            </ToggleButtonGroup>
            <Collapse in={gameStyle === "doubles"}>
              <Typography variant="caption">
                We are playing together on a doubles team.
              </Typography>
            </Collapse>
            <Collapse in={gameStyle === "singles"}>
              <Typography variant="caption">
                We are playing against each other.
              </Typography>
            </Collapse>
          </Collapse>
          <Controller
            name="location"
            control={control}
            rules={{
              required: "Please enter the location of where you are playing",
            }}
            render={({ field }) => (
              <Autocomplete
                sx={{ mt: watchAll.playerIds.length === 2 ? 1 : 0 }}
                {...field}
                freeSolo
                onChange={(_e, newValue) => {
                  setValue("location", newValue?.trim() || "");
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
          {lastGameAddedLocation &&
            Boolean(player?.defaultLocation) &&
            lastGameAddedLocation !== player?.defaultLocation && (
              <Stack direction="row" sx={{ alignItems: "center" }}>
                <Typography variant="caption">Or use your default:</Typography>
                <Chip
                  sx={{ flexShrink: 1, ml: 1 }}
                  label={player?.defaultLocation}
                  onClick={() => {
                    setValue("location", player?.defaultLocation ?? "");
                    setLastGameAddedLocation(undefined);
                  }}
                />
              </Stack>
            )}
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
          <Typography variant="caption" sx={{ a: { color: "white" } }}>
            <Link to="/rules">FAQ's and Rules</Link>
          </Typography>
        </Stack>
      </form>
    </Card>
  );
};
