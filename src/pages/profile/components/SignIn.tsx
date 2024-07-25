import {
  Button,
  Card,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";

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
  const {
    authState: { signIn, createAccount },
  } = useAppContext();
  const [signUpMode, setSignUpMode] = useState(0);
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (signUpMode === 1) {
      const result = await createAccount(data.email, data.password);
      if (!result) throw new Error("No account created");
      navigate("/create-player");
    } else {
      const result = await signIn(data.email, data.password);
      if (result) navigate("/");
    }
    // if (!user) {
    //   setError("email", { message: "No user found for email" });
    // } else if (user.pw !== data.password) {
    //   setError("password", { message: "Incorrect username or password." });
    // } else {
    //   signIn(user.id);
    //   navigate("/");
    // }
  };

  return (
    <Card sx={{ p: 2 }}>
      <Tabs
        sx={{ width: "100%", mb: 2 }}
        value={signUpMode}
        onChange={(_e, newValue) => setSignUpMode(newValue)}
      >
        <Tab label="Sign in" />
        <Tab label="Sign up" />
      </Tabs>
      <Typography variant="overline" sx={{ mb: 2 }}>
        Sign {signUpMode === 0 ? "in to your" : "up for a new"} account
      </Typography>
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
            {signUpMode === 0 ? "Sign in" : "Sign up"}
          </Button>
        </Stack>
      </form>
    </Card>
  );
};
