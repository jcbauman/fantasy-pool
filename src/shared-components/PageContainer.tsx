import { Stack } from "@mui/material";
import { FC } from "react";

const NAV_BAR_HEIGHT = 56;

export const PageContainer: FC<{ children: JSX.Element }> = ({ children }) => {
  return (
    <Stack
      direction="column"
      sx={{
        width: "100%",
        height: `calc(100% - ${NAV_BAR_HEIGHT}px)`,
        mt: `${NAV_BAR_HEIGHT}px`,
      }}
    >
      {children}
    </Stack>
  );
};
