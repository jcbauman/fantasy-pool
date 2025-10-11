import { FC } from "react";
import { PageContainer } from "../../shared-components/PageContainer";
import { Button, Card, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { handleExportGames, updateGamesWithTimestamps } from "./adminUtils";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import {
  getSeasonStart,
  getSeasonString,
  getThreeMonthsAgo,
} from "../../utils/dateUtils";
import { createRecordsForPlayers } from "../players/utils/playerUtils";
import { addNewSeasonRecords } from "../../backend/setters";
import {
  sendErrorNotification,
  sendSuccessNotification,
} from "../../shared-components/toasts/notificationToasts";

export const AppAdminPage: FC = () => {
  const {
    games,
    players,
    scoringMatrix,
    league,
    authState: { user },
  } = useAppContext();
  const navigate = useNavigate();
  if (!user || !user.isAppAdmin) {
    navigate("/profile");
  }
  const message = `You have been invited to join my Fantasy Pool league. Get started at https://www.fantasy-pool.com/#/sign-in?leagueInvite=${process.env.REACT_APP_LEAGUE_PASSWORD}`;
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
        <Card sx={{ p: 2 }}>
          <Button
            startIcon={<QueryStatsIcon />}
            fullWidth
            variant="outlined"
            onClick={async () => {
              const records = await createRecordsForPlayers(
                players.map((p) => p.id),
                scoringMatrix
              );
              if (!records) {
                sendErrorNotification("No records to save");
                return;
              }
              const resolvedRecords = {
                records,
                leagueId: league?.id ?? "",
                seasonEndDate: getSeasonStart(),
              };
              const newId = await addNewSeasonRecords(resolvedRecords);
              if (newId) {
                sendSuccessNotification("Successfully added new record");
              } else {
                sendErrorNotification("Failed to add new record");
              }
            }}
          >
            Calculate and infill {getSeasonString(getThreeMonthsAgo())} season
          </Button>
        </Card>
      </Stack>
    </PageContainer>
  );
};
