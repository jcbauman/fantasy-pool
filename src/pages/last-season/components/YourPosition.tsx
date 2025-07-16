import {
  Avatar,
  Badge,
  Card,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { FC } from "react";
import { useAppContext } from "../../../context/AppContext";
import {
  getMedal,
  handleShare,
  toOrdinal,
} from "../../statsWrapped/wrappedUtils";
import styled from "@emotion/styled";
import {
  getAbbreviation,
  normalizePercentage,
  normalizeStat,
} from "../../../utils/statsUtils";
import { Player } from "../../../types";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";

export const YourPosition: FC<{ player: Player | undefined }> = ({
  player,
}) => {
  const { records } = useAppContext();
  if (!player || !records) return <></>;
  const rank = records[player.id]?.rank;
  const medal = getMedal(rank);
  return (
    <Card elevation={10} sx={{ flexShrink: 0 }}>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-around", p: 2, alignItems: "center" }}
      >
        <LargeBadge
          badgeContent={medal}
          sx={{ fontSize: "60px" }}
          overlap="circular"
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Avatar
            src={player.profilePictureUrl}
            alt={player.name}
            sx={{ width: "100px", height: "100px" }}
          >
            <Typography variant="h3">{getAbbreviation(player.name)}</Typography>
          </Avatar>
        </LargeBadge>
        <Stack direction="column" sx={{ width: "100%", ml: 2 }}>
          <Stack direction="row" sx={{ alignItems: "center" }}>
            <Typography variant="h2" fontWeight="bold">
              <i>{toOrdinal(rank)}</i>
            </Typography>
            <Typography
              sx={{
                ml: 2,
                fontSize: "20px",
              }}
            >
              <i>place</i>
            </Typography>
            <IconButton
              size="large"
              aria-label="share"
              aria-haspopup="true"
              color="inherit"
              onClick={() =>
                handleShare("Check out my Fantasy Pool stats from last season!")
              }
              sx={{ ml: "auto" }}
            >
              <IosShareOutlinedIcon />
            </IconButton>
          </Stack>
          <Typography
            variant="overline"
            sx={{
              fontSize: "16px",
              width: "100%",
              textAlign: "center",
              borderTop: "1px solid",
              borderBottom: "1px solid",
              letterSpacing: 1.5,
            }}
          >
            {normalizeStat(records[player.id]?.fantasyScore)} fantasy points
          </Typography>
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="overline" sx={{ fontSize: "12px" }}>
              <i>{records[player.id]?.totalGames} games</i>
            </Typography>
            <Typography variant="overline" sx={{ fontSize: "12px" }}>
              <i>|</i>
            </Typography>
            <Typography variant="overline" sx={{ fontSize: "12px" }}>
              <i>
                {normalizePercentage(records[player.id]?.winPercentage)} wins
              </i>
            </Typography>
            <Typography variant="overline" sx={{ fontSize: "12px" }}>
              <i>|</i>
            </Typography>
            <Typography variant="overline" sx={{ fontSize: "12px" }}>
              <i>{normalizeStat(records[player.id]?.fantasyGameAvg)} avg</i>
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

const LargeBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    width: 60,
    height: 60,
    borderRadius: "50%",
    fontSize: 50,
    top: 25,
    backgroundColor: "transparent",
  },
}));
