import { Card, List, ListItem, ListSubheader, Stack } from "@mui/material";
import { FC, Fragment, useMemo } from "react";
import {
  NAV_BAR_HEIGHT,
  PageContainer,
} from "../../shared-components/PageContainer";
import { useAppContext } from "../../context/AppContext";
import { MultiPlayerGameLog } from "./components.tsx/MultiPlayerGameLog";
import { sortSessionsByDate } from "../../utils/gameUtils";
import { formatDateToMMDD } from "../../utils/statsUtils";
import { Session } from "../../types";
import { MultiPlayerSessionLog } from "./components.tsx/MultiPlayerSessionLog";

export const RecentSessionsPage: FC = () => {
  const { sessions } = useAppContext();
  const dateSortedSessions = useMemo(
    () => sortSessionsByDate(sessions),
    [sessions]
  );
  const sessionsGroupedByDate = groupSessionsByDate(dateSortedSessions);

  return (
    <PageContainer authedRoute>
      <Stack
        direction="column"
        sx={{ width: "100%", height: "100%" }}
        spacing={2}
      >
        <List disablePadding>
          {Object.entries(sessionsGroupedByDate).map(([date, items]) => {
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
                {items.map((s) => {
                  return (
                    <ListItem sx={{ px: 1 }} key={s.id}>
                      <Card
                        sx={{
                          overflow: "auto",
                          ".MuiCollapse-root": {
                            backgroundImage: "none!important",
                          },
                        }}
                      >
                        <MultiPlayerSessionLog session={s} />
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

const groupSessionsByDate = (
  sessions: Session[]
): Record<string, Session[]> => {
  return sessions.reduce((acc, session) => {
    const date = formatDateToMMDD(new Date(session.timestamp));
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {} as Record<string, Session[]>);
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
