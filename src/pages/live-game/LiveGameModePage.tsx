import { Stack } from "@mui/material";
import { FC } from "react";
import { GameStartForm } from "./components/GameStartForm";
import { PageContainer } from "../../shared-components/PageContainer";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { GameInterface } from "./components/GameInterface";

export const LiveGameModePage: FC = () => {
  const { gameIsInProgress } = useSelector((state: RootState) => state.game);
  return (
    <PageContainer authedRoute>
      <Stack direction="column" sx={{ width: "100%", height: "100%", p: 1 }}>
        {gameIsInProgress ? <GameInterface /> : <GameStartForm />}
      </Stack>
    </PageContainer>
  );
};
