import {
  Button,
  Card,
  Input,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { RegisterOptions, SubmitHandler, useForm } from "react-hook-form";
import { mockUsers } from "../../../backend/fixtures";
import { useAuthState } from "../../../auth/useAuthState";
import { useNavigate } from "react-router-dom";

interface FormValues {
  email: string;
  password: string;
}

export const SignIn: FC = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>();
  const { signIn } = useAuthState();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const user = mockUsers.find((u) => u.email === data.email);
    if (!user) {
      setError("email", { message: "No user found for email" });
    } else if (user.pw !== data.password) {
      setError("password", { message: "Incorrect username or password." });
    } else {
      signIn(user.id);
      navigate("/");
    }
  };

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="overline">Sign in to your account</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" gap={2}>
          <TextField
            type="email"
            variant="outlined"
            label="Email"
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
          <TextField
            variant="outlined"
            type="password"
            label="Password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <Typography color="error" variant="caption">
              {errors.password.message}
            </Typography>
          )}
          <Button type="submit" variant="contained">
            Sign in
          </Button>
        </Stack>
      </form>
    </Card>
  );
};
