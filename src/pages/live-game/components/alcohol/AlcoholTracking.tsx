import {
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  Collapse,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { useGetAlcoholism } from "./hooks";
import { LiquorOutlined } from "@mui/icons-material";

export const AlcoholTracking: FC = () => {
  const { currentAlcoholLog, startTrackingDrinks, addDrink, undoAddDrink } =
    useGetAlcoholism();
  const [btnFlashStates, setBtnFlashStates] = useState(false);
  const handleButtonAnimation = () => {
    setBtnFlashStates(true);

    setTimeout(() => {
      setBtnFlashStates(false);
    }, 300);
  };
  return (
    <Stack sx={{ mt: 2, borderTop: "1px solid" }}>
      <Card sx={{ mt: 2 }}>
        <Stack direction="column" sx={{ p: 2 }}>
          <Collapse in={!Boolean(currentAlcoholLog)}>
            <Stack direction="column">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(currentAlcoholLog)}
                    onChange={(_e, checked) => {
                      if (checked) startTrackingDrinks();
                    }}
                  />
                }
                label="Start tracking drinks for today's game(s)?"
              />
              <Typography variant="caption">
                Check the box if you want to start logging alcohol data for
                today's game(s). Even if you are not drinking, check the box to
                have your sobriety figure into your <i>perfect level</i>{" "}
                calculations.
              </Typography>
            </Stack>
          </Collapse>
          <Collapse in={Boolean(currentAlcoholLog)}>
            <List>
              <ListItem
                disablePadding
                secondaryAction={
                  <ButtonGroup variant="contained" aria-label="Run selection">
                    <Button
                      size="large"
                      onClick={() => {
                        undoAddDrink();
                        handleButtonAnimation();
                      }}
                    >
                      -
                    </Button>
                    <Button
                      sx={{
                        pointerEvents: "none",
                        backgroundColor: btnFlashStates ? "white" : "black",
                        color: btnFlashStates ? "black" : "white",
                        transition: "background-color 0.3s, color 0.3s",
                      }}
                      size="large"
                    >
                      {currentAlcoholLog?.drinks.length || 0}
                    </Button>
                    <Button
                      size="large"
                      onClick={() => {
                        addDrink();
                        handleButtonAnimation();
                      }}
                    >
                      +
                    </Button>
                  </ButtonGroup>
                }
              >
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <LiquorOutlined />
                </ListItemIcon>
                <ListItemText
                  primary="Add a drink"
                  secondary={
                    <Typography variant="caption" noWrap>
                      Timestamp will be recorded
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Collapse>
        </Stack>
      </Card>
    </Stack>
  );
};
