import { Button, Card, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { ProfileEditor, ProfileFormValues } from "./components/ProfileEditor";
import { PageContainer } from "../../shared-components/PageContainer";
import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Player } from "../../types";
import { updateCurrentPlayer } from "../../backend/setters";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import { SettingsEditor } from "./components/SettingsEditor";
import {
  sendErrorNotification,
  sendSuccessNotification,
} from "../../shared-components/toasts/notificationToasts";

export const ProfilePage: FC = () => {
  const {
    authState: { player, user, refetchPlayer },
  } = useAppContext();

  const onSubmit = async (data: ProfileFormValues) => {
    const resolvedPlayer: Omit<Player, "id"> = {
      linkedUserId: player?.linkedUserId ?? "",
      ...data,
    };
    await updateCurrentPlayer(
      resolvedPlayer,
      player?.id ?? "",
      () => {
        sendSuccessNotification("Successfully updated player profile");

        refetchPlayer();
      },

      () => sendErrorNotification("An error occurred, unable to update profile")
    );
  };

  return (
    <PageContainer authedRoute>
      <Stack
        direction={"column"}
        gap={2}
        sx={{
          width: "100%",
          height: "100%",
          p: 1,
          overflow: "visible",
        }}
      >
        <ProfileEditor player={player} onSubmit={onSubmit} />
        {Boolean(player) && <SettingsEditor />}
        {user?.isAppAdmin && (
          <Card sx={{ p: 2, mt: 2, overflow: "visible" }}>
            <Typography variant={"overline"}>Admin</Typography>
            <Stack direction="column" gap={2}>
              {user?.isAppAdmin && (
                <Button
                  fullWidth
                  variant="contained"
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
