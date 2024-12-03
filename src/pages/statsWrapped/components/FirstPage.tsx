import { Stack, Typography } from "@mui/material";
import { FC } from "react";
import SlideInTypography from "./SlideInTypography";
import { Game, Player } from "../../../types";
import {
  countLocations,
  determineLeadersOfWeirdStats,
  getPerGameRankings,
  toOrdinal,
} from "../wrappedUtils";
import { useAppContext } from "../../../context/AppContext";

export const FirstPage: FC<{
  player: Player;
  page: number;
  playerGames: Game[];
}> = ({ player, page, playerGames }) => {
  const playerName = player.name.split(" ")[0];

  const { rankings, allStatsByPlayers } = useAppContext();

  const leaders = determineLeadersOfWeirdStats(
    rankings,
    allStatsByPlayers,
    player.id
  );
  const locationsInfo = countLocations(playerGames);
  const getContent = (): string[] => {
    switch (page) {
      case 1:
        return ["Wow,", `${playerName}, `, "what a season..."];
      case 2:
        return [
          "You've played a total of:",
          `${playerGames.length} games.`,
          `(${toOrdinal(
            rankings["totalWins"].indexOf(player.id)
          )} in the league)`,
          "That's a lot of chalk dust!",
        ];
      case 3:
        return [
          "You got around.",
          `To ${locationsInfo.length} different locations in fact.`,
          "But we all know your favorite:",
          `${locationsInfo[0][0]}`,
          `(${locationsInfo[0][1]} games!)`,
        ];
      case 4:
        return ["You lead in some interesting stats.", leaders];

      default:
        return [];
    }
  };

  return (
    <Stack direction="column" sx={{ p: 4 }}>
      <Typography>
        <SlideInTypography text={getContent()} />
      </Typography>
    </Stack>
  );
};
