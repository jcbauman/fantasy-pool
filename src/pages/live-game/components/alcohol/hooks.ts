import { useState } from "react";
import { useAppContext } from "../../../../context/AppContext";
import { AlcoholLog } from "../../../../types";
import { Timestamp } from "firebase/firestore";

interface UseGetAlcoholism {
  currentAlcoholLog: AlcoholLog | undefined;
  startTrackingDrinks: () => void;
  addDrink: () => void;
  undoAddDrink: () => void;
}

export const useGetAlcoholism = (): UseGetAlcoholism => {
  const {
    authState: { player },
  } = useAppContext();
  const [currentAlcoholLog, setCurrentAlcoholLog] = useState<
    AlcoholLog | undefined
  >(undefined);

  const startTrackingDrinks = () => {
    if (!currentAlcoholLog && player?.id) {
      setCurrentAlcoholLog({
        id: "mock-id",
        playerId: player.id,
        timestamp: Timestamp.fromDate(new Date()),
        drinks: [],
      });
    }
  };

  const addDrink = () => {
    if (currentAlcoholLog && player?.id) {
      const newDrinkTimestamp = Timestamp.fromDate(new Date());
      setCurrentAlcoholLog({
        ...currentAlcoholLog,
        drinks: [...currentAlcoholLog.drinks, newDrinkTimestamp],
      });
    }
  };

  const undoAddDrink = () => {
    if (
      currentAlcoholLog &&
      player?.id &&
      currentAlcoholLog.drinks.length > 0
    ) {
      const updatedDrinks = currentAlcoholLog.drinks.slice(0, -1);
      setCurrentAlcoholLog({
        ...currentAlcoholLog,
        drinks: updatedDrinks,
      });
    }
  };

  return { currentAlcoholLog, startTrackingDrinks, addDrink, undoAddDrink };
};
