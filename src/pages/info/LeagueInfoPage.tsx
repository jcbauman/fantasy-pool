import { Card, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { PageContainer } from "../../shared-components/PageContainer";

export const LeagueInfoPage: FC = () => {
  return (
    <PageContainer>
      <Stack
        direction="column"
        sx={{ width: "100%", height: "100%", p: 1 }}
        spacing={2}
      >
        <Card sx={{ p: 2 }}>
          <Typography variant="overline">League Manager's Note</Typography>
          <Typography variant="body2">
            There has not been an LM Note posted.
          </Typography>
        </Card>
        <Card sx={{ p: 2 }}>
          <Typography variant="overline">Abbreviations Glossary</Typography>
        </Card>
      </Stack>
    </PageContainer>
  );
};
