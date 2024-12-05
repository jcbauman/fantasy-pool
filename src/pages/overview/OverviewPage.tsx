import { Badge, Button, Divider, Stack, Typography } from "@mui/material";
import { FC } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ScoreboardOutlinedIcon from "@mui/icons-material/ScoreboardOutlined";
import LeaderboardOutlinedIcon from "@mui/icons-material/LeaderboardOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LiveHelpOutlinedIcon from "@mui/icons-material/LiveHelpOutlined";
import { PageContainer } from "../../shared-components/PageContainer";
import { useAppContext } from "../../context/AppContext";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { sendSuccessNotification } from "../../redux/notificationSlice";
import EightBallIcon from "../../shared-components/icons/EightBallIcon";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import { WrappedOverviewButton } from "../statsWrapped/components/WrappedOverviewButton";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";

const WRAPPED_STORAGE_KEY = "2024_wrapped_storage_keyy";

export const OverviewComponent: FC = () => {
  const {
    league,
    authState: { player, user },
    notificationBadgesState,
  } = useAppContext();
  const dispatch = useDispatch();

  const onClickBlockedField = (): void => {
    dispatch(
      sendSuccessNotification(
        "This tab will become available after a fantasy draft starts!"
      )
    );
  };
  const hasClickedWrapped = Boolean(localStorage.getItem(WRAPPED_STORAGE_KEY));
  const wrappedEnabled = user?.isAppAdmin || league?.release2024Wrapped;

  return (
    <PageContainer authedRoute>
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
            p: 2,
          }}
        >
          <Typography variant="overline" lineHeight={0.5}>
            <strong>League</strong>
          </Typography>
          <Typography variant="overline" fontSize={16}>
            {league?.name}
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
                  <GroupOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Players" />
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
              <ListItemButton onClick={onClickBlockedField}>
                <ListItemIcon>
                  <LeaderboardOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Standings" />
              </ListItemButton>
            </ListItem>
            <Divider component="li" />
            <ListItem disablePadding>
              <ListItemButton onClick={onClickBlockedField}>
                <ListItemIcon>
                  <EventNoteOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Schedule" />
              </ListItemButton>
            </ListItem>
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
              <ListItemButton to="/rules" component={RouterLink}>
                <ListItemIcon>
                  <LiveHelpOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="FAQs and Rules" />
              </ListItemButton>
            </ListItem>
            <Divider component="li" />
            {wrappedEnabled && hasClickedWrapped && (
              <ListItem disablePadding>
                <ListItemButton
                  to={`/wrapped-2024/${player?.id ?? ""}`}
                  component={RouterLink}
                >
                  <ListItemIcon>
                    <CardGiftcardOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Review 2024 wrapped" />
                </ListItemButton>
              </ListItem>
            )}
            <ListItem disablePadding>
              <ListItemButton
                to={`/wrapped-2024/Fwonnaprz0okB0HIYUje`}
                component={RouterLink}
              >
                <ListItemIcon>
                  <CardGiftcardOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="zayn Wrapped (remove)" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                to={`/wrapped-2024/sgBzBphKFqF3zA0c1rJl`}
                component={RouterLink}
              >
                <ListItemIcon>
                  <CardGiftcardOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="amira Wrapped (remove)" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                to={`/wrapped-2024/x5QiXK4bh88GTIoflUoZ`}
                component={RouterLink}
              >
                <ListItemIcon>
                  <CardGiftcardOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="vinod Wrapped (remove)" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Stack>
    </PageContainer>
  );
};
