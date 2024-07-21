import "./App.css";
import { OverviewComponent } from "./pages/overview/OverviewPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PlayersPage } from "./pages/playersList/PlayersPage";
import { PlayerDetailPage } from "./pages/playerDetail/PlayerDetailPage";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";
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

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline>
            <AppContextProvider>
              <Router>
                <TopNav />
                <Routes>
                  <Route path="/" element={<OverviewComponent />} />
                  <Route path="/players" element={<PlayersPage />} />
                  <Route path="/players/:id" element={<PlayerDetailPage />} />
                  <Route path="/info" element={<LeagueInfoPage />} />
                  <Route path="/live-game" element={<LiveGameModePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/game-complete" element={<GameCompletePage />} />
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
