import { matchPath, useLocation } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";
import { getSeasonString, getThreeMonthsAgo } from "../../../utils/dateUtils";

interface UseTopNav {
  title: string;
  showBackButton?: boolean;
  hideButtons?: boolean;
}
export const useTopNav = (): UseTopNav => {
  const location = useLocation();
  const { players } = useAppContext();
  const matchPlayerDetail = matchPath(
    { path: "/players/:id" },
    location.pathname
  );
  const params = matchPlayerDetail?.params as { id?: string };
  const player = players.find((p) => p.id === params?.id);
  if (location.pathname.startsWith("/players")) {
    if (params?.id) {
      return {
        title: player
          ? player.firstName + " " + player.lastName
          : "Player Detail",
        showBackButton: true,
      };
    } else {
      return { title: "Players", showBackButton: true };
    }
  } else if (location.pathname === "/") return { title: "Fantasy Pool Home" };
  else if (location.pathname === "/info")
    return { title: "Info", showBackButton: true };
  else if (location.pathname === "/profile")
    return { title: "Settings", showBackButton: true };
  else if (location.pathname === "/live-game") return { title: "Game Mode" };
  else if (location.pathname === "/create-player")
    return { title: "Configure your player", hideButtons: true };
  else if (location.pathname === "/app-admin")
    return { title: "App admin", showBackButton: true };
  else if (location.pathname === "/league-admin")
    return { title: "League manager", showBackButton: true };
  else if (location.pathname === "/games")
    return { title: "Recent games", showBackButton: true };
  else if (location.pathname === "/rules")
    return { title: "FAQs and Rules", showBackButton: true };
  else if (location.pathname === "/game-complete") return { title: "Summary" };
  else if (location.pathname.startsWith("/wrapped-2025"))
    return { title: "2025 Wrapped" };
  else if (location.pathname.startsWith("/edit-game")) {
    return { title: "Edit game", showBackButton: true };
  } else if (location.pathname.startsWith("/last-season"))
    return {
      title: `${getSeasonString(getThreeMonthsAgo())} season`,
      showBackButton: true,
    };
  else if (location.pathname === "/forgot-password")
    return { title: "Reset password" };
  else return { title: "Fantasy Pool" };
};
