import { FC } from "react";
import { PageContainer } from "../../shared-components/PageContainer";
import { Button, Card, Stack } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useDispatch } from "react-redux";
import { sendSuccessNotificaton } from "../../redux/notificationSlice";
import { collapsRepeatGames } from "./adminUtils";

export const AppAdminPage: FC = () => {
  const {
    games,
    authState: { user },
  } = useAppContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (!user || !user.isAppAdmin) {
    navigate("/profile");
  }
  const message = `You have been invited to join my Fantasy Pool league. Get started at https://www.fantasy-pool.com?leagueInvite=rock`;
  const smsUrl = `sms:?body=${message}`;
  return (
    <PageContainer authedRoute>
      <Stack direction="column" spacing={2} sx={{ p: 2 }}>
        <Card sx={{ p: 2 }}>
          <Button fullWidth variant="outlined" href={smsUrl} target="_blank">
            Send league invite message
          </Button>
        </Card>
        <Card sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() =>
              collapsRepeatGames(games, (message: string) =>
                dispatch(sendSuccessNotificaton(message))
              )
            }
          >
            Collapse repeat games
          </Button>
        </Card>
      </Stack>
    </PageContainer>
  );
};
