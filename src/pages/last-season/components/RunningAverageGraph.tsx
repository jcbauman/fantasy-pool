import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Game } from "../../../types";
import { FC } from "react";
import { getFantasyScoreForPlayerSeason } from "../../../utils/statsUtils";
import { useAppContext } from "../../../context/AppContext";
import { Box } from "@mui/material";

export const RunningAverageGraph: FC<{
  playerId: string;
  playerGames: Game[];
}> = ({ playerGames, playerId }) => {
  const { scoringMatrix } = useAppContext();
  const computeRunningAverage = (
    games: { timestamp: string; delta: number }[]
  ) => {
    // Convert timestamps from strings to numbers and sort by date
    const sortedGames = [...games]
      .map((game) => ({
        timestamp: new Date(game.timestamp).getTime(),
        delta: game.delta,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);

    let cumulativeSum = 0;
    let count = 0;
    const startTime = sortedGames.length > 0 ? sortedGames[0].timestamp : 0;

    return sortedGames.map((game) => {
      count += 1;
      cumulativeSum += game.delta;

      return {
        time:
          Math.ceil((game.timestamp - startTime) / (7 * 24 * 60 * 60 * 1000)) +
          1, // Calculate week number
        value: cumulativeSum / count, // Running average
      };
    });
  };

  const deltas = playerGames.map((game) => {
    return {
      timestamp: game.timestamp,
      delta: getFantasyScoreForPlayerSeason([game], playerId, scoringMatrix),
    };
  });

  const data = computeRunningAverage(deltas);
  return (
    <Box sx={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis
            dataKey="time"
            tickFormatter={(time) => Math.floor(time / 7).toString()}
            interval={6}
            label={{ value: "Week", position: "insideBottom", dy: 10 }}
          />
          <YAxis
            label={{
              value: "Fantasy avg",
              angle: -90,
              position: "insideLeft",
              dy: 30,
            }}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <ReferenceLine y={0} stroke="white" strokeWidth={1} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8B0000"
            strokeWidth={4}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
