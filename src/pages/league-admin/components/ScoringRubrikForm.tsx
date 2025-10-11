import { Button, Card, Stack, TextField, Typography } from "@mui/material";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { GameStatKeys, League } from "../../../types";
import { mockScoringMatrix } from "../../../backend/fixtures";
import { getStringFromStatKey } from "../../../utils/statsUtils";
import { updateLeague } from "../../../backend/endpoints/league";
import { sendSuccessNotification } from "../../../shared-components/toasts/notificationToasts";

type FormData = {
  [GameStatKeys.winsBy8BallSink]: number;
  [GameStatKeys.winsByOpponentScratch]: number;
  [GameStatKeys.lossesBy8BallSink]: number;
  [GameStatKeys.lossesByScratch]: number;
  [GameStatKeys.scratches]: number;
  [GameStatKeys.skillShots]: number;
  [GameStatKeys.threeBallsPocketedInRow]: number;
  [GameStatKeys.fourBallsPocketedInRow]: number;
  [GameStatKeys.fiveBallsPocketedInRow]: number;
  [GameStatKeys.sixBallsPocketedInRow]: number;
  [GameStatKeys.sevenBallsPocketedInRow]: number;
  [GameStatKeys.runTheTable]: number;
};

interface ScoringRubrikFormProps {
  league: League;
}
export const ScoringRubrikForm: FC<ScoringRubrikFormProps> = ({ league }) => {
  const { scoringMatrix } = league;
  const { handleSubmit, register, watch } = useForm<FormData>({
    defaultValues: {
      [GameStatKeys.winsBy8BallSink]:
        scoringMatrix?.[GameStatKeys.winsBy8BallSink] ??
        mockScoringMatrix[GameStatKeys.winsBy8BallSink],
      [GameStatKeys.winsByOpponentScratch]:
        scoringMatrix?.[GameStatKeys.winsByOpponentScratch] ??
        mockScoringMatrix[GameStatKeys.winsByOpponentScratch],
      [GameStatKeys.lossesBy8BallSink]:
        scoringMatrix?.[GameStatKeys.lossesBy8BallSink] ??
        mockScoringMatrix[GameStatKeys.lossesBy8BallSink],
      [GameStatKeys.lossesByScratch]:
        scoringMatrix?.[GameStatKeys.lossesByScratch] ??
        mockScoringMatrix[GameStatKeys.lossesByScratch],
      [GameStatKeys.scratches]:
        scoringMatrix?.[GameStatKeys.scratches] ??
        mockScoringMatrix[GameStatKeys.scratches],
      [GameStatKeys.skillShots]:
        scoringMatrix?.[GameStatKeys.skillShots] ??
        mockScoringMatrix[GameStatKeys.skillShots],
      [GameStatKeys.threeBallsPocketedInRow]:
        scoringMatrix?.[GameStatKeys.threeBallsPocketedInRow] ??
        mockScoringMatrix[GameStatKeys.threeBallsPocketedInRow],
      [GameStatKeys.fourBallsPocketedInRow]:
        scoringMatrix?.[GameStatKeys.fourBallsPocketedInRow] ??
        mockScoringMatrix[GameStatKeys.fourBallsPocketedInRow],
      [GameStatKeys.fiveBallsPocketedInRow]:
        scoringMatrix?.[GameStatKeys.fiveBallsPocketedInRow] ??
        mockScoringMatrix[GameStatKeys.fiveBallsPocketedInRow],
      [GameStatKeys.sixBallsPocketedInRow]:
        scoringMatrix?.[GameStatKeys.sixBallsPocketedInRow] ??
        mockScoringMatrix[GameStatKeys.sixBallsPocketedInRow],
      [GameStatKeys.sevenBallsPocketedInRow]:
        scoringMatrix?.[GameStatKeys.sevenBallsPocketedInRow] ??
        mockScoringMatrix[GameStatKeys.sevenBallsPocketedInRow],
      [GameStatKeys.runTheTable]:
        scoringMatrix?.[GameStatKeys.runTheTable] ??
        mockScoringMatrix[GameStatKeys.runTheTable],
    },
  });
  const watchAll = watch();
  const onSubmit = async (data: FormData): Promise<void> => {
    const resolvedLeague: League = {
      ...league,
      scoringMatrix: data,
    };
    const { id, ...leagueNoId } = resolvedLeague;
    await updateLeague(leagueNoId, league.id, () =>
      sendSuccessNotification("Scoring rubrik updated")
    );
  };

  return (
    <Card sx={{ p: 1 }}>
      <Typography variant="overline">League fantasy scoring</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" gap={2} sx={{ p: 1 }}>
          {Object.keys(watchAll).map((key) => {
            const resolvedKey = key as keyof typeof watchAll;
            return (
              <TextField
                size="small"
                key={resolvedKey}
                type="number"
                placeholder={`Default score: ${mockScoringMatrix[resolvedKey]}`}
                label={getStringFromStatKey(resolvedKey)}
                defaultValue={watchAll[resolvedKey]}
                {...register(resolvedKey, { required: "Field is required" })}
              />
            );
          })}

          <Button type="submit" variant="contained">
            Update scoring
          </Button>
        </Stack>
      </form>
    </Card>
  );
};
