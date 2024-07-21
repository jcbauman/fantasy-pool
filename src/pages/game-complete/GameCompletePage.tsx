import { FC } from "react";
import { PageContainer } from "../../shared-components/PageContainer";
import { Button, Card, Stack, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const GameCompletePage: FC = () => {
  const lastGameId = useSelector((state: RootState) => state.game.lastGameId);
  return (
    <PageContainer>
      <Stack
        direction="column"
        sx={{ width: "100%", height: "100%", p: 1 }}
        spacing={2}
      >
        <Card sx={{ p: 2, textAlign: "center" }}>
          <Stack direction="column" spacing={2}>
            <Typography variant="h4">Game Complete!</Typography>
            {lastGameId}
            <Button href="/" variant="contained">
              Back to home
            </Button>
          </Stack>
        </Card>
      </Stack>
    </PageContainer>
  );
};
