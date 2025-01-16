import { Box, CircularProgress } from "@mui/material";
import { FC } from "react";
import EightBallIcon from "./icons/EightBallIcon";

export const Loader: FC = () => {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress size={60} color="error" />
      <Box
        position="absolute"
        top="50%"
        left="50%"
        sx={{ transform: "translate(-50%, -50%)" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <EightBallIcon width="40px" height="40px" />
      </Box>
    </Box>
  );
};
