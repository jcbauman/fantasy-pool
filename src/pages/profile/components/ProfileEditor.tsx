import {
  Autocomplete,
  Avatar,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useAppContext } from "../../../context/AppContext";
import { Player } from "../../../types";
import { useLocation } from "react-router-dom";
import { useFetchLocations } from "../../../backend/getters";
import { capitalizeLocation } from "../../../utils/gameUtils";

export interface ProfileFormValues {
  email: string;
  firstName: string;
  lastName: string;
  nickname: string;
  out: boolean;
  profilePictureUrl: string;
  defaultLocation: string;
}

export const ProfileEditor: FC<{
  player: Player | null;
  onSubmit: (data: ProfileFormValues) => void;
}> = ({ player, onSubmit }) => {
  const {
    authState: { user, signOut },
    league,
  } = useAppContext();
  const locations = useFetchLocations();
  const location = useLocation();
  const defaultValues = useMemo(() => {
    return {
      email: user?.email,
      firstName: player?.firstName,
      lastName: player?.lastName,
      nickname: player?.nickname,
      out: player?.out ?? false,
      profilePictureUrl: player?.profilePictureUrl,
      defaultLocation: player?.defaultLocation,
    };
  }, [user, player]);
  const {
    register,
    watch,
    reset,
    setValue,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);
  const watchAll = watch();

  return (
    <Stack direction="column">
      <Card sx={{ p: 2 }}>
        <Stack direction={"column"} gap={2}>
          <Typography variant={"overline"}>
            {Boolean(player) ? "Edit" : "Create"} your profile
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack direction={"column"} gap={2}>
              <TextField
                variant="outlined"
                type="text"
                label="First name"
                size="small"
                defaultValue={watchAll.firstName}
                {...register("firstName", {
                  required: "First name is required",
                })}
              />
              {errors.firstName && (
                <Typography color="error" variant="caption">
                  {errors.firstName.message}
                </Typography>
              )}
              <TextField
                variant="outlined"
                type="text"
                label="Last name"
                size="small"
                defaultValue={watchAll.lastName}
                {...register("lastName", { required: "Last name is required" })}
              />
              {errors.lastName && (
                <Typography color="error" variant="caption">
                  {errors.lastName.message}
                </Typography>
              )}
              <TextField
                variant="outlined"
                type="text"
                label="Nickname"
                size="small"
                defaultValue={watchAll.nickname}
                {...register("nickname", { required: "Nickname is required" })}
              />
              <TextField
                variant="outlined"
                type="email"
                label="Email"
                size="small"
                disabled
                defaultValue={watchAll.email}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <Typography color="error" variant="caption">
                  {errors.email.message}
                </Typography>
              )}
              <Stack direction="row" gap={1} sx={{ alignItems: "center" }}>
                <LocationOnOutlinedIcon />
                <Autocomplete
                  size="small"
                  fullWidth
                  value={watchAll.defaultLocation}
                  {...register("defaultLocation")}
                  freeSolo
                  onChange={(_e, newValue) => {
                    setValue("defaultLocation", capitalizeLocation(newValue));
                  }}
                  onInputChange={(_e, newInputValue) =>
                    setValue(
                      "defaultLocation",
                      capitalizeLocation(newInputValue)
                    )
                  }
                  options={locations}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Default pool hall"
                      placeholder="Select location or enter a new one"
                    />
                  )}
                />
              </Stack>
              <FormControl>
                <FormLabel>
                  <Typography variant="overline">Status</Typography>
                </FormLabel>
                <FormControl component="fieldset">
                  <Controller
                    name="out"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        row
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value === "true";
                          setValue("out", value);
                        }}
                      >
                        <FormControlLabel
                          value="false"
                          control={<Radio />}
                          label="Healthy"
                          checked={watchAll.out === false}
                        />
                        <FormControlLabel
                          value="true"
                          control={<Radio />}
                          label="Out"
                          checked={watchAll.out === true}
                        />
                      </RadioGroup>
                    )}
                  />
                </FormControl>
              </FormControl>
              <Stack direction="row" gap={1} sx={{ alignItems: "center" }}>
                <Avatar src={watchAll.profilePictureUrl} />
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Profile image URL"
                  size="small"
                  {...register("profilePictureUrl")}
                  defaultValue={watchAll.profilePictureUrl}
                />
              </Stack>
              <Button variant="contained" color="primary" type="submit">
                Save changes
              </Button>
              <Card sx={{ p: 2 }} raised>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="League"
                  defaultValue={league?.name}
                  size="small"
                  disabled
                />
              </Card>
            </Stack>
          </form>
          {location.pathname.startsWith("/profile") && (
            <Button variant="text" color="error" fullWidth onClick={signOut}>
              Sign out
            </Button>
          )}
        </Stack>
      </Card>
    </Stack>
  );
};
