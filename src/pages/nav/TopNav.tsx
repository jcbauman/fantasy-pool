import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { FC } from "react";
import { useTopNav } from "./hooks/useGetRouteName";
import { Badge, Button, Stack } from "@mui/material";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import EightBallIcon from "../../shared-components/icons/EightBallIcon";
import { usePageTitle } from "../../shared-components/hooks/usePageTitle";
import { LiveHelp } from "@mui/icons-material";
import { fireAnalyticsEvent } from "../../shared-components/hooks/analytics";

export const TopNav: FC = () => {
  const { title, showBackButton, hideButtons, showSignInButton } = useTopNav();
  usePageTitle(title);
  const location = useLocation();
  const {
    authState: { isAuthed },
  } = useAppContext();
  const navigate = useNavigate();
  const { gameIsInProgress } = useSelector((state: RootState) => state.game);
  const onGamePage = location.pathname === "/live-game";
  return (
    <AppBar position="fixed">
      <Toolbar>
        {showSignInButton && (
          <Stack sx={{ mr: 1 }}>
            <EightBallIcon color="white" />
          </Stack>
        )}
        {!hideButtons && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => {
              if (showBackButton && window.history.length > 2) {
                window.history.back();
                fireAnalyticsEvent("TopNav_Clicked_BackButton");
              } else {
                navigate("/home");
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
        {!hideButtons && (
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
            component={RouterLink}
            to="/profile"
          >
            <AccountCircle />
          </IconButton>
        )}
        {showSignInButton && (
          <Button
            color="secondary"
            // sx={{ background: "secondary", color: "black" }}
            variant="contained"
            component={RouterLink}
            to="/sign-in"
          >
            {isAuthed ? "Home" : "Login"}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};
