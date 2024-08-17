import { Stack } from "@mui/material";
import { FC } from "react";
import { PageContainer } from "../../shared-components/PageContainer";
import { useGetWeeklyStandings } from "./hooks/useGetWeeklyStandings";
import { ScoreboardCard } from "./components/ScoreboardCard";

export const WeeklyStandingsPage: FC = () => {
  const { rankingsByWeek } = useGetWeeklyStandings();
  console.log(rankingsByWeek, "bruh");
  return (
    <PageContainer authedRoute>
      <Stack
        direction={"column"}
        sx={{ width: "100%", height: "100%", p: 1, overflow: "hidden" }}
        spacing={2}
      >
        {Object.keys(rankingsByWeek).map((key) => {
          return (
            <ScoreboardCard
              dateKey={key}
              key={key}
              rankings={rankingsByWeek[key]}
            />
          );
        })}
      </Stack>
    </PageContainer>
  );
};
