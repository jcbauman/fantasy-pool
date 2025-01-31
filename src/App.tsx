import "./App.css";
import { OverviewComponent } from "./pages/overview/OverviewPage";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { PlayersPage } from "./pages/playersList/PlayersPage";
import { PlayerDetailPage } from "./pages/playerDetail/PlayerDetailPage";
import { ThemeProvider } from "@emotion/react";
import { getTheme } from "./theme";
import { CssBaseline } from "@mui/material";
import { TopNav } from "./pages/nav/TopNav";
import { LeagueInfoPage } from "./pages/info/LeagueInfoPage";
import { LiveGameModePage } from "./pages/live-game/LiveGameModePage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { GameCompletePage } from "./pages/game-complete/GameCompletePage";
import { AppContextProvider } from "./context/AppContext";
import { SignInPage } from "./pages/profile/SignInPage";
import { CreatePlayerPage } from "./pages/profile/CreatePlayerPage";
import { AppAdminPage } from "./pages/app-admin/AppAdminPage";
import { RecentGamesPage } from "./pages/games/RecentGamesPage";
import { LeagueAdminPage } from "./pages/league-admin/LeagueAdminPage";
import { RulesPage } from "./pages/rules/RulesPage";
import { WrappedPage } from "./pages/statsWrapped/WrappedPage";
import useStandaloneMode from "./shared-components/hooks/useStandaloneMode";
import { LocationsPage } from "./pages/locations/LocationsPage";

function App() {
  const isStandalone = useStandaloneMode();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={getTheme(isStandalone)}>
          <CssBaseline>
            <AppContextProvider>
              <Router>
                <TopNav />
                <Routes>
                  <Route path="/" element={<OverviewComponent />} />
                  <Route path="/players" element={<PlayersPage />} />
                  <Route path="/players/:id" element={<PlayerDetailPage />} />
                  <Route path="/locations" element={<LocationsPage />} />
                  <Route path="/info" element={<LeagueInfoPage />} />
                  <Route path="/live-game" element={<LiveGameModePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/sign-in" element={<SignInPage />} />
                  <Route path="/game-complete" element={<GameCompletePage />} />
                  <Route path="/create-player" element={<CreatePlayerPage />} />
                  <Route path="/app-admin" element={<AppAdminPage />} />
                  <Route path="/games" element={<RecentGamesPage />} />
                  <Route path="/league-admin" element={<LeagueAdminPage />} />
                  <Route path="/rules" element={<RulesPage />} />
                  <Route path="/wrapped-2024/:id" element={<WrappedPage />} />
                  <Route path="*" element={<OverviewComponent />} />
                </Routes>
              </Router>
            </AppContextProvider>
          </CssBaseline>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
