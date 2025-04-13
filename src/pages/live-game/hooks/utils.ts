import { sendSuccessNotification } from "../../../shared-components/toasts/notificationToasts";
import { GameStatKeys } from "../../../types";
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
