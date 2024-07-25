import { Stack } from "@mui/material";
import { FC } from "react";
import { SignIn } from "./components/SignIn";
import { PageContainer } from "../../shared-components/PageContainer";

export const SignInPage: FC = () => {
  return (
    <PageContainer>
      <Stack
        direction={"column"}
        sx={{ width: "100%", height: "100%", p: 1, overflow: "hidden" }}
      >
        <SignIn />
      </Stack>
    </PageContainer>
  );
};
