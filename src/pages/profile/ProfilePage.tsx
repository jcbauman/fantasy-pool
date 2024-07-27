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
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";

export const ProfilePage: FC = () => {
  const {
    authState: { player, user, refetchPlayer },
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
      () => {
        dispatch(sendSuccessNotificaton("Succesfully updated player profile"));
        refetchPlayer();
      },

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
        <Card sx={{ p: 2, mb: 2, overflow: "visible" }}>
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
        {user?.isAppAdmin && (
          <Card sx={{ p: 2, mb: 2, overflow: "visible" }}>
            <Typography variant={"overline"}>Admin</Typography>
            <Button
              fullWidth
              variant="outlined"
              component={Link}
              to={`/app-admin`}
              startIcon={<AdminPanelSettingsOutlinedIcon />}
            >
              View app admin page
            </Button>
          </Card>
        )}
        <ProfileEditor player={player} onSubmit={onSubmit} />
      </Stack>
    </PageContainer>
  );
};
