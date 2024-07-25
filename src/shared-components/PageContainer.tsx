import { CircularProgress, Stack } from "@mui/material";
import { FC, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import NotificationLayer from "./NotificationLayer";
import { DesktopWarningDialog } from "./DesktopWarningDialog";

const NAV_BAR_HEIGHT = 56;

export const PageContainer: FC<{
  loading?: boolean;
  children: JSX.Element;
  authedRoute?: boolean;
}> = ({ loading, children, authedRoute }) => {
  const navigate = useNavigate();

  const {
    authState: { isAuthed },
  } = useAppContext();

  useEffect(() => {
    if (!isAuthed && authedRoute) navigate("/sign-in");
  }, [isAuthed, navigate, authedRoute]);

  return (
    <Stack
      direction="column"
      sx={{
        width: "100%",
        height: `calc(100% - ${NAV_BAR_HEIGHT}px)`,
        mt: `${NAV_BAR_HEIGHT}px`,
      }}
    >
      {loading ? (
        <Stack
          sx={{
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            flexShrink: 0,
          }}
        >
          <CircularProgress color="secondary" />
        </Stack>
      ) : (
        children
      )}
      <DesktopWarningDialog />
      <NotificationLayer />
    </Stack>
  );
};
