import { FC } from "react";
import { PageContainer } from "../../shared-components/PageContainer";
import { Button, Card, Stack, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useDispatch } from "react-redux";
import { sendSuccessNotification } from "../../redux/notificationSlice";
import { useForm } from "react-hook-form";
import { League } from "../../types";
import { updateLeague } from "../../backend/setters";
import { ScoringRubrikForm } from "./components/ScoringRubrikForm";

type FormData = {
  leagueName: string;
  leagueManagerMessage?: string;
};

export const LeagueAdminPage: FC = () => {
  const {
    league,
    authState: { user },
  } = useAppContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  if (!user || !league || league.leagueManagerId !== user.id) {
    navigate("/profile");
  }

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      leagueName: league?.name ?? "",
      leagueManagerMessage: league?.leagueManagerMessage ?? "",
    },
  });

  const onSubmit = async (data: FormData): Promise<void> => {
    if (league) {
      const resolvedLeague: League = {
        ...league,
        name: data.leagueName,
        leagueManagerMessage: data.leagueManagerMessage,
      };
      const { id, ...leagueNoId } = resolvedLeague;
      await updateLeague(leagueNoId, league.id, () =>
        dispatch(sendSuccessNotification("League settings updated"))
      );
    }
  };
  if (!league) {
    return (
      <PageContainer authedRoute>
        <Typography variant="overline">No league to show</Typography>
      </PageContainer>
    );
  }
  return (
    <PageContainer authedRoute>
      <Stack direction="column" spacing={2} sx={{ p: 2 }}>
        <Card sx={{ p: 1 }}>
          <Typography variant="overline">League settings</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack direction="column" gap={2} sx={{ p: 1 }}>
              <TextField
                placeholder="My fantasy pool league"
                label="League name"
                defaultValue={league?.name}
                error={Boolean(errors.leagueName?.message)}
                {...register("leagueName", { required: "Name is required" })}
              />
              <TextField
                placeholder="Enter a league manager message"
                label="League manager message"
                defaultValue={league?.leagueManagerMessage}
                {...register("leagueManagerMessage")}
              />
              <Button type="submit" variant="contained">
                Save changes
              </Button>
            </Stack>
          </form>
        </Card>
        <ScoringRubrikForm league={league} />
      </Stack>
    </PageContainer>
  );
};
