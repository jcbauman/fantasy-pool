import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import React, { FC, useEffect } from "react";
import { useTopNav } from "./hooks/useGetRouteName";
import { useAuthState } from "../../auth/useAuthState";
import { Avatar, Badge } from "@mui/material";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Link as RouterLink, useNavigate } from "react-router-dom";

export const TopNav: FC = () => {
  const { title, showBackButton } = useTopNav();
  const { isAuthed } = useAuthState();
  const navigate = useNavigate();
  const { gameIsInProgress } = useSelector((state: RootState) => state.game);
  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => {
            if (showBackButton) {
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
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
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
              <SportsKabaddiIcon />
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
          {isAuthed ? <ManageAccountsIcon /> : <AccountCircle />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
