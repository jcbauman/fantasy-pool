import { FC, useState } from "react";
import { PageContainer } from "../../shared-components/PageContainer";
import { Button, Stack, Typography } from "@mui/material";
import Slideshow from "./components/Slideshow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { usePlayerParams } from "../../shared-components/hooks/usePlayerParam";
import { FirstPage } from "./components/FirstPage";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";
import { sendSuccessNotification } from "../../redux/notificationSlice";
import { useDispatch } from "react-redux";
import { handleShare } from "./wrappedUtils";
import { RoundupPage } from "./components/RoundupPage";

export const WrappedPage: FC = () => {
  const [page, setPage] = useState(0);
  const { player, loading, playerGames } = usePlayerParams();
  const dispatch = useDispatch();
  return (
    <PageContainer authedRoute loading={loading}>
      {player ? (
        <Stack direction="column" sx={{ width: "100%", height: "100%" }}>
          {page === 0 && <Slideshow />}
          {page === 1 && (
            <FirstPage player={player} page={page} playerGames={playerGames} />
          )}
          {page === 2 && (
            <FirstPage player={player} page={page} playerGames={playerGames} />
          )}
          {page === 3 && (
            <FirstPage player={player} page={page} playerGames={playerGames} />
          )}
          {page === 4 && (
            <FirstPage player={player} page={page} playerGames={playerGames} />
          )}
          {page === 5 && (
            <FirstPage player={player} page={page} playerGames={playerGames} />
          )}
          {page === 6 && (
            <FirstPage player={player} page={page} playerGames={playerGames} />
          )}
          {page === 7 && (
            <FirstPage player={player} page={page} playerGames={playerGames} />
          )}
          {page === 8 && (
            <FirstPage player={player} page={page} playerGames={playerGames} />
          )}
          {page === 9 && <RoundupPage player={player} />}
          {page < 9 ? (
            <Button
              endIcon={<SkipNextIcon />}
              variant="contained"
              color={page === 0 ? "error" : "primary"}
              size="large"
              onClick={() => setPage((prev) => prev + 1)}
              sx={{
                position: "fixed",
                bottom: 5,
                right: 5,
                zIndex: 10,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Next
            </Button>
          ) : (
            <Button
              startIcon={<IosShareOutlinedIcon />}
              variant="contained"
              color="primary"
              size="large"
              onClick={() =>
                handleShare("Check out my Fantasy Pool 2024 Wrapped")
              }
              sx={{
                position: "fixed",
                bottom: 5,
                right: 5,
                zIndex: 10,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Share
            </Button>
          )}
        </Stack>
      ) : (
        <Typography>This is not a real wrapped, return to home.</Typography>
      )}
    </PageContainer>
  );
};
