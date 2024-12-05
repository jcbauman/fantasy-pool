import { Button, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { Link } from "react-router-dom";

export const WrappedOverviewButton: FC<{
  onClick: () => void;
  href: string;
}> = ({ onClick, href }) => {
  return (
    <Stack sx={{ p: 2 }}>
      <Button
        to={href}
        component={Link}
        onClick={onClick}
        variant="contained"
        sx={{
          position: "relative",
          zIndex: 1,
          color: "white",
          backgroundColor: "black",
          borderRadius: "8px",
          padding: "10px 20px",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            borderRadius: "inherit",
            padding: "2px", // This creates the border effect
            background:
              "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          },
          "&:hover": {
            backgroundColor: "#222", // Slightly lighter black on hover
          },
        }}
      >
        <Stack
          direction="row"
          sx={{ alignItems: "center", textTransform: "none" }}
        >
          <Typography variant="h4" sx={{ mr: 3 }}>
            🎁
          </Typography>
          <Typography>Your 2024 Wrapped is here</Typography>
        </Stack>
      </Button>
    </Stack>
  );
};
