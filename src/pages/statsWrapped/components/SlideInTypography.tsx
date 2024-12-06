import React, { useState, useEffect } from "react";
import { Typography, Box, Slide, Collapse, Grow } from "@mui/material";

interface SlideInTypographyProps {
  text: string[];
  style?: string; //"grow" | "slide" | "collapse"
  revealButton: () => void;
}

const SlideInTypography: React.FC<SlideInTypographyProps> = ({
  text,
  style = "grow",
  revealButton,
}) => {
  const [visible, setVisible] = useState<boolean[]>(
    Array(text.length).fill(false)
  );

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    text.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          setVisible((prev) => {
            const newVisible = [...prev];
            newVisible[index] = true;
            if (index === text.length - 1) {
              setTimeout(revealButton, 600);
            }
            return newVisible;
          });
        }, index * 1500)
      );
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [text, revealButton]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={1.5}
      sx={{ textAlign: "left", fontWeight: "bold" }}
    >
      {text.map((item, index) => {
        if (style === "slide") {
          return (
            <Slide
              style={{ transformOrigin: "0 0 0" }}
              key={index}
              direction="up"
              in={visible[index]}
              timeout={500}
            >
              <Typography variant="h3">{item}</Typography>
            </Slide>
          );
        }
        if (style === "collapse") {
          return (
            <Collapse
              style={{ transformOrigin: "0 0 0" }}
              key={index}
              in={visible[index]}
              timeout={500}
            >
              <Typography variant="h3">{item}</Typography>
            </Collapse>
          );
        }
        return (
          <Grow
            style={{ transformOrigin: "0 0 0" }}
            key={index}
            in={visible[index]}
            timeout={500}
          >
            <Typography variant="h3">{item}</Typography>
          </Grow>
        );
      })}
    </Box>
  );
};

export default SlideInTypography;
