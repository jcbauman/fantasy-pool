import React, { useRef, useState, useEffect } from "react";
import { getPlayerWithMostScratches } from "../hooks/utils";
import { useAppContext } from "../../../context/AppContext";
import { Avatar, Card, Collapse, Grow, Stack, Typography } from "@mui/material";
import { getPlayerNameAbbreviation } from "../../playersList/utils/playerUtils";

interface ScratchCardProps {
  coverColor?: string;
  width?: number;
  height?: number;
}

export const ScratchKing: React.FC<ScratchCardProps> = ({
  coverColor = "#fffff",
  width = 200,
  height = 200,
}) => {
  const { records, players } = useAppContext();
  const scratchKing = getPlayerWithMostScratches(records, players);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = coverColor;
        ctx.fillRect(0, 0, width, height);
      }
    }
  }, [coverColor, width, height]);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2, true);
        ctx.fill();
      }
      checkScratchPercentage();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!revealed && e.buttons === 1) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      scratch(x, y);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!revealed) {
      const rect = e.currentTarget.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      scratch(x, y);
    }
  };

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (canvas && !revealed) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let clearPixels = 0;

        for (let i = 3; i < pixels.length; i += 4) {
          if (pixels[i] === 0) {
            clearPixels++;
          }
        }

        const totalPixels = pixels.length / 4;
        const clearPercentage = (clearPixels / totalPixels) * 100;

        if (clearPercentage >= 50) {
          setRevealed(true);
        }
      }
    }
  };
  return (
    <Card sx={{ p: 1, flexShrink: 0 }}>
      <Stack
        direction="row"
        sx={{ alignItems: "center", justifyContent: "space-around" }}
      >
        <div style={{ position: "relative", width, height }}>
          <Avatar
            src={scratchKing?.scratcher?.profilePictureUrl}
            alt="Scratchable content"
            style={{ width, height, position: "absolute", top: 0, left: 0 }}
          />
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              opacity: revealed ? 0 : 1,
              transition: "opacity 1s ease-in-out",
              touchAction: "none",
            }}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
          />
        </div>
        <Grow in={revealed}>
          <Stack>
            <Typography variant="overline">Scratch King</Typography>
            <Typography variant="h6">
              {getPlayerNameAbbreviation(scratchKing?.scratcher?.name ?? "")}
            </Typography>
            <Typography>{scratchKing?.count ?? ""}+ scratches</Typography>
          </Stack>
        </Grow>
      </Stack>
    </Card>
  );
};
