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

export const LandingPage: FC = () => {
  return (
    <PageContainer isUnauthedRoute isLandingPage>
      <Stack
        direction={"column"}
        sx={{ width: "100%", height: "100%", p: 1, overflow: "hidden" }}
      >
        Welcome to Fantasy Pool
      </Stack>
    </PageContainer>
  );
};
