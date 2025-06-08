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
import { NotificationProvider } from "./shared-components/toasts/NotificationProvider";
import { LastSeasonPage } from "./pages/last-season/LastSeasonPage";
import { EditGameModePage } from "./pages/edit-game/EditGamePage";
import { ForgotPasswordPage } from "./pages/forgot-password/ForgotPasswordPage";

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
                <NotificationProvider>
                  <Routes>
                    <Route path="/" element={<OverviewComponent />} />
                    <Route path="/players" element={<PlayersPage />} />
                    <Route path="/players/:id" element={<PlayerDetailPage />} />
                    <Route
                      path="/edit-game/:id"
                      element={<EditGameModePage />}
                    />
                    <Route path="/info" element={<LeagueInfoPage />} />
                    <Route path="/live-game" element={<LiveGameModePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/sign-in" element={<SignInPage />} />
                    <Route path="/last-season" element={<LastSeasonPage />} />
                    <Route
                      path="/game-complete"
                      element={<GameCompletePage />}
                    />
                    <Route
                      path="/create-player"
                      element={<CreatePlayerPage />}
                    />
                    <Route path="/app-admin" element={<AppAdminPage />} />
                    <Route path="/games" element={<RecentGamesPage />} />
                    <Route path="/league-admin" element={<LeagueAdminPage />} />
                    <Route path="/rules" element={<RulesPage />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPasswordPage />}
                    />
                    <Route path="/wrapped-2024/:id" element={<WrappedPage />} />
                    <Route path="*" element={<OverviewComponent />} />
                  </Routes>
                </NotificationProvider>
              </Router>
            </AppContextProvider>
          </CssBaseline>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
