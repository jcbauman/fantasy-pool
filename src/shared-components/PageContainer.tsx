import { CircularProgress, Stack } from "@mui/material";
import { FC, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import NotificationLayer from "./NotificationLayer";
import { DesktopWarningDialog } from "./DesktopWarningDialog";

export const NAV_BAR_HEIGHT = 56;

export const PageContainer: FC<{
  loading?: boolean;
  children: JSX.Element;
  authedRoute?: boolean;
  isUnauthedRoute?: boolean; //kick off page if authed
}> = ({ loading, children, authedRoute, isUnauthedRoute }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    authState: { isAuthed },
  } = useAppContext();

  useEffect(() => {
    if (!isAuthed && authedRoute) {
      const searchParams = new URLSearchParams(location.search);
      navigate({ pathname: "/sign-in", search: searchParams.toString() });
    }
  }, [isAuthed, navigate, authedRoute, location.search]);

  useEffect(() => {
    if (isAuthed && isUnauthedRoute) {
      const searchParams = new URLSearchParams(location.search);
      navigate({ pathname: "/", search: searchParams.toString() });
    }
  }, [isAuthed, navigate, isUnauthedRoute, location.search]);

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
          <CircularProgress color="secondary" sx={{ my: "auto" }} />
        </Stack>
      ) : (
        children
      )}
      <DesktopWarningDialog />
      <NotificationLayer />
    </Stack>
  );
};
