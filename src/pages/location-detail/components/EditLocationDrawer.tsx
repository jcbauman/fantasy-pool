import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { PoolHallLocation } from "../../../types";
import { capitalizeLocation } from "../../../utils/gameUtils";
import { useForm } from "react-hook-form";
import { LocationAvatar } from "./LocationAvatar";
import EditIcon from "@mui/icons-material/Edit";

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

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PoolHallLocation>({
    defaultValues: {
      name: location.name,
      city: location.city ?? "",
      state: location.state ?? "",
      icon: location.icon ?? "",
      mapsUrl: location.mapsUrl ?? "",
    },
  });
  const watchAll = watch();
  return (
    <Drawer open={open} anchor="bottom" onClose={onClose}>
      <DialogTitle>Edit location</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSave)}>
          <Stack direction={"column"} gap={2}>
            <TextField
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
              label="State/Country (abbreviation)"
              size="small"
              value={watchAll.state}
              inputProps={{ maxLength: 3 }}
              {...register("state")}
              onChange={(e) => {
                const lettersOnly = e.target.value.replace(/[^a-zA-Z]/g, "");
                setValue("state", lettersOnly.slice(0, 3).toUpperCase());
              }}
            />
            <Stack direction="row" spacing={1}>
              <LocationAvatar location={{ ...watchAll, icon: "🤯" }} />
              <IconButton size="small">
                <EditIcon />
              </IconButton>
            </Stack>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          spacing={1}
          sx={{ justifyContent: "flex-end", width: "100%" }}
        >
          <Stack direction="row" spacing={1}>
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
              disabled={loading}
              variant="contained"
              onClick={() => {
                setLoading(true);
                onClose();
              }}
            >
              {loading ? <CircularProgress size="1.5rem" /> : "Save"}
            </Button>
          </Stack>
        </Stack>
      </DialogActions>
    </Drawer>
  );
};
