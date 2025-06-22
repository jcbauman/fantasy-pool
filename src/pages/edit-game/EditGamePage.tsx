import { Button, Stack, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { PageContainer } from "../../shared-components/PageContainer";
import { GameEditingInterface } from "../live-game/components/GameEditingInterface";
import { useGameParams } from "./hooks/useGameParams";
import { useAppContext } from "../../context/AppContext";
import { canEditGame } from "./utils";
import { Link } from "react-router-dom";

export const EditGameModePage: FC = () => {
  const {
    authState: { player, user },
  } = useAppContext();
  const { game, loading } = useGameParams();
  const [canEdit, setCanEdit] = useState(false);
  useEffect(() => {
    if (game && player && user) {
      setCanEdit(canEditGame(game, player.id, user.isAppAdmin));
    }
  }, [game, player, user]);
  return (
    <PageContainer authedRoute loading={loading}>
      <Stack direction="column" sx={{ width: "100%", height: "100%", p: 1 }}>
        {(!canEdit || !game) && (
          <Stack
            direction="column"
            sx={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="overline">
              {!game
                ? "Game not found"
                : "You are not allowed to edit this game"}
            </Typography>
            <Button variant="contained" to="/home" component={Link}>
              Back to home
            </Button>
          </Stack>
        )}
        {game && canEdit && <GameEditingInterface gameToEdit={game} />}
      </Stack>
    </PageContainer>
  );
};
