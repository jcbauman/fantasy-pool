import {
  Card,
  List,
  ListItem,
  ListSubheader,
  makeStyles,
  Stack,
} from "@mui/material";
import { FC, Fragment, useMemo, useState } from "react";
import {
  NAV_BAR_HEIGHT,
  PageContainer,
} from "../../shared-components/PageContainer";
import { useAppContext } from "../../context/AppContext";
import { MultiPlayerGameLog } from "./components.tsx/MultiPlayerGameLog";
import { sortGamesByDate } from "../../utils/gameUtils";
import { formatDateToMMDD } from "../../utils/statsUtils";
import { Game } from "../../types";
import { Theme } from "@emotion/react";

export const RecentGamesPage: FC = () => {
  const { games } = useAppContext();
  const dateSortedGames = useMemo(() => sortGamesByDate(games), [games]);
  const gamesGroupedByDate = groupByDate(dateSortedGames);

  return (
    <PageContainer authedRoute>
      <Stack
        direction="column"
        sx={{ width: "100%", height: "100%" }}
        spacing={2}
      >
        <List disablePadding>
          {Object.entries(gamesGroupedByDate).map(([date, items]) => {
            return (
              <Fragment key={`date-${date}`}>
                <ListSubheader
                  sx={{
                    position: "sticky",
                    top: NAV_BAR_HEIGHT,
                    my: 1,
                    elevation: 10,
                    boxShadow: 5,
                  }}
                >
                  {formatDateString(date)}
                </ListSubheader>
                {items.map((g) => {
                  return (
                    <ListItem sx={{ px: 1 }}>
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
    return dateStr;
  }
};
