import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useEffect, useState } from "react";
import { GameStatKeys } from "../../../types";

export const useGameIsIncomplete = (): boolean => {
  const [isIncomplete, setIsIncomplete] = useState(false);
  const game = useSelector((state: RootState) => state.game.currentGame);
  useEffect(() => {
    if (!game) {
      setIsIncomplete(true);
      return;
    }
    let completion = false;
    game.statsByPlayer.forEach((stat) => {
      const gameEndingStatTotal =
        (stat[GameStatKeys.winsBy8BallSink] ?? 0) +
        (stat[GameStatKeys.winsByOpponentScratch] ?? 0) +
        (stat[GameStatKeys.lossesBy8BallSink] ?? 0) +
        (stat[GameStatKeys.lossesByScratch] ?? 0);
      if (gameEndingStatTotal === 0) completion = true;
    });
    setIsIncomplete(completion);
  }, [game]);
  return isIncomplete;
};
