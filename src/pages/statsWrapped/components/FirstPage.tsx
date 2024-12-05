import { Stack, Typography } from "@mui/material";
import { FC } from "react";
import SlideInTypography from "./SlideInTypography";
import { Game, Player } from "../../../types";
import {
  countLocations,
  determineLeadersOfWeirdStats,
  getGoodAndBadDays,
  getMainAffirmation,
  getMedal,
  getPercentageBanter,
  toOrdinal,
} from "../wrappedUtils";
import { useAppContext } from "../../../context/AppContext";
import { normalizeStat } from "../../../utils/statsUtils";

const BG_COLORS = ["#ebb604", "#cc1301", "#0c1a7d", "#02694b", "#770504"];

export const FirstPage: FC<{
  player: Player;
  page: number;
  playerGames: Game[];
}> = ({ player, page, playerGames }) => {
  const playerName = player.name.split(" ")[0];

  const { rankings, allStatsByPlayers, scoringMatrix } = useAppContext();

  const statLeaderString = determineLeadersOfWeirdStats(rankings, player.id);
  const locationsInfo = countLocations(playerGames);
  const {
    worstDay,
    worstDayPoints,
    bestDay,
    bestDayPoints,
    badDayCount,
    goodDayCount,
  } = getGoodAndBadDays(playerGames, player.id, scoringMatrix);
  const percentBanter = getPercentageBanter(
    rankings,
    allStatsByPlayers,
    player.id
  );
  const mainRank = rankings["fantasyScore"].indexOf(player.id);
  const medal = getMedal(mainRank);
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
          "That's a lot of chalk dust! 🎱",
        ];
      case 3:
        return [
          "You got around.",
          `To ${locationsInfo.length} different locations in fact.`,
          "But we all know your favorite:",
          `${locationsInfo[0][0]} 📍`,
          `(${locationsInfo[0][1]} games!)`,
        ];
      case 4:
        if (statLeaderString === "") {
          return [
            "You're not leading in any stats.",
            "But that's okay!",
            "There's always next season... 📊",
          ];
        } else {
          return [
            "You lead your league in some interesting ways. 📊",
            statLeaderString,
          ];
        }
      case 5:
        return [
          "You've had some 🔥 and 🚽 days this season.",
          `${goodDayCount} good days, to be exact.`,
          `And only ${badDayCount} bad days!`,
          "Cause when you're on, you're on.",
        ];
      case 6:
        return [
          "Your best day of pool this season:",
          `${bestDay} (${normalizeStat(bestDayPoints)} pts!) 🤩`,
          "Your worst day of pool this season:",
          `${worstDay} (${normalizeStat(worstDayPoints)} pts) 😪`,
        ];
      case 7:
        return percentBanter;
      case 8:
        return [
          `${playerName}, 🫡`,
          ...getMainAffirmation(mainRank),
          medal.length ? `This is for you: ${medal}` : "Until next season...",
        ];
      default:
        return [];
    }
  };

  return (
    <Stack
      direction="column"
      sx={{
        p: 4,
        backgroundColor: BG_COLORS[page % BG_COLORS.length],
        height: "100%",
      }}
    >
      <SlideInTypography text={getContent()} />
    </Stack>
  );
};
