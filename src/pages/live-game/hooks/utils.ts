import { sendSuccessNotification } from "../../../shared-components/toasts/notificationToasts";
import { GameStat, GameStatKeys } from "../../../types";
import { getSingularStringFromScratchKey } from "../../../utils/statsUtils";

export const sendIterationNotificationMessage = (
  playerName: string,
  stat: GameStatKeys,
  delta: number
): void => {
  const statString = getSingularStringFromScratchKey(stat);
  const message =
    delta > 0
      ? `${playerName} ${
          stat === GameStatKeys.scratches ? "suffered" : "scored"
        } a ${statString}!`
      : `Removed a ${statString} from ${playerName}`;
  sendSuccessNotification(message);
};

export const findMultiBallStat = (
  currentPlayerGameStats: GameStat
): GameStatKeys | undefined => {
  const multiballStats = [
    GameStatKeys.threeBallsPocketedInRow,
    GameStatKeys.fourBallsPocketedInRow,
    GameStatKeys.fiveBallsPocketedInRow,
    GameStatKeys.sixBallsPocketedInRow,
    GameStatKeys.sevenBallsPocketedInRow,
    GameStatKeys.runTheTable,
  ];
  return multiballStats.find(
    (stat) =>
      Boolean(currentPlayerGameStats?.[stat]) &&
      (currentPlayerGameStats?.[stat] ?? 0) > 0
  );
};
