import {
  Autocomplete,
  Button,
  Card,
  Checkbox,
  Chip,
  Collapse,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";
import DatePicker from "../../../shared-components/DatePicker";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
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
import { RootState } from "../../../redux/store";
import { Game, Player } from "../../../types";
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
  const { gameStartSoundEffect, useOldGameEntryInterface } = useSelector(
    (state: RootState) => state.settings
  );

  const maxPlayers = useOldGameEntryInterface ? 4 : 2;

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      date: new Date(),
      location: player?.defaultLocation ?? "",
      playerIds: player?.id ? [player?.id] : [],
    },
  });

  const repeatLastGameConfiguration = useCallback(
    (dateSortedGames: Game[], thePlayer: Player | null): boolean => {
      if (!thePlayer) return false;
      let index = 0;
      while (dateSortedGames.length - 1 > index) {
        const thisGame = dateSortedGames[index];
        const lastGameIsOld = isMoreThanTwoHoursAgo(thisGame.timestamp);
        if (lastGameIsOld) {
          return false;
        }
        if (thisGame.playerIds.includes(thePlayer.id)) {
          if (thisGame.location) {
            setLastGameAddedLocation(thisGame.location);
            setValue("location", thisGame.location);
            return true;
          }
        } else {
          index += 1;
        }
      }
      return false;
    },
    [setValue]
  );

  //assumes user is playing with everyone else if they haven't logged a game there yet
  const assumeLastGameConfiguration = useCallback(
    (dateSortedGames: Game[], thePlayer: Player | null): void => {
      if (!thePlayer) return;
      if (dateSortedGames.length > 0) {
        const thisGame = dateSortedGames[0];
        const lastGameIsOld = isMoreThanTwoHoursAgo(thisGame.timestamp);
        if (lastGameIsOld) return;
        if (thisGame.location) {
          setValue("location", thisGame.location);
          setLastGameAddedLocation(thisGame.location);
          return;
        } else {
          return;
        }
      }
      return;
    },
    [setValue]
  );

  useEffect(() => {
    const dateSortedGames = sortGamesByDate(games);
    const foundGame = repeatLastGameConfiguration(dateSortedGames, player);
    if (!foundGame) assumeLastGameConfiguration(dateSortedGames, player);
  }, [
    games,
    repeatLastGameConfiguration,
    assumeLastGameConfiguration,
    setValue,
    player,
  ]);

  const [checked, setChecked] = useState(true);
  const playerOptionIds = allPlayers
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((p) => p.id);
  const onSubmit = (data: FormData): void => {
    const resolvedData = {
      ...data,
      timestamp: data.date ? data.date.toString() : new Date().toString(),
      playerIds: data.playerIds,
      authorPlayerId: player?.id ?? "",
    };
    if (
      !locations.some(
        (l) => l.trim().toLowerCase() === data.location.trim().toLowerCase()
      )
    ) {
      addNewLocation({ name: data.location.trim() });
    }
    dispatch(initializeGame({ ...resolvedData }));
    if (gameStartSoundEffect) {
      try {
        const audio = new Audio("/ball-release-sound.mp3");
        audio.play();
      } catch (e) {
        console.error(e);
      }
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
            You can record scores for up to {maxPlayers} players simultaneously.
          </Typography>
          <Controller
            name="playerIds"
            control={control}
            rules={{
              validate: {
                required: (value) =>
                  value.length > 0 || "At least one player must be selected",
                maxTwo: (value) =>
                  value.length <= maxPlayers ||
                  `You can select up to ${maxPlayers} players`,
              },
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
                  setValue("location", newValue?.trim() || "");
                }}
                onInputChange={(_e, newInputValue) =>
                  setValue("location", newInputValue || "")
                }
                options={locations}
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
