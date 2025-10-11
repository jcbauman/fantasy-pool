import { addDoc, getDocs, query, where } from "firebase/firestore";
import { FullSeasonRecordObject, SeasonRecords } from "../../types";
import { RECORDS_COLLECTION } from "../firebase/controller";
import { getSeasonStart } from "../../utils/dateUtils";
import { sendErrorNotification } from "../../shared-components/toasts/notificationToasts";

export const getPastSeasonHistoricalRecord = async (
  seasonStart?: string
): Promise<SeasonRecords | undefined> => {
  const lastSeasonEnd = seasonStart ?? getSeasonStart();
  try {
    if (!lastSeasonEnd) throw new Error("No date");
    const q = query(
      RECORDS_COLLECTION,
      where("seasonEndDate", "==", lastSeasonEnd)
    );
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
    const fullRec = documents[0] as FullSeasonRecordObject;
    return fullRec?.records;
  } catch (error) {
    sendErrorNotification(`Error querying historical record: ${error} `);
    return undefined;
  }
};

export const addNewSeasonRecords = async (
  record: FullSeasonRecordObject
): Promise<string | undefined> => {
  try {
    const docRef = await addDoc(RECORDS_COLLECTION, { ...record });
    return docRef.id;
  } catch (e) {
    console.error("Unable to add records, missing permissions");
  }
};
