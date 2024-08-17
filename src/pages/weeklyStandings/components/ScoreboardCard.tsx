import { Avatar, Badge, Card, Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { RankingsByWeek } from "../hooks/useGetWeeklyStandings";
import { formatDateToMMDD } from "../../../utils/statsUtils";
import { useAppContext } from "../../../context/AppContext";
import { Player } from "../../../types";
import { getPlayerNameAbbreviation } from "../../playersList/utils/playerUtils";
import styled from "@emotion/styled";

const badgeIcons = ["🥇", "🥈", "🥉"];
export const ScoreboardCard: FC<{
  dateKey: string;
  rankings: Record<string, string[]>;
}> = ({ rankings, dateKey }) => {
  const { players } = useAppContext();
  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="column">
        <Typography textAlign="center" letterSpacing={2}>
          Week of {formatDateToMMDD(new Date(dateKey))}
        </Typography>
        <Divider />
        <Stack
          direction="row"
          sx={{
            alignItems: "flex-end",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          {[0, 1, 2].map((rank) => {
            return (
              <StatBox
                rank={rank}
                badgeContent={badgeIcons[rank]}
                player={players.find(
                  (p) => p.id === rankings["fantasyScore"]?.[rank]
                )}
              />
            );
          })}
        </Stack>
      </Stack>
    </Card>
  );
};

const LargeBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    width: 40, // Set the badge width
    height: 40, // Set the badge height
    borderRadius: "50%", // Ensure it's a circle
    fontSize: 35,
    backgroundColor: "transparent",
  },
}));

const StatBox: FC<{ player?: Player; badgeContent: string; rank: number }> = ({
  player,
  badgeContent,
  rank,
}) => {
  return (
    <Stack direction="column" sx={{ alignItems: "center", maxWidth: "33%" }}>
      <LargeBadge
        badgeContent={badgeContent}
        sx={{ fontSize: "40px" }}
        overlap="circular"
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Avatar
          sx={{ width: 56 - rank * 8, height: 56 - rank * 8 }}
          alt={player?.name}
          src={player?.profilePictureUrl}
        />
      </LargeBadge>
      <Typography noWrap variant="overline">
        {getPlayerNameAbbreviation(player?.name || "?")}
      </Typography>
    </Stack>
  );
};
