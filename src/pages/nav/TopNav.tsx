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
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import EightBallIcon from "../../shared-components/icons/EightBallIcon";

export const TopNav: FC = () => {
  const { title, showBackButton, hideButtons } = useTopNav();
  const {
    authState: { isAuthed },
  } = useAppContext();
  const navigate = useNavigate();
  const { gameIsInProgress } = useSelector((state: RootState) => state.game);
  const rightButton = isAuthed ? <ManageAccountsIcon /> : <AccountCircle />;
  return (
    <AppBar position="fixed">
      <Toolbar>
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
              } else {
                navigate("/");
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
        {gameIsInProgress && (
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
              invisible={window.location.pathname === "/live-game"}
            >
              <EightBallIcon color="white" />
            </Badge>
          </IconButton>
        )}
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          color="inherit"
          component={RouterLink}
          to="/profile"
        >
          {!hideButtons && rightButton}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
