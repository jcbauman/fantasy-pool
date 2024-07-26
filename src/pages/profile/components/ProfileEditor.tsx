import {
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
import { mockLeague } from "../../../backend/fixtures";

export interface ProfileFormValues {
  email: string;
  name: string;
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
  } = useAppContext();
  const defaultValues = useMemo(() => {
    return {
      email: user?.email,
      name: player?.name,
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
                label="Name"
                size="small"
                defaultValue={watchAll.name}
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && (
                <Typography color="error" variant="caption">
                  {errors.name.message}
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
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Default pool hall"
                  size="small"
                  {...register("defaultLocation")}
                  defaultValue={watchAll.defaultLocation}
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
                      <RadioGroup row {...field}>
                        <FormControlLabel
                          value="false"
                          control={<Radio />}
                          label="Healthy"
                        />
                        <FormControlLabel
                          value="true"
                          control={<Radio />}
                          label="Out"
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
                  defaultValue={mockLeague.name}
                  size="small"
                  disabled
                />
              </Card>
            </Stack>
          </form>
          {window.location.pathname.startsWith("/profile") && (
            <Button variant="text" color="error" fullWidth onClick={signOut}>
              Sign out
            </Button>
          )}
        </Stack>
      </Card>
    </Stack>
  );
};
