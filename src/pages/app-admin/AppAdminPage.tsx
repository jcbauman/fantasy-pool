import { FC } from "react";
import { PageContainer } from "../../shared-components/PageContainer";
import { Button, Card, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { handleExportGames, updateGamesWithTimestamps } from "./adminUtils";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { INVITE_PW } from "../../utils/constants";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

export const AppAdminPage: FC = () => {
  const {
    games,
    authState: { user },
  } = useAppContext();
  const navigate = useNavigate();
  if (!user || !user.isAppAdmin) {
    navigate("/profile");
  }
  const message = `You have been invited to join my Fantasy Pool league. Get started at https://www.fantasy-pool.com/#/sign-in?leagueInvite=${INVITE_PW}`;
  const smsUrl = `sms:?body=${message}`;
  return (
    <PageContainer authedRoute>
      <Stack direction="column" spacing={3} sx={{ p: 2 }}>
        <Card sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            href={smsUrl}
            target="_blank"
            startIcon={<SendOutlinedIcon />}
          >
            Send league invite message
          </Button>
        </Card>
        <Card sx={{ p: 2 }}>
          <Button
            startIcon={<FileDownloadOutlinedIcon />}
            fullWidth
            variant="outlined"
            onClick={() => handleExportGames(games)}
          >
            Export {games.length} games to file
          </Button>
        </Card>
        <Card sx={{ p: 2 }}>
          <Button
            startIcon={<AccessTimeIcon />}
            fullWidth
            variant="outlined"
            onClick={() => updateGamesWithTimestamps()}
          >
            Infill timestamps
          </Button>
        </Card>
      </Stack>
    </PageContainer>
  );
};
