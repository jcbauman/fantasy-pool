import {
  Card,
  CircularProgress,
  List,
  ListItem,
  ListSubheader,
  Stack,
  Typography,
} from "@mui/material";
import { FC, Fragment, useMemo } from "react";
import {
  NAV_BAR_HEIGHT,
  PageContainer,
} from "../../shared-components/PageContainer";
import { MultiPlayerGameLog } from "./components.tsx/MultiPlayerGameLog";
import { Game } from "../../types";
import InfiniteScroll from "react-infinite-scroll-component";
import { useInfiniteFetchGames } from "./useInfiniteFetchGames";
import { formatDateToMMDD } from "../../utils/dateUtils";
import { useAppContext } from "../../context/AppContext";

export const RecentGamesPage: FC = () => {
  const { games, hasMore, loadGames, loading } = useInfiniteFetchGames();
  const gamesGroupedByDate = useMemo(() => groupByDate(games), [games]);

  return (
    <PageContainer authedRoute>
      <Stack
        direction="column"
        sx={{
          width: "100%",
          height: `calc(100vh - ${NAV_BAR_HEIGHT}px)`,
          overflow: "autos",
        }}
        spacing={2}
      >
        <InfiniteScroll
          dataLength={games.length}
          scrollThreshold={1}
          next={() => {
            if (!loading) loadGames();
          }}
          hasMore={hasMore}
          loader={
            <CircularProgress
              style={{
                display: "block",
                margin: "10px auto",
                color: "darkred",
              }}
            />
          }
          style={{ overflow: "visible" }}
          endMessage={
            <Typography
              variant="body2"
              align="center"
              style={{ margin: "10px 0" }}
            >
              No more games to load.
            </Typography>
          }
        >
          <List disablePadding>
            {Object.entries(gamesGroupedByDate).map(([date, items]) => {
              return (
                <Fragment key={`date-${date}`}>
                  <ListSubheader
                    sx={{
                      position: "sticky",
                      my: 1,
                      elevation: 10,
                      boxShadow: 5,
                      top: `${NAV_BAR_HEIGHT}px`,
                    }}
                  >
                    {formatDateString(date)}
                  </ListSubheader>
                  {items.map((g) => {
                    return (
                      <ListItem sx={{ px: 1 }} key={g.id}>
                        <Card key={g.id} sx={{ overflow: "auto" }}>
                          <MultiPlayerGameLog game={g} />
                        </Card>
                      </ListItem>
                    );
                  })}
                </Fragment>
              );
            })}
          </List>
        </InfiniteScroll>
      </Stack>
    </PageContainer>
  );
};

const groupByDate = (games: Game[]): Record<string, Game[]> => {
  return games.reduce((acc, game) => {
    const date = formatDateToMMDD(new Date(game.timestamp));
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(game);
    return acc;
  }, {} as Record<string, Game[]>);
};

const formatDateString = (dateStr: string): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const [month, day] = dateStr.split("/").map(Number);
  const date = new Date(today.getFullYear(), month - 1, day);

  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
  const isToday =
    today.getMonth() === date.getMonth() && today.getDate() === date.getDate();
  const isYesterday =
    yesterday.getMonth() === date.getMonth() &&
    yesterday.getDate() === date.getDate();

  if (isToday) {
    return "Today";
  } else if (isYesterday) {
    return "Yesterday";
  } else {
    return `${dateStr} - ${dayOfWeek}`;
  }
};
