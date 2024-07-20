import { Stack } from "@mui/material";
import { FC } from "react";
import { GameStartForm } from "./components/GameStartForm";
import { PageContainer } from "../../shared-components/PageContainer";

export const LiveGameModePage: FC = () => {
  return (
    <PageContainer>
      <Stack direction="column" sx={{ width: "100%", height: "100%", p: 1 }}>
        <GameStartForm />
      </Stack>
    </PageContainer>
  );
};
