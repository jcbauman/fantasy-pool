import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import { getMostPopularLocation } from "../../../utils/gameUtils";
import { updateCurrentPlayer } from "../../../backend/setters";
import {
  sendErrorNotification,
  sendSuccessNotification,
} from "../../../shared-components/toasts/notificationToasts";
import { fireAnalyticsEvent } from "../../../shared-components/hooks/analytics";
import { useDismissedExperiences } from "../../../utils/useDismissedExperiences";
import { getSeasonStart } from "../../../utils/dateUtils";

const PERMANENT_HIDE_MODAL_KEY = "location_update_suggestion_drawer";
const SPECIFIC_HIDE_MODAL_KEY = "suggest-updating-location-to-";
export const LocationUpdateSuggestion: FC = () => {
  const {
    games,
    authState: { player, refetchPlayer },
  } = useAppContext();
  const [open, setOpen] = useState(false);
  const [neverShowAgainChecked, setNeverShowAgainChecked] = useState(false);
  const { addDismissedExperience, experienceWasDismissed } =
    useDismissedExperiences();

  const onClose = (): void => setOpen(false);
  const currLocationString = player?.defaultLocation ?? "other locations.";
  const topLocation = getMostPopularLocation(
    games,
    player?.id,
    player?.defaultLocation,
    5
  );
  const isPermanentlyHidden = experienceWasDismissed(PERMANENT_HIDE_MODAL_KEY);
  const isCurrentLocationSuggestionDismissed = experienceWasDismissed(
    `${SPECIFIC_HIDE_MODAL_KEY}${topLocation}${getSeasonStart()}`
  );

  useEffect(() => {
    if (
      topLocation !== player?.defaultLocation &&
      !isPermanentlyHidden &&
      !isCurrentLocationSuggestionDismissed
    ) {
      setOpen(true);
    }
  }, [
    player?.defaultLocation,
    topLocation,
    isPermanentlyHidden,
    isCurrentLocationSuggestionDismissed,
  ]);

  const onUpdate = async (newLocation: string): Promise<void> => {
    if (!player) return;
    const resolvedPlayer = { ...player, defaultLocation: newLocation };
    await updateCurrentPlayer(
      resolvedPlayer,
      player?.id ?? "",
      () => {
        refetchPlayer();
        sendSuccessNotification("Successfully updated default pool hall");
      },
      () => sendErrorNotification("An error occurred, unable to update profile")
    );
    fireAnalyticsEvent("Profile_Clicked_UpdateSuggestedLocation");
  };

  return (
    <Drawer open={open} anchor="bottom" onClose={onClose}>
      <DialogTitle>Time to update your default pool hall?</DialogTitle>
      <DialogContent>
        <Stack direction="column" gap={2}>
          <Typography variant="body2">
            Lately, you have been playing more games at{" "}
            <strong>{topLocation}</strong> than {currLocationString}.
          </Typography>
          <Typography variant="body2">
            Do you want to update your default pool hall location to{" "}
            <strong>{topLocation}</strong>?
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={neverShowAgainChecked}
                onChange={(_e, checked) => setNeverShowAgainChecked(checked)}
              />
            }
            label={
              <Typography variant="caption">
                Don't suggest changing location again
              </Typography>
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => {
            addDismissedExperience(`${SPECIFIC_HIDE_MODAL_KEY}${topLocation}`);
            onClose();
          }}
        >
          No, thanks
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onUpdate(topLocation);
            if (neverShowAgainChecked) {
              addDismissedExperience(PERMANENT_HIDE_MODAL_KEY);
            }
            onClose();
          }}
        >
          Yes, update
        </Button>
      </DialogActions>
    </Drawer>
  );
};
