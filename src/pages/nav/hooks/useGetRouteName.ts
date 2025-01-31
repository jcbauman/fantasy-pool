import { matchPath, useLocation } from "react-router-dom";
import { useAppContext } from "../../../context/AppContext";

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
  const matchLocationDetail = matchPath(
    { path: "/locations/:id" },
    location.pathname
  );
  const playerParams = matchPlayerDetail?.params as { id?: string };
  const locationParams = matchLocationDetail?.params as { id?: string };
  const player = players.find((p) => p.id === playerParams?.id);
  if (location.pathname.startsWith("/players")) {
    if (playerParams?.id) {
      return { title: player?.name ?? "Player Detail", showBackButton: true };
    } else {
      return { title: "Players", showBackButton: true };
    }
  } else if (location.pathname.startsWith("/locations")) {
    if (locationParams?.id) {
      return { title: "Location Detail", showBackButton: true };
    } else {
      return { title: "Pool halls", showBackButton: true };
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
  else if (location.pathname.startsWith("/wrapped-2024"))
    return { title: "2024 Wrapped" };
  else return { title: "Fantasy Pool" };
};
