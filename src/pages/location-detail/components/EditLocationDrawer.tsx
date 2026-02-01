import {
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
    authState: { user },
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
    },
  });
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
              onSave(data);
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

              <Stack direction="row" spacing={4}>
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
                  variant="outlined"
                  type="text"
                  label="State/Country (abbreviation)"
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
