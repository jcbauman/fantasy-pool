import { Avatar, Badge, Card, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { useAppContext } from "../../../context/AppContext";
import { getMedal, toOrdinal } from "../../statsWrapped/wrappedUtils";
import styled from "@emotion/styled";
import { normalizeStat } from "../../../utils/statsUtils";

export const YourPosition: FC = () => {
  const {
    records,
    authState: { player },
  } = useAppContext();
  if (!player || !records) return <></>;
  const rank = records[player.id]?.rank;
  const medal = getMedal(rank);
  return (
    <Card elevation={10}>
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
          />
        </LargeBadge>
        <Stack direction="column">
          <Stack direction="row" sx={{ alignItems: "center" }}>
            <Typography variant="h2" fontWeight="bold">
              {toOrdinal(rank)}
            </Typography>
            <Typography variant="overline" sx={{ ml: 3, fontSize: "16px" }}>
              Place
            </Typography>
          </Stack>
          <Typography variant="overline" sx={{ fontSize: "16px" }}>
            <i>
              {normalizeStat(records[player.id]?.fantasyScore)} total fantasy
              points
            </i>
          </Typography>
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
