import { Card, Slide, Stack, Typography } from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import { useAppContext } from "../../../context/AppContext";
import { getPlayerWithMostScratches } from "../hooks/utils";

export const ScratchKing: React.FC = () => {
  const { records, players } = useAppContext();
  const { scratcher, count } = getPlayerWithMostScratches(records, players);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [size, setSize] = useState(0);

  // ResizeObserver to update canvas size dynamically
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      const newSize = container.offsetWidth;
      setSize(newSize);
    });

    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  // Fill cover when size changes
  useEffect(() => {
    if (size > 0 && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "gray";
        ctx.fillRect(0, 0, size, size);
      }
    }
  }, [size]);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, size * 0.05, 0, Math.PI * 2, true); // brush size relative to canvas
        ctx.fill();
      }
      checkScratchPercentage();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!revealed && e.buttons === 1 && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      scratch(e.clientX - rect.left, e.clientY - rect.top);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!revealed && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      scratch(touch.clientX - rect.left, touch.clientY - rect.top);
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
          if (pixels[i] === 0) clearPixels++;
        }

        const totalPixels = pixels.length / 4;
        const clearPercentage = (clearPixels / totalPixels) * 100;

        if (clearPercentage >= 50) {
          setRevealed(true);
        }
      }
    }
  };

  if (scratcher?.profilePictureUrl) {
    return (
      <Card sx={{ p: 2, h: "auto", flexShrink: 0 }}>
        <Typography sx={{ mb: 1 }}>Scratch leader</Typography>
        <div
          ref={containerRef}
          style={{
            width: "100%",
            aspectRatio: "1 / 1",
            position: "relative",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <img
            src={scratcher?.profilePictureUrl ?? ""}
            alt="Scratchable content"
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
          <canvas
            ref={canvasRef}
            width={size}
            height={size}
            style={{
              width: "100%",
              height: "100%",
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

          <Typography
            variant="h6"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              textAlign: "center",
              pointerEvents: "none",
              zIndex: 1,
              opacity: revealed ? 0 : 1,
              transition: "opacity 1s ease-in-out",
            }}
          >
            Scratch to reveal
          </Typography>
          <Slide direction="up" in={revealed} mountOnEnter unmountOnExit>
            <Stack
              direction="column"
              sx={{
                textAlign: "right",
                color: "white",
                position: "absolute",
                top: "5%",
                right: "5%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: 1,
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "bold",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
                }}
              >
                {count}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
                }}
              >
                in {records?.[scratcher?.id ?? ""]?.totalGames ?? "all"} games
              </Typography>
            </Stack>
          </Slide>
        </div>
      </Card>
    );
  }
  return <></>;
};
