import { Badge, Divider, Skeleton, Stack, Typography } from "@mui/material";
import { FC, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ScoreboardOutlinedIcon from "@mui/icons-material/ScoreboardOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LiveHelpOutlinedIcon from "@mui/icons-material/LiveHelpOutlined";
import { PageContainer } from "../../shared-components/PageContainer";
import { useAppContext } from "../../context/AppContext";
import { Link as RouterLink } from "react-router-dom";
import EightBallIcon from "../../shared-components/icons/EightBallIcon";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import { WrappedOverviewButton } from "../stats-wrapped/components/WrappedOverviewButton";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import { joinedInTimeFor2024Wrapped } from "../players/utils/playerUtils";
import { NewSeasonDialog } from "./components/NewSeasonDialog";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import { formatSeasonString } from "../../utils/dateUtils";
import { CalendarMonthOutlined } from "@mui/icons-material";
import { canSeeLastSeason } from "../../utils/gameUtils";
import { LocationUpdateSuggestion } from "../profile/components/LocationUpdateSuggestion";

const WRAPPED_STORAGE_KEY = "2024_wrapped_storage_keyyy";

export const OverviewComponent: FC = () => {
  const {
    league,
    records,
    authState: { player, user },
    notificationBadgesState,
    initialLoading,
    
  } = useAppContext();
  const isLeagueAdmin = league?.leagueManagerId === user?.id;
  const seasonString = formatSeasonString();
  const NEW_SEASON_STORAGE_KEY = seasonString;
  const LAST_SEASON_STORAGE_KEY = `${seasonString}-last-season`;
  const LATEST_RULE_STORAGE_KEY = "rule-july-25-25";
  const hasClickedWrapped = Boolean(localStorage.getItem(WRAPPED_STORAGE_KEY));
  const canAccessWrapped = joinedInTimeFor2024Wrapped(player?.joinDate);
  const wrappedEnabled = league?.release2024Wrapped && canAccessWrapped;
  const hasSeenNewSeasonDialog = Boolean(
    localStorage.getItem(NEW_SEASON_STORAGE_KEY)
  );
  const hasSeenLastSeasonDialog = Boolean(
    localStorage.getItem(LAST_SEASON_STORAGE_KEY)
  );
  const hasSeenLatestRuleUpdate = Boolean(
    localStorage.getItem(LATEST_RULE_STORAGE_KEY)
  );
  const [showNewSeasonDialog, setShowNewSeasonDialog] = useState(
    !hasSeenNewSeasonDialog
  );
  const showLastSeasonTab = canSeeLastSeason(records, player?.id);

  return (
    <PageContainer authedRoute loading={initialLoading}>
      <Stack direction="column" sx={{ width: "100%", height: "100%" }}>
        {wrappedEnabled && !hasClickedWrapped && (
          <WrappedOverviewButton
            href={`/wrapped-2024/${player?.id ?? "9"}`}
            onClick={() => {
              localStorage.setItem(WRAPPED_STORAGE_KEY, "true");
            }}
          />
        )}
        <Stack
          direction="column"
          sx={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
            px: 2,
            pt: 2,
          }}
        >
          <Typography variant="overline" lineHeight={0.5}>
            <strong>League</strong>
          </Typography>
          {league?.name ? (
            <Typography variant="overline" fontSize={16}>
              {league?.name}
            </Typography>
          ) : (
            <Skeleton variant="text" width={150} height={20} />
          )}
          <Typography variant="caption" sx={{ fontStyle: "italic" }}>
            {seasonString}
          </Typography>
        </Stack>
        <Box sx={{ width: "100%" }}>
          <List>
            <Divider component="li" />
            <ListItem disablePadding>
              <ListItemButton to="/live-game" component={RouterLink}>
                <ListItemIcon>
                  <EightBallIcon color="white" />
                </ListItemIcon>
                <ListItemText
                  primary="Game mode"
                  secondary="Enter stats for a live game"
                />
              </ListItemButton>
            </ListItem>
            <Divider component="li" />
            <ListItem disablePadding>
              <ListItemButton to="/players" component={RouterLink}>
                <ListItemIcon>
                  <LeaderboardOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Players and standings" />
              </ListItemButton>
            </ListItem>
            <Divider component="li" />
            <ListItem disablePadding>
              <ListItemButton
                to={`/games`}
                component={RouterLink}
                onClick={() => notificationBadgesState.viewGamesPage()}
              >
                <ListItemIcon>
                  <Badge
                    variant="dot"
                    invisible={!notificationBadgesState.newGame}
                    color="info"
                  >
                    <ScoreboardOutlinedIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Recent games" />
              </ListItemButton>
            </ListItem>
            <Divider component="li" />
            <ListItem disablePadding>
              <ListItemButton
                to={`/players/${player?.id ?? ""}`}
                component={RouterLink}
              >
                <ListItemIcon>
                  <AccountBoxOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="My player profile" />
              </ListItemButton>
            </ListItem>
            {showLastSeasonTab && <Divider component="li" />}
            {showLastSeasonTab && (
              <ListItem disablePadding>
                <ListItemButton
                  to={`/last-season/${player?.id ?? ""}`}
                  component={RouterLink}
                  onClick={() =>
                    localStorage.setItem(LAST_SEASON_STORAGE_KEY, "true")
                  }
                >
                  <ListItemIcon>
                    <Badge
                      variant="dot"
                      invisible={hasSeenLastSeasonDialog}
                      color="info"
                    >
                      <CalendarMonthOutlined />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary="Last season" />
                </ListItemButton>
              </ListItem>
            )}
            <Divider component="li" />
            <ListItem disablePadding>
              <ListItemButton
                to="/info"
                component={RouterLink}
                onClick={() => notificationBadgesState.viewInfoPage()}
              >
                <ListItemIcon>
                  <Badge
                    variant="dot"
                    invisible={!notificationBadgesState.newInfo}
                    color="info"
                  >
                    <InfoOutlinedIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="League info" />
              </ListItemButton>
            </ListItem>
            <Divider component="li" />
            <ListItem disablePadding>
              <ListItemButton
                to="/rules"
                component={RouterLink}
                onClick={() =>
                  localStorage.setItem(LATEST_RULE_STORAGE_KEY, "true")
                }
              >
                <ListItemIcon>
                  <Badge
                    variant="dot"
                    invisible={hasSeenLatestRuleUpdate}
                    color="info"
                  >
                    <LiveHelpOutlinedIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="FAQs and rules" />
              </ListItemButton>
            </ListItem>
            <Divider component="li" />
            <ListItem disablePadding>
              <ListItemButton to="/profile" component={RouterLink}>
                <ListItemIcon>
                  <SettingsOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItemButton>
            </ListItem>
            <Divider component="li" />
            {isLeagueAdmin && (
              <ListItem disablePadding>
                <ListItemButton to="/league-admin" component={RouterLink}>
                  <ListItemIcon>
                    <AdminPanelSettingsOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="League Manager" />
                </ListItemButton>
              </ListItem>
            )}
            {wrappedEnabled && hasClickedWrapped && (
              <ListItem disablePadding>
                <ListItemButton
                  to={`/wrapped-2024/${player?.id ?? ""}`}
                  component={RouterLink}
                >
                  <ListItemIcon>
                    <CardGiftcardOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Review 2024 Wrapped" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
        <NewSeasonDialog
          onClose={() => {
            localStorage.setItem(NEW_SEASON_STORAGE_KEY, "true");
            setShowNewSeasonDialog(false);
          }}
          open={showNewSeasonDialog}
        />
        {Boolean(player) && <LocationUpdateSuggestion />}
      </Stack>
    </PageContainer>
  );
};
