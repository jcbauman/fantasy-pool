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

interface OverviewComponentProps {
  leagueName: string;
}

export const OverviewComponent: FC<OverviewComponentProps> = ({
  leagueName,
}) => {
  return (
    <PageContainer>
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
            {leagueName}
          </Typography>
        </Stack>
        <Box sx={{ width: "100%" }}>
          <List>
            <Divider component="li" />
            <ListItem disablePadding>
              <ListItemButton href="/live-game">
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
              <ListItemButton href="/players">
                <ListItemIcon>
                  <AccountBoxOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Players" />
              </ListItemButton>
            </ListItem>
            <Divider component="li" />
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <ScoreboardOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Scoreboard" />
              </ListItemButton>
            </ListItem>
            <Divider component="li" />
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <LeaderboardOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Standings" />
              </ListItemButton>
            </ListItem>
            <Divider component="li" />
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <EventNoteOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Schedule" />
              </ListItemButton>
            </ListItem>
            <Divider component="li" />
            <ListItem disablePadding>
              <ListItemButton href="/info">
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
