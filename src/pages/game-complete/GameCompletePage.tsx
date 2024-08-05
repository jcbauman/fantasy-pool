import { FC } from "react";
import { PageContainer } from "../../shared-components/PageContainer";
import { Button, Card, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link as RouterLink } from "react-router-dom";
import { GameFantasyDetail } from "../playerDetail/components/GameFantasyDetail";
import { useAppContext } from "../../context/AppContext";

export const GameCompletePage: FC = () => {
  const {
    games,
    scoringMatrix,
    authState: { player },
  } = useAppContext();
  const lastGameId = useSelector((state: RootState) => state.game.lastGameId);
  const targetGame = games.find((game) => game.id === lastGameId);
  return (
    <PageContainer>
      <Stack
        direction="column"
        sx={{ width: "100%", height: "100%", p: 1 }}
        spacing={2}
      >
        <Card sx={{ p: 2, textAlign: "center" }}>
          <Stack direction="column" spacing={2}>
            <Typography variant="h5">GAME COMPLETE</Typography>
            {player && (
              <GameFantasyDetail
                game={targetGame}
                player={player}
                scoringMatrix={scoringMatrix}
              />
            )}
            <Button to="/" variant="contained" component={RouterLink}>
              Back to home
            </Button>
          </Stack>
        </Card>
      </Stack>
    </PageContainer>
  );
};
