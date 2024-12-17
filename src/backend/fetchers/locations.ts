import { addDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { PoolHallLocation } from "../../types";
import { LOCATIONS_COLLECTION } from "../firebase/controller";

export const useFetchLocations = (): string[] => {
  const [locations, setLocations] = useState<PoolHallLocation[]>([]);
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const querySnapshot = await getDocs(LOCATIONS_COLLECTION);
        const docsData: PoolHallLocation[] = querySnapshot.docs.map((doc) => {
          const data = doc.data() as Omit<PoolHallLocation, "id">;
          return {
            id: doc.id,
            ...data,
          };
        });
        setLocations(docsData);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    };

    fetchDocuments();
  }, []);

  const reducedLocations = locations.map((l) => l.name);
  return [...new Set(reducedLocations)].sort();
};

export const addNewLocation = async (
  location: Omit<PoolHallLocation, "id">
): Promise<string | undefined> => {
  try {
    const docRef = await addDoc(LOCATIONS_COLLECTION, { ...location });

    return docRef.id;
  } catch (e) {
    console.error("Unable to add location, missing permissions");
  }
};
