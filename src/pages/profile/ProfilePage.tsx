import { Button, Card, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { ProfileEditor, ProfileFormValues } from "./components/ProfileEditor";
import { PageContainer } from "../../shared-components/PageContainer";
import { Link } from "react-router-dom";
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
    league,
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
  const isLeagueAdmin = league?.leagueManagerId === user?.id;
  return (
    <PageContainer authedRoute>
      <Stack
        direction={"column"}
        sx={{
          width: "100%",
          height: "100%",
          p: 1,
          overflow: "visible",
        }}
      >
        <ProfileEditor player={player} onSubmit={onSubmit} />
        {(user?.isAppAdmin || isLeagueAdmin) && (
          <Card sx={{ p: 2, mt: 2, overflow: "visible" }}>
            <Typography variant={"overline"}>Admin</Typography>
            <Stack direction="column" gap={1}>
              {isLeagueAdmin && (
                <Button
                  fullWidth
                  variant="contained"
                  component={Link}
                  to={`/league-admin`}
                  startIcon={<AdminPanelSettingsOutlinedIcon />}
                >
                  View league manager page
                </Button>
              )}
              {user?.isAppAdmin && (
                <Button
                  fullWidth
                  variant="outlined"
                  component={Link}
                  to={`/app-admin`}
                  startIcon={<AdminPanelSettingsOutlinedIcon />}
                >
                  View app admin page
                </Button>
              )}
            </Stack>
          </Card>
        )}
      </Stack>
    </PageContainer>
  );
};
