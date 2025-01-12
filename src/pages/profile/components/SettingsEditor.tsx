import {
  Card,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  setGameStartSoundEffect,
  setHideInactivePlayers,
  setUseOriginalGameEntryInterface,
} from "../../../redux/settingsSlice";

export const SettingsEditor: FC = () => {
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();
  return (
    <Card sx={{ p: 2, flexShrink: 0 }}>
      <Typography variant={"overline"}>General settings</Typography>
      <Stack direction={"column"}>
        <FormControlLabel
          control={
            <Checkbox
              checked={settings.useOriginalGameEntryInterface}
              onChange={(_e, checked) =>
                dispatch(setUseOriginalGameEntryInterface(checked))
              }
            />
          }
          label="Use original game entry interface"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={settings.hideInactivePlayers}
              onChange={(_e, checked) =>
                dispatch(setHideInactivePlayers(checked))
              }
            />
          }
          label="Hide inactive players from standings"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={settings.gameStartSoundEffect}
              onChange={(_e, checked) =>
                dispatch(setGameStartSoundEffect(checked))
              }
            />
          }
          label="Play sound effect on game start"
        />
      </Stack>
    </Card>
  );
};
