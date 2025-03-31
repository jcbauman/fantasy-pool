import { Stack } from "@mui/material";
import { FC } from "react";
import { PageContainer } from "../../shared-components/PageContainer";

export const LastSeasonPage: FC = () => {
  return (
    <PageContainer>
      <Stack
        direction="column"
        sx={{ width: "100%", height: "100%", p: 1 }}
        spacing={2}
      ></Stack>
    </PageContainer>
  );
};
