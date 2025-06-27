import {
  Box,
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

export const LandingPage: FC = () => {
  return (
    <PageContainer isUnauthedRoute isLandingPage>
      <Stack
        direction={"column"}
        sx={{
          width: "100%",
          height: "100%",
          maxHeight: "100vh",
          overflowY: "auto",
        }}
      >
        <Box
          component="img"
          src="/images/wrapped/vin.jpeg"
          alt="Example"
          sx={{
            width: "100%",
            height: "auto",
            borderRadius: 2,
            boxShadow: 1,
          }}
        />
        <Box position="absolute" top="30%" left={10}>
          <Typography fontWeight="bold" variant="h3">
            Track your 8-ball pool like never before
          </Typography>
        </Box>
        <Stack
          sx={{
            display: "grid",
            height: "100vh",
            width: "100%",
            p: 3,
            background:
              "linear-gradient(red 0%, black 100%), linear-gradient(90deg, #84d2ff, #8d5acd)",
          }}
        ></Stack>
        <Box sx={{ height: "100vh" }} />
        <Box sx={{ height: "100vh" }} />
      </Stack>
    </PageContainer>
  );
};
