import { Button, Card, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { ProfileEditor, ProfileFormValues } from "./components/ProfileEditor";
import { PageContainer } from "../../shared-components/PageContainer";
import { Link } from "react-router-dom";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import { useAppContext } from "../../context/AppContext";
import { Player } from "../../types";
import { updateCurrentPlayer } from "../../backend/setters";
import { useDispatch } from "react-redux";
import {
  sendErrorNotification,
  sendSuccessNotificaton,
} from "../../redux/notificationSlice";

export const ProfilePage: FC = () => {
  const {
    authState: { player, user },
  } = useAppContext();
  const dispatch = useDispatch();

  const onSubmit = async (data: ProfileFormValues) => {
    const resolvedPlayer: Omit<Player, "id"> = {
      linkedUserId: player?.linkedUserId ?? "",
      ...data,
    };
    await updateCurrentPlayer(
      resolvedPlayer,
      player?.id ?? "",
      () =>
        dispatch(sendSuccessNotificaton("Succesfully updated player profile")),
      () =>
        dispatch(
          sendErrorNotification("An error occurred, unable to update profile")
        )
    );
  };
  return (
    <PageContainer authedRoute>
      <Stack
        direction={"column"}
        sx={{ width: "100%", height: "100%", p: 1, overflow: "hidden" }}
      >
        <Card sx={{ p: 2, mb: 2 }}>
          <Typography variant={"overline"}>Your stats</Typography>
          <Button
            fullWidth
            variant="outlined"
            color="success"
            component={Link}
            to={`/players/${player?.id}`}
            startIcon={<LeaderboardOutlinedIcon />}
          >
            View my player stats
          </Button>
        </Card>
        <ProfileEditor player={player} onSubmit={onSubmit} />
      </Stack>
    </PageContainer>
  );
};
