import {
  Autocomplete,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { PoolHallLocation } from "../../../types";
import { capitalizeLocation } from "../../../utils/gameUtils";
import { Controller, useForm } from "react-hook-form";
import { EmojiPickerInput } from "./EmojiPickerInput";
import { LocationAvatar } from "./LocationAvatar";
import { ConfirmDeleteLocationDialog } from "./ConfirmDeleteLocationDialog";
import {
  sendErrorNotification,
  sendSuccessNotification,
} from "../../../shared-components/toasts/notificationToasts";
import { deleteLocation } from "../../../backend/endpoints/locations";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";
import { getPlayerFullName } from "../../players/utils/playerUtils";

interface EditLocationDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: PoolHallLocation) => void;
  location: PoolHallLocation;
}

export const EditLocationDrawer: FC<EditLocationDrawerProps> = ({
  open,
  onClose,
  onSave,
  location,
}) => {
  const [loading, setLoading] = useState(false);
  const [confirmDeleteLocationDialogOpen, setConfirmDeleteLocationDialogOpen] =
    useState(false);
  const navigate = useNavigate();
  const {
    players,
    authState: { user, player },
  } = useAppContext();
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<PoolHallLocation>({
    defaultValues: {
      name: location.name,
      city: location.city ?? "",
      state: location.state ?? "",
      icon: location.icon ?? "",
      description: location.description ?? "",
      discoveryPlayerIds: location.discoveryPlayerIds ?? [],
    },
  });
  const playerOptionIds = players
    .sort((a, b) => a.firstName.localeCompare(b.firstName))
    .map((p) => p.id);
  const watchAll = watch();
  return (
    <>
      <Drawer open={open} anchor="bottom" onClose={onClose}>
        <DialogTitle>Edit location</DialogTitle>
        <DialogContent sx={{ pt: 1, overflowY: "visible" }}>
          <form
            id="edit-location-form"
            onSubmit={handleSubmit((data) => {
              setLoading(true);
              onSave({
                ...location,
                name: data.name,
                city: data.city,
                state: data.state,
                icon: data.icon,
                description: data.description,
                discoveryPlayerIds: data.discoveryPlayerIds,
                lastEditedBy: player?.id ?? "",
              });
              onClose();
            })}
          >
            <Stack direction={"column"} gap={2}>
              <TextField
                fullWidth
                variant="outlined"
                type="text"
                label="Name*"
                size="small"
                value={watchAll.name}
                {...register("name", {
                  required: "Location name is required",
                  validate: (value) =>
                    value.trim() !== "" || "Location name is required",
                })}
                onBlur={(e) =>
                  setValue("name", capitalizeLocation(e.target.value))
                }
              />
              {errors.name && (
                <Typography color="error" variant="caption">
                  {errors.name.message}
                </Typography>
              )}
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="City/Borough"
                  placeholder="Brooklyn"
                  size="small"
                  value={watchAll.city}
                  {...register("city")}
                />
                <TextField
                  variant="outlined"
                  type="text"
                  label="State/Country"
                  size="small"
                  value={watchAll.state}
                  inputProps={{ maxLength: 3 }}
                  {...register("state")}
                  onChange={(e) => {
                    const lettersOnly = e.target.value.replace(
                      /[^a-zA-Z]/g,
                      ""
                    );
                    setValue("state", lettersOnly.slice(0, 3).toUpperCase());
                  }}
                />
              </Stack>
              <Stack direction="row" spacing={2} sx={{ alignItems: "start" }}>
                <Stack direction="row">
                  <LocationAvatar location={{ ...watchAll }} />
                  <Controller
                    name="icon"
                    control={control}
                    render={({ field }) => (
                      <EmojiPickerInput
                        name={field.name}
                        value={field.value ?? ""}
                        onChange={(emoji) => setValue("icon", emoji)}
                      />
                    )}
                  />
                </Stack>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  type="text"
                  label="Bio/Description"
                  size="small"
                  maxLength={200}
                  value={watchAll.description}
                  {...register("description")}
                  helperText="Max 200 characters"
                />
              </Stack>
              <Controller
                name="discoveryPlayerIds"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    value={field.value}
                    id="discovery-player-ids-outlined"
                    options={playerOptionIds}
                    getOptionLabel={(option) =>
                      getPlayerFullName(players.find((p) => p.id === option))
                    }
                    filterSelectedOptions
                    onChange={(_event, newValue) => {
                      field.onChange(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        label="Discovered by"
                        placeholder="Select player(s)"
                        error={!!errors.discoveryPlayerIds}
                        helperText="Players who first entered OR played a current season game at this location will be able
                to make edits here."
                      />
                    )}
                  />
                )}
              />
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: "space-between", width: "100%", px: 2 }}
          >
            {user?.isAppAdmin && (
              <Button
                color="error"
                onClick={() => {
                  setConfirmDeleteLocationDialogOpen(true);
                }}
              >
                Delete
              </Button>
            )}
            <Stack
              direction="row"
              sx={{ justifyContent: "flex-end", width: "100%" }}
              spacing={1}
            >
              <Button
                variant="outlined"
                onClick={() => {
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="edit-location-form"
                disabled={loading}
                variant="contained"
              >
                {loading ? <CircularProgress size="1.5rem" /> : "Save"}
              </Button>
            </Stack>
          </Stack>
        </DialogActions>
      </Drawer>
      <ConfirmDeleteLocationDialog
        open={confirmDeleteLocationDialogOpen}
        onClose={() => setConfirmDeleteLocationDialogOpen(false)}
        onConfirm={async () => {
          await deleteLocation(
            location.id,
            () => {
              sendSuccessNotification(`${location.name} deleted successfully`);
              onClose();
              navigate("/locations");
            },
            () => {
              sendErrorNotification("Unable to delete location");
            }
          );
        }}
      />
    </>
  );
};
