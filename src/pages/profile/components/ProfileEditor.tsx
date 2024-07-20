import {
  Avatar,
  Button,
  Card,
  FormControl,
  FormControlLabel,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useEffect, useMemo } from "react";
import { useAuthState } from "../../../auth/useAuthState";
import { Controller, useForm } from "react-hook-form";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

interface FormValues {
  email: string;
  name: string;
  nickname: string;
  out: boolean;
  profileImageUrl: string;
  defaultLocation: string;
}

export const ProfileEditor: FC = () => {
  const { user, player, signOut } = useAuthState();
  const defaultValues = useMemo(() => {
    return {
      email: user?.email,
      name: player?.name,
      nickname: player?.nickname,
      out: player?.out,
      profileImageUrl: player?.profilePictureUrl,
      defaultLocation: player?.defaultLocation,
    };
  }, [user, player]);
  const {
    register,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const watchAll = watch();
  return (
    <Stack direction="column">
      <Card sx={{ p: 2, mb: 2 }}>
        <Typography variant={"overline"}>Your stats</Typography>
        <Button
          fullWidth
          variant="outlined"
          color="success"
          href={`/players/${player?.id}`}
          startIcon={<LeaderboardOutlinedIcon />}
        >
          View my player stats
        </Button>
      </Card>
      <Card sx={{ p: 2 }}>
        <Stack direction={"column"} gap={2}>
          <Typography variant={"overline"}>Edit your profile</Typography>
          <form>
            <Stack direction={"column"} gap={2}>
              <TextField
                variant="outlined"
                type="text"
                label="Name"
                size="small"
                defaultValue={watchAll.name}
                {...register("name")}
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
                {...register("nickname")}
              />
              <TextField
                variant="outlined"
                type="email"
                label="Email"
                size="small"
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
                <Controller
                  name="out"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      row
                      {...field}
                      value={field.value || ""}
                      onChange={(event) => field.onChange(event.target.value)}
                    >
                      <FormControlLabel
                        value="true"
                        control={<Radio />}
                        label="Active"
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label="Out"
                      />
                    </RadioGroup>
                  )}
                />
              </FormControl>
              <Stack direction="row" gap={1} sx={{ alignItems: "center" }}>
                <Avatar src={watchAll.profileImageUrl} />
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Profile image URL"
                  size="small"
                  {...register("profileImageUrl")}
                  defaultValue={watchAll.profileImageUrl}
                />
              </Stack>
              <Button variant="contained" color="primary">
                Save changes
              </Button>
              <Card sx={{ p: 2 }} raised>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="League"
                  size="small"
                  disabled
                />
              </Card>
            </Stack>
          </form>
          <Button variant="text" color="error" fullWidth onClick={signOut}>
            Sign out
          </Button>
        </Stack>
      </Card>
    </Stack>
  );
};
