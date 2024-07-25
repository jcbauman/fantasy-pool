import { Divider, Stack, Typography } from "@mui/material";
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
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import SportsKabaddiOutlinedIcon from "@mui/icons-material/SportsKabaddiOutlined";
import { PageContainer } from "../../shared-components/PageContainer";
import { useAppContext } from "../../context/AppContext";
import { Link as RouterLink, useFetcher } from "react-router-dom";
import { useDispatch } from "react-redux";
import { sendSuccessNotificaton } from "../../redux/notificationSlice";

export const OverviewComponent: FC = () => {
  const { league } = useAppContext();
  const dispatch = useDispatch();

  const onClickBlockedField = (): void => {
    dispatch(
      sendSuccessNotificaton(
        "This tab will become available after a fantasy draft starts!"
      )
    );
  };

  return (
    <PageContainer authedRoute>
      <Stack direction="column" sx={{ width: "100%", height: "100%" }}>
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
            {league.name}
          </Typography>
        </Stack>
        <Box sx={{ width: "100%" }}>
          <List>
            <Divider component="li" />
            <ListItem disablePadding>
              <ListItemButton to="/live-game" component={RouterLink}>
                <ListItemIcon>
                  <SportsKabaddiOutlinedIcon />
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
                  <AccountBoxOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Players" />
              </ListItemButton>
            </ListItem>
            <Divider component="li" />
            <ListItem disablePadding>
              <ListItemButton onClick={onClickBlockedField}>
                <ListItemIcon>
                  <ScoreboardOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Scoreboard" />
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
              <ListItemButton to="/info" component={RouterLink}>
                <ListItemIcon>
                  <InfoOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="League info" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Stack>
    </PageContainer>
  );
};
