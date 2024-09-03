import { Stack } from "@mui/material";
import { FC } from "react";
import { ProfileEditor, ProfileFormValues } from "./components/ProfileEditor";
import { PageContainer } from "../../shared-components/PageContainer";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Player } from "../../types";
import { createNewPlayer } from "../../backend/setters";
import { useDispatch } from "react-redux";
import { sendErrorNotification } from "../../redux/notificationSlice";

export const CreatePlayerPage: FC = () => {
  const {
    authState: { user, refetchPlayer },
  } = useAppContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onSubmit = async (data: ProfileFormValues) => {
    const resolvedPlayer: Omit<Player, "id"> = {
      linkedUserId: user?.id ?? "",
      joinDate: new Date().toISOString(),
      ...data,
    };
    await createNewPlayer(
      resolvedPlayer,
      () => {
        refetchPlayer();
        navigate("/");
      },
      () =>
        dispatch(
          sendErrorNotification(
            "An error occurred, unable to create player profile"
          )
        )
    );
  };
  return (
    <PageContainer>
      <Stack
        direction={"column"}
        sx={{ width: "100%", height: "100%", p: 1, overflow: "hidden" }}
      >
        <ProfileEditor player={null} onSubmit={onSubmit} />
      </Stack>
    </PageContainer>
  );
};
