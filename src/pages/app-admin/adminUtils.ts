import { doc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { Game } from "../../types";
import { GAMES_COLLECTION } from "../../backend/firebase/controller";
import { db } from "../../backend/firebase/firebaseConfig";

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

export const getStartOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
};
