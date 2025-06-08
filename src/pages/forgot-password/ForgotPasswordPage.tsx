import {
  Button,
  Card,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { PageContainer } from "../../shared-components/PageContainer";
import { Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  sendErrorNotification,
  sendSuccessNotification,
} from "../../shared-components/toasts/notificationToasts";
import { auth } from "../../backend/firebase/firebaseConfig";

interface FormValues {
  email: string;
}

export const ForgotPasswordPage: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      await sendPasswordResetEmail(auth, data.email, {
        url: "https://fantasy-pool.com",
      });
      sendSuccessNotification("Sent! Check your email");
    } catch (_e) {
      sendErrorNotification("Could not send password reset email");
    }
  };

  return (
    <PageContainer isUnauthedRoute>
      <Stack
        direction={"column"}
        sx={{ width: "100%", height: "100%", p: 1, overflow: "hidden" }}
      >
        <Card sx={{ p: 2 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter your email to receive a password reset link:
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack direction="column" gap={2}>
              <TextField
                autoFocus
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
              <Button type="submit" variant="contained" size="large">
                Send recovery email
              </Button>
              <Link
                sx={{
                  textAlign: "center",
                  color: "white",
                  textDecorationColor: "white",
                }}
                to="/sign-in"
                component={RouterLink}
              >
                <Typography variant="caption">Back to sign in</Typography>
              </Link>
            </Stack>
          </form>
        </Card>
      </Stack>
    </PageContainer>
  );
};
