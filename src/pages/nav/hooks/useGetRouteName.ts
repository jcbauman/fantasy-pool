import { matchPath, useLocation } from "react-router-dom";
import { mockPlayers } from "../../../backend/fixtures";

interface UseTopNav {
  title: string;
  showBackButton?: boolean;
}
export const useTopNav = (): UseTopNav => {
  const location = useLocation();

  const matchPlayerDetail = matchPath(
    { path: "/players/:id" },
    location.pathname
  );
  const params = matchPlayerDetail?.params as { id?: string };
  const player = mockPlayers.find((p) => p.id === params?.id);
  if (location.pathname.startsWith("/players")) {
    if (params?.id) {
      return { title: player?.name ?? "Player Detail", showBackButton: true };
    } else {
      return { title: "Players", showBackButton: true };
    }
  } else if (location.pathname === "/") return { title: "Fantasy Pool Home" };
  else if (location.pathname === "/info")
    return { title: "Info", showBackButton: true };
  else if (location.pathname === "/profile")
    return { title: "My Profile", showBackButton: true };
  else if (location.pathname === "/live-game") return { title: "Game Mode" };
  else return { title: "Fantasy Pool" };
};
