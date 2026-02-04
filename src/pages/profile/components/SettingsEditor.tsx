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
  setHideInactiveLocations,
  setHideInactivePlayers,
  setUseMultiBallEntryV1,
} from "../../../redux/settingsSlice";
import { fireAnalyticsEvent } from "../../../shared-components/hooks/analytics";

export const SettingsEditor: FC = () => {
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch();
  const checkboxes = [
    {
      label: "Hide inactive players from standings",
      checked: settings.hideInactivePlayers,
      onChange: (checked: boolean) => {
        dispatch(setHideInactivePlayers(checked));
        fireAnalyticsEvent("Settings_Toggled_Setting", {
          setting: "hide players",
          on: checked,
        });
      },
    },
    {
      label: "Hide inactive locations from list",
      checked: settings.hideInactiveLocations,
      onChange: (checked: boolean) => {
        dispatch(setHideInactiveLocations(checked));
        fireAnalyticsEvent("Settings_Toggled_Setting", {
          setting: "hide locations",
          on: checked,
        });
      },
    },
    {
      label: "Use single-tap multi-ball entry",
      checked: settings.useMultiBallEntryV1,
      onChange: (checked: boolean) => {
        dispatch(setUseMultiBallEntryV1(checked));
        fireAnalyticsEvent("Settings_Toggled_Setting", {
          setting: "multi ball entry v1",
          on: checked,
        });
      },
    },
    {
      label: "Play sound effect on game start",
      checked: settings.gameStartSoundEffect,
      onChange: (checked: boolean) => {
        dispatch(setGameStartSoundEffect(checked));
        fireAnalyticsEvent("Settings_Toggled_Setting", {
          setting: "sound effect",
          on: checked,
        });
      },
    },
  ];
  return (
    <Card sx={{ p: 2, flexShrink: 0 }}>
      <Typography variant={"overline"}>General settings</Typography>
      <Stack direction={"column"}>
        {checkboxes.map((checkbox) => (
          <FormControlLabel
            key={checkbox.label}
            control={
              <Checkbox
                checked={checkbox.checked}
                onChange={(e) => checkbox.onChange(e.target.checked)}
              />
            }
            label={checkbox.label}
          />
        ))}
      </Stack>
    </Card>
  );
};
