import { FC, useState } from "react";
import { PageContainer } from "../../shared-components/PageContainer";
import {
  Button,
  Card,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Controller, useForm } from "react-hook-form";
import { League } from "../../types";
import { deleteGame } from "../../backend/endpoints/games";
import { ScoringRubrikForm } from "./components/ScoringRubrikForm";
import {
  sendErrorNotification,
  sendSuccessNotification,
} from "../../shared-components/toasts/notificationToasts";
import { updateLeague } from "../../backend/endpoints/league";
import { generateNewInvitation } from "../../backend/endpoints/invitations";
import { Timestamp } from "firebase/firestore";

type FormData = {
  leagueName: string;
  leagueManagerMessage?: string;
  releaseWrapped?: boolean;
};

export const LeagueAdminPage: FC = () => {
  const {
    league,
    authState: { user },
  } = useAppContext();
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
        release2024Wrapped: data.releaseWrapped,
      };
      const { id, ...leagueNoId } = resolvedLeague;
      await updateLeague(leagueNoId, league.id, () =>
        sendSuccessNotification("League settings updated"),
      );
    }
  };

  const onInviteNewUser = async (): Promise<void> => {
    if (!league) return;
    const invitationId = await generateNewInvitation({
      leagueId: league.id,
      createdAt: Timestamp.now(),
      createdById: user?.id ?? "",
    });
    if (!invitationId) {
      sendErrorNotification("Failed to generate invitation");
      return;
    }
    const message = `You have been invited to join my Fantasy Pool league. Get started at https://www.fantasy-pool.com/#/sign-in?leagueInvite=${invitationId}`;
    const smsUrl = `sms:?body=${message}`;
    window.open(smsUrl, "_blank");
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
      <Stack direction="column" spacing={3} sx={{ p: 2 }}>
        <Card sx={{ p: 1 }}>
          <Typography variant="overline">League settings</Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack direction="column" gap={2} sx={{ p: 1 }}>
              <TextField
                placeholder="My Fantasy Pool league"
                label="League name"
                defaultValue={league?.name}
                error={Boolean(errors.leagueName?.message)}
                {...register("leagueName", { required: "Name is required" })}
              />
              <TextField
                multiline
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
        <Card sx={{ p: 1 }}>
          <Typography variant="overline">Invite new user</Typography>
          <Stack direction="column" spacing={2} sx={{ p: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onInviteNewUser}
              startIcon={<SendOutlinedIcon />}
            >
              Send league invite message
            </Button>
          </Stack>
        </Card>
        <ScoringRubrikForm league={league} />
      </Stack>
    </PageContainer>
  );
};
