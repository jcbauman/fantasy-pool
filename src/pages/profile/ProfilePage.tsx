import { Card, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { useAuthState } from "../../auth/useAuthState";
import { SignIn } from "./components/SignIn";
import { ProfileEditor } from "./components/ProfileEditor";
import { PageContainer } from "../../shared-components/PageContainer";

export const ProfilePage: FC = () => {
  const { isAuthed } = useAuthState();
  return (
    <PageContainer>
      <Stack
        direction={"column"}
        sx={{ width: "100%", height: "100%", p: 1, overflow: "hidden" }}
      >
        {isAuthed ? <ProfileEditor /> : <SignIn />}
      </Stack>
    </PageContainer>
  );
};
