import { FC, useState } from "react";
import { PageContainer } from "../../shared-components/PageContainer";
import { Button, Stack, Typography } from "@mui/material";
import Slideshow from "./components/Slideshow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { usePlayerParams } from "../../shared-components/hooks/usePlayerParam";
import { FirstPage } from "./components/FirstPage";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";
import { handleShare } from "./wrappedUtils";
import { RoundupPage } from "./components/RoundupPage";

export const WrappedPage: FC = () => {
  const [page, setPage] = useState(0);
  const [buttonHidden, setButtonHidden] = useState(false);
  const { player, loading, playerGames } = usePlayerParams();
  const playerName = player?.name.split(" ")[0] ?? "";

  const handleNextClick = () => {
    setButtonHidden(true);
    setPage((prev) => prev + 1);
  };

  const revealButton = () => {
    setButtonHidden(false);
  };

  const pageProps = {
    page,
    playerGames,
    revealButton,
  };

  return (
    <PageContainer loading={loading}>
      {player ? (
        <Stack direction="column" sx={{ width: "100%", height: "100%" }}>
          {page === 0 && <Slideshow name={playerName} />}
          {page === 1 && <FirstPage player={player} {...pageProps} />}
          {page === 2 && <FirstPage player={player} {...pageProps} />}
          {page === 3 && <FirstPage player={player} {...pageProps} />}
          {page === 4 && <FirstPage player={player} {...pageProps} />}
          {page === 5 && <FirstPage player={player} {...pageProps} />}
          {page === 6 && <FirstPage player={player} {...pageProps} />}
          {page === 7 && <FirstPage player={player} {...pageProps} />}
          {page === 8 && <FirstPage player={player} {...pageProps} />}
          {page === 9 && <FirstPage player={player} {...pageProps} />}
          {page === 10 && (
            <RoundupPage player={player} playerGames={playerGames} />
          )}
          {page < 10 ? (
            <Button
              endIcon={<SkipNextIcon />}
              variant="contained"
              color={page === 0 ? "error" : "primary"}
              size="large"
              onClick={handleNextClick}
              sx={{
                position: "fixed",
                bottom: 10,
                right: 5,
                zIndex: 10,
                textAlign: "center",
                fontWeight: "bold",
                opacity: buttonHidden ? 0 : 1,
                transition: "opacity 0.2s",
                pointerEvents: buttonHidden ? "none" : "auto",
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
                bottom: 10,
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
