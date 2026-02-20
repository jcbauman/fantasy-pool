import { FC, useEffect, useState } from "react";
import { PageContainer } from "../../shared-components/PageContainer";
import {
  Avatar,
  Button,
  Card,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { keyframes } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { GameFantasyDetail } from "../player-detail/components/GameFantasyDetail";
import { useAppContext } from "../../context/AppContext";
import { makePlayerActive } from "../players/utils/inactivityUtils";
import { useConfetti } from "../../shared-components/hooks/useConfetti";
import { Game, PoolHallLocation } from "../../types";
import { Timestamp } from "firebase/firestore";
import { initializeGame } from "../../redux/gameSlice";
import { NavigateNext, Replay } from "@mui/icons-material";
import { fetchLocationByName } from "../../backend/endpoints/locations";
import { fireAnalyticsEvent } from "../../shared-components/hooks/analytics";
import { canEditLocation } from "../location-detail/hooks/utils";

const rotateCounterclockwise = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
`;

export const GameCompletePage: FC = () => {
  const {
    games,
    scoringMatrix,
    players,
    authState: { player, refetchPlayer, user },
  } = useAppContext();
  const { confettiComponent, launchConfetti } = useConfetti();
  const lastGameId = useSelector((state: RootState) => state.game.lastGameId);
  const targetGame = games.find((game) => game.id === lastGameId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isRotating, setIsRotating] = useState(false);
  const [gameLocationObj, setGameLocationObj] = useState<
    PoolHallLocation | undefined
  >(undefined);

  //make involved players active they were out
  useEffect(() => {
    if (targetGame) {
      targetGame.playerIds.forEach((playerId) => {
        const targetPlayer = players.find((p) => p.id === playerId);
        if (targetPlayer) makePlayerActive(targetPlayer, refetchPlayer);
      });
    }
  }, [targetGame, players, refetchPlayer]);

  useEffect(() => {
    const fetchLocationObj = async () => {
      if (targetGame) {
        const locationObj = await fetchLocationByName(
          targetGame.location ?? "",
        );
        if (locationObj) {
          setGameLocationObj(locationObj);
        }
      }
    };
    fetchLocationObj();
  }, [targetGame]);

  useEffect(() => {
    launchConfetti();
  }, [launchConfetti]);

  const restartGame = (): void => {
    setIsRotating(true);
    setTimeout(() => {
      const resolvedGame: Omit<Game, "id"> = {
        location: targetGame?.location,
        playerIds: targetGame?.playerIds ?? [],
        statsByPlayer: [],
        authorPlayerId: targetGame?.authorPlayerId,
        createdAt: Timestamp.fromDate(new Date()),
        timestamp: new Date().toString(),
      };
      dispatch(initializeGame({ ...resolvedGame }));
      navigate("/live-game");
    }, 500);
  };

  const getOtherPlayerNames = () => {
    const relevantFirstNames = (targetGame?.playerIds ?? [])
      .map((playerId) => {
        const player = players.find((p) => p.id === playerId);
        if (player) {
          // Split the full name and return the first name
          return player.firstName;
        }
        return null;
      })
      .filter(Boolean);
    if (relevantFirstNames.length === 0) return "they";
    // Join first names with ' and '
    return relevantFirstNames.join(" and ");
  };

  const viewLocation = async () => {
    if (!gameLocationObj) return;
    navigate(`/locations/${gameLocationObj.id}`);
    fireAnalyticsEvent("GameComplete_Clicked_EditLocation");
  };

  const displayEditLocationCard =
    gameLocationObj &&
    canEditLocation(user, player, gameLocationObj) &&
    !gameLocationObj.icon;

  return (
    <PageContainer>
      <Stack
        direction="column"
        sx={{ width: "100%", height: "100%", p: 1 }}
        spacing={2}
      >
        <Card sx={{ p: 2, textAlign: "center", flexShrink: 0 }}>
          <Stack direction="column" spacing={2}>
            <Stack
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="100%"
              sx={{ mb: 1 }}
            >
              <Divider flexItem />
              <Typography
                variant="h6"
                sx={{ mx: 1, whiteSpace: "nowrap", my: 0.5 }}
              >
                GAME COMPLETE
              </Typography>
              <Divider flexItem />
            </Stack>
            {player && targetGame?.playerIds.includes(player.id) ? (
              <GameFantasyDetail
                game={targetGame}
                player={player}
                scoringMatrix={scoringMatrix}
                includeElapsedTime={true}
              />
            ) : (
              <Typography>
                You didn't play in this game, but {getOtherPlayerNames()}{" "}
                appreciated you tracking for them.
              </Typography>
            )}
            <Button
              size="large"
              to="/"
              variant="contained"
              component={RouterLink}
            >
              Back to home
            </Button>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Typography>
                <i>or</i>
              </Typography>
              <Button
                startIcon={
                  <Replay
                    sx={{
                      animation: isRotating
                        ? `${rotateCounterclockwise} 0.5s ease-in-out`
                        : "none",
                    }}
                  />
                }
                fullWidth
                size="large"
                variant="outlined"
                onClick={restartGame}
              >
                Run it back?
              </Button>
            </Stack>
          </Stack>
        </Card>
        {displayEditLocationCard && (
          <Card sx={{ p: 2, textAlign: "center", flexShrink: 0 }}>
            <Stack direction="row" gap={2}>
              <Avatar alt="?">✏️</Avatar>
              <Typography textAlign="left" variant="caption">
                Help out the community by adding an icon and details for{" "}
                {targetGame?.location ? targetGame.location : "this location"}.
              </Typography>
              <IconButton sx={{ flexShrink: 0 }} onClick={() => viewLocation()}>
                <NavigateNext />
              </IconButton>
            </Stack>
          </Card>
        )}
        {confettiComponent()}
      </Stack>
    </PageContainer>
  );
};
