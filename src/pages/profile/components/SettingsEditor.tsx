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
  setTrackAlcohol,
} from "../../../redux/settingsSlice";
import { fireAnalyticsEvent } from "../../../shared-components/hooks/analytics";

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
              checked={settings.hideInactivePlayers}
              onChange={(_e, checked) => {
                dispatch(setHideInactivePlayers(checked));
                fireAnalyticsEvent("Settings_Toggled_Setting", {
                  setting: "hide players",
                  on: checked,
                });
              }}
            />
          }
          label="Hide inactive players from standings"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={settings.gameStartSoundEffect}
              onChange={(_e, checked) => {
                dispatch(setGameStartSoundEffect(checked));
                fireAnalyticsEvent("Settings_Toggled_Setting", {
                  setting: "sound effect",
                  on: checked,
                });
              }}
            />
          }
          label="Play sound effect on game start"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={settings.trackAlcohol}
              onChange={(_e, checked) => {
                dispatch(setTrackAlcohol(checked));
                fireAnalyticsEvent("Settings_Toggled_Setting", {
                  setting: "alcohol",
                  on: checked,
                });
              }}
            />
          }
          label="Enable alcohol tracking"
        />
      </Stack>
    </Card>
  );
};
