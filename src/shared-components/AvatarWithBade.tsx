import styled from "@emotion/styled";
import { Avatar, Badge } from "@mui/material";
import { Player } from "../types";

export const AvatarWithBadge = ({
  player,
  badgeContent,
  size = "large",
}: {
  player: Player;
  badgeContent?: string;
  size?: "large" | "medium";
}) => {
  return (
    <LargeBadge
      size={size}
      badgeContent={badgeContent}
      sx={{ fontSize: size === "large" ? "60px" : "40px" }}
      overlap="circular"
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Avatar
        src={player.profilePictureUrl}
        alt={player.name}
        sx={{
          width: size === "large" ? "100px" : "60px",
          height: size === "large" ? "100px" : "60px",
        }}
      />
    </LargeBadge>
  );
};

const LargeBadge = styled(Badge)<{ size?: "large" | "medium" }>(({ size }) => ({
  "& .MuiBadge-badge": {
    width: size === "large" ? 60 : 40,
    height: size === "large" ? 60 : 40,
    borderRadius: "50%",
    fontSize: size === "large" ? 50 : 30,
    top: size === "large" ? 25 : 15,
    backgroundColor: "transparent",
  },
}));
