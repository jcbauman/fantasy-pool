import { Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { GameStartForm } from "./components/GameStartForm";
import { PageContainer } from "../../shared-components/PageContainer";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { GameInterface } from "./components/GameInterface";
import { InfoDialog } from "./components/InfoDialog";

const INFO_MODAL_STORAGE_KEY = "gameInfoModalStoragekey";

export const LiveGameModePage: FC = () => {
  const { gameIsInProgress } = useSelector((state: RootState) => state.game);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  useEffect(() => {
    const hasSeenModal = localStorage.getItem(INFO_MODAL_STORAGE_KEY);
    if (!hasSeenModal) {
      setShowInfoDialog(true);
    }
  }, []);

  useEffect(() => {
    if (gameIsInProgress) {
      try {
        const audio = new Audio("/ball-release-sound.mp3");
        audio.play();
      } catch (e) {
        console.error("Could not play sound effect");
      }
    }
  }, [gameIsInProgress]);
  return (
    <PageContainer authedRoute>
      <Stack direction="column" sx={{ width: "100%", height: "100%", p: 1 }}>
        {gameIsInProgress ? (
          <GameInterface />
        ) : (
          <GameStartForm setShowInfoDialog={setShowInfoDialog} />
        )}
        <InfoDialog
          open={showInfoDialog}
          onClose={() => {
            localStorage.setItem(INFO_MODAL_STORAGE_KEY, "true");
            setShowInfoDialog(false);
          }}
        />
      </Stack>
    </PageContainer>
  );
};
