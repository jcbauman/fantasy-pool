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

export const LocationUpdateSuggestion: FC<{}> = ({}) => {
  const {
    games,
    authState: { player },
  } = useAppContext();
  const [open, setOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const onClose = (): void => setOpen(false);
  const currLocationString = player?.defaultLocation ?? "other locations.";
  const topLocation = getMostPopularLocation(
    games,
    player?.id,
    player?.defaultLocation,
    5
  );
  useEffect(() => {
    if (topLocation !== player?.defaultLocation) {
      setOpen(true);
    }
  }, [player?.defaultLocation, topLocation]);
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
                checked={dontShowAgain}
                onChange={(_e, checked) => setDontShowAgain(checked)}
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
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onClose}>
          Yes, update
        </Button>
      </DialogActions>
    </Drawer>
  );
};
