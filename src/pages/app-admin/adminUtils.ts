import { doc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { Game, GameStat, GameStatKeys, PoolHallLocation } from "../../types";
import { formatDateToMMDD } from "../../utils/statsUtils";
import { GAMES_COLLECTION } from "../../backend/firebase/controller";
import { db } from "../../backend/firebase/firebaseConfig";
import { deleteLocation } from "../../backend/setters";

export const collapsRepeatGames = (
  games: Game[],
  onSuccess: (message: string) => void
) => {
  let gamesCollapseCount = 0;
  for (let i = 1; i < games.length; i++) {
    if (gamesHaveSameBones(games[i], games[i - 1])) {
      gamesCollapseCount = gamesCollapseCount + 1;
    }
  }
  onSuccess(`Collapsed ${gamesCollapseCount} games`);
};

const gamesHaveSameBones = (game1: Game, game2: Game): boolean => {
  if (
    formatDateToMMDD(new Date(game1.timestamp)) ===
    formatDateToMMDD(new Date(game2.timestamp))
  ) {
    if (game1.location === game2.location) {
      if (arraysEqual(game1.playerIds, game2.playerIds)) {
        if (game1.authorPlayerId === game2.authorPlayerId) {
          return true;
        }
      }
    }
  }
  return false;
};

export const arraysEqual = (arr1: string[], arr2: string[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((value, index) => value === arr2[index]);
};

export const getGameCollapsedGame2IntoGame1 = (
  game1: Game,
  game2: Game
): Game => {
  const baseArray: GameStat[] = [];
  const newGame = { ...game1, statsByPlayer: baseArray };
  game2.statsByPlayer.forEach((game2Stat) => {
    const game1Stat = game1.statsByPlayer.find(
      (stat) => stat.playerId === game2Stat.playerId
    );
    if (game1Stat) {
      const newStat = { ...game1Stat };
      Object.keys(game2Stat).forEach((key) => {
        if (typeof game2Stat[key as keyof typeof GameStatKeys] === "number") {
          newStat[key as keyof typeof GameStatKeys] =
            (game1Stat[key as keyof typeof GameStatKeys] ?? 0) +
            (game2Stat[key as keyof typeof GameStatKeys] ?? 0);
        }
      });
      newGame.statsByPlayer.push(newStat);
    } else {
      newGame.statsByPlayer.push(game2Stat);
    }
  });
  return newGame;
};

const convertStringToTimestamp = (dateString: string): Timestamp => {
  const date = new Date(dateString);
  return Timestamp.fromDate(date);
};

// Function to update documents with correct Timestamp format
export const updateGamesWithTimestamps = async () => {
  const querySnapshot = await getDocs(GAMES_COLLECTION);
  let count = 0;
  querySnapshot.forEach(async (documentSnapshot) => {
    const documentData = documentSnapshot.data();
    if (Boolean(documentData.createdAt)) return;
    if (typeof documentData.timestamp === "string") {
      const convertedTimestamp = convertStringToTimestamp(
        documentData.timestamp
      );

      // Update the document with the converted Firestore Timestamp
      const docRef = doc(db, "games", documentSnapshot.id);
      await updateDoc(docRef, {
        createdAt: convertedTimestamp,
      });

      console.log(`bruh Updated document ID: ${documentSnapshot.id}`);
    }
  });
  console.log(`bruh ${count} have it`);
};

export const handleExportGames = (data: Game[]) => {
  const dataStr = JSON.stringify(data);
  const blob = new Blob([dataStr], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  const date = new Date();
  link.download = `games-db-${date.toString()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const handleExportLocations = (data: PoolHallLocation[]) => {
  const dataStr = JSON.stringify(data);
  const blob = new Blob([dataStr], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  const date = new Date();
  link.download = `locations-db-${date.toString()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const handleLocationCollapse = (locations: PoolHallLocation[]) => {
  console.log("bruh", locations);

  const duplicateLocations: PoolHallLocation[] = [];
  const locationNames = new Set<string>();

  locations.forEach((location) => {
    if (locationNames.has(location.name)) {
      duplicateLocations.push(location);
    } else {
      locationNames.add(location.name);
    }
  });

  duplicateLocations.forEach(async (location) => {
    await deleteLocation(location.id);
  });
  console.log(`Would delete ${duplicateLocations.length} duplicate locations`);
};
