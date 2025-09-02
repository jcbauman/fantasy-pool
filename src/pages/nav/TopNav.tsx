import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { FC } from "react";
import { useTopNav } from "./hooks/useGetRouteName";
import { Badge } from "@mui/material";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import EightBallIcon from "../../shared-components/icons/EightBallIcon";
import { usePageTitle } from "../../shared-components/hooks/usePageTitle";
import { LiveHelp } from "@mui/icons-material";
import { fireAnalyticsEvent } from "../../shared-components/hooks/analytics";
import { PlayerAvatar } from "../../shared-components/PlayerAvatar";

export const TopNav: FC = () => {
  const { title, showBackButton, hideButtons } = useTopNav();
  usePageTitle(title);
  const location = useLocation();
  const {
    authState: { isAuthed, player },
  } = useAppContext();
  const navigate = useNavigate();
  const { gameIsInProgress } = useSelector((state: RootState) => state.game);
  const onGamePage = location.pathname === "/live-game";
  return (
    <AppBar position="fixed">
      <Toolbar>
        {!hideButtons && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => {
              if (showBackButton && window.history.length > 2) {
                window.history.back();
                fireAnalyticsEvent("TopNav_Clicked_BackButton");
              } else {
                navigate("/");
                fireAnalyticsEvent("TopNav_Clicked_MenuButton");
              }
            }}
          >
            {showBackButton && isAuthed ? (
              <ArrowBackIosOutlinedIcon />
            ) : (
              <MenuIcon />
            )}
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} noWrap>
          {title}
        </Typography>
        {gameIsInProgress && !onGamePage && (
          <IconButton
            size="large"
            aria-label="currentGame"
            aria-haspopup="true"
            color="inherit"
            to="/live-game"
            component={RouterLink}
          >
            <Badge
              color="secondary"
              variant="dot"
              invisible={location.pathname === "/live-game"}
            >
              <EightBallIcon color="white" />
            </Badge>
          </IconButton>
        )}
        {onGamePage && (
          <IconButton
            size="large"
            aria-label="faqs"
            aria-haspopup="true"
            color="inherit"
            to="/rules"
            component={RouterLink}
          >
            <LiveHelp />
          </IconButton>
        )}
        <IconButton
          size="small"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          color="inherit"
          component={RouterLink}
          to="/profile"
          sx={{ padding: "4px" }}
        >
          {player ? (
            <PlayerAvatar
              sx={{ width: 28, height: 28 }}
              player={player}
              {...{ component: RouterLink, to: "/profile" }}
            />
          ) : (
            <AccountCircle sx={{ fontSize: 20 }} />
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
