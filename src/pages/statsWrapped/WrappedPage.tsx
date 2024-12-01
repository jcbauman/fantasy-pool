import { FC } from "react";
import { PageContainer } from "../../shared-components/PageContainer";
import { Stack } from "@mui/material";
import Slideshow from "./components/Slideshow";

export const WrappedPage: FC = () => {
  return (
    <PageContainer authedRoute>
      <Stack direction="column" sx={{ width: "100%", height: "100%" }}>
        <Slideshow />
      </Stack>
    </PageContainer>
  );
};
