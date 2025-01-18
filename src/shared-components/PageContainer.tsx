import { Stack } from "@mui/material";
import { FC, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import NotificationLayer from "./NotificationLayer";
import { DesktopWarningDialog } from "./DesktopWarningDialog";
import { Loader } from "./Loader";

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
    authState: { isAuthed, authLoading },
  } = useAppContext();

  useEffect(() => {
    if (!isAuthed && authedRoute && !authLoading) {
      const searchParams = new URLSearchParams(location.search);
      navigate({ pathname: "/sign-in", search: searchParams.toString() });
    }
  }, [isAuthed, navigate, authedRoute, location.search, authLoading]);

  useEffect(() => {
    if (isAuthed && isUnauthedRoute && !authLoading) {
      const searchParams = new URLSearchParams(location.search);
      navigate({ pathname: "/", search: searchParams.toString() });
    }
  }, [isAuthed, navigate, isUnauthedRoute, location.search, authLoading]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <Stack
      direction="column"
      sx={{
        width: "100%",
        height: `calc(100vh - ${NAV_BAR_HEIGHT}px)`,
        mt: `${NAV_BAR_HEIGHT}px`,
      }}
    >
      {loading || authLoading ? (
        <Stack
          sx={{
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            flexShrink: 0,
          }}
        >
          <Loader />
        </Stack>
      ) : (
        children
      )}
      <DesktopWarningDialog />
      <NotificationLayer />
    </Stack>
  );
};
