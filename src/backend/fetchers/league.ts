import { doc, getDoc, updateDoc } from "firebase/firestore";
import { League } from "../../types";
import { firestore } from "../firebase/controller";
import { db } from "../firebase/firebaseConfig";

export const fetchLeague = async (id: string): Promise<League | undefined> => {
  const docSnap = await getDoc(doc(firestore, `leagues/${id}`));
  if (docSnap.exists()) {
    const data = docSnap.data() as Omit<League, "id">;
    return {
      id: docSnap.id,
      ...data,
    };
  } else {
    console.error("No league record found for ", id);
  }
};

export const updateLeague = async (
  resolvedLeague: Omit<League, "id">,
  leagueId: string,
  onSuccess?: () => void,
  onError?: () => void
): Promise<void> => {
  try {
    const docRef = doc(db, "leagues", leagueId);
    await updateDoc(docRef, resolvedLeague);
    onSuccess?.();
  } catch (e) {
    console.error("Unable to update league, missing permissions");
    onError?.();
  }
};
