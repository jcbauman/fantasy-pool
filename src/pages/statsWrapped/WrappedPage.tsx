import { FC, useState } from "react";
import { PageContainer } from "../../shared-components/PageContainer";
import { Button, Stack, Typography } from "@mui/material";
import Slideshow from "./components/Slideshow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { usePlayerParams } from "../../shared-components/hooks/usePlayerParam";
import { FirstPage } from "./components/FirstPage";

export const WrappedPage: FC = () => {
  const [page, setPage] = useState(0);
  const { player, loading, playerGames } = usePlayerParams();
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
          <Button
            endIcon={<SkipNextIcon />}
            variant="contained"
            color="error"
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
        </Stack>
      ) : (
        <Typography>This is not a real wrapped, return to home.</Typography>
      )}
    </PageContainer>
  );
};
