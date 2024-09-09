import { useEffect, useMemo, useState } from "react";
import { Game, League } from "../../types";
import { sortGamesByDate } from "../../utils/gameUtils";

export interface NotificationBadgesState {
  newGame: boolean;
  newInfo: boolean;
  recheckNotifications: () => void;
  viewGamesPage: () => void;
  viewInfoPage: () => void;
}

const LAST_GAME_CHECKED_DATE_KEY = "lastGameCheckedDateKey"; //stores last time checked Recent games page
const LAST_INFO_CHECKED_CONTENT_KEY = "lastInfoCheckedContentKey"; //stores last league manager message

export const useNotificationBadges = (
  games: Game[],
  league: League | undefined
): NotificationBadgesState => {
  const [newGame, setNewGame] = useState(false);
  const [newInfo, setNewInfo] = useState(false);
  const [shouldRecheckNotifications, setShouldRecheckNotifications] =
    useState(true);

  const dateSortedGames = useMemo(() => sortGamesByDate(games), [games]);
  const currentLeagueMessage = league?.leagueManagerMessage;

  useEffect(() => {
    if (shouldRecheckNotifications) {
      const lastGameCheckedValue = localStorage.getItem(
        LAST_GAME_CHECKED_DATE_KEY
      );
      const lastGameCheckedTime = lastGameCheckedValue
        ? new Date(lastGameCheckedValue)
        : undefined;

      const lastLeagueManagerMessage = localStorage.getItem(
        LAST_INFO_CHECKED_CONTENT_KEY
      );
      setNewInfo(
        Boolean(currentLeagueMessage) &&
          currentLeagueMessage !== lastLeagueManagerMessage
      );

      const lastGameDate =
        dateSortedGames.length > 0
          ? new Date(dateSortedGames[0]?.timestamp)
          : undefined;
      if (lastGameDate) {
        if (!lastGameCheckedTime) {
          setNewGame(true);
        } else {
          setNewGame(lastGameDate > lastGameCheckedTime);
        }
      }
      setShouldRecheckNotifications(false);
    }
  }, [dateSortedGames, currentLeagueMessage, shouldRecheckNotifications]);

  useEffect(() => {
    setShouldRecheckNotifications(true);
  }, [dateSortedGames]);

  const viewGamesPage = (): void => {
    localStorage.setItem(LAST_GAME_CHECKED_DATE_KEY, new Date().toISOString());
    setShouldRecheckNotifications(true);
  };

  const viewInfoPage = (): void => {
    localStorage.setItem(
      LAST_INFO_CHECKED_CONTENT_KEY,
      league?.leagueManagerMessage ?? ""
    );
    setShouldRecheckNotifications(true);
  };

  return {
    newGame,
    newInfo,
    recheckNotifications: () => setShouldRecheckNotifications(true),
    viewGamesPage,
    viewInfoPage,
  };
};
