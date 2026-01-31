import { addDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { PoolHallLocation } from "../../types";
import { firestore, LOCATIONS_COLLECTION } from "../firebase/controller";
import { sendErrorNotification } from "../../shared-components/toasts/notificationToasts";

export const useFetchLocationNames = (): string[] => {
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
        sendErrorNotification(`Error fetching locations: ${error}`);
      }
    };

    fetchDocuments();
  }, []);

  const reducedLocations = locations.map((l) => l.name);
  return [...new Set(reducedLocations)].sort();
};

export const useFetchLocations = (): PoolHallLocation[] => {
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
        sendErrorNotification(`Error fetching locations: ${error}`);
      }
    };

    fetchDocuments();
  }, []);

  return locations;
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

export const fetchLocationById = async (
  id: string
): Promise<PoolHallLocation | undefined> => {
  const docSnap = await getDoc(doc(firestore, `locations/${id}`));
  if (docSnap.exists()) {
    const data = docSnap.data() as Omit<PoolHallLocation, "id">;
    return {
      id: docSnap.id,
      ...data,
    };
  } else {
    console.error("No location record found found for ", id);
  }
};

export const updateLocation = async (
  location: Omit<PoolHallLocation, "id">,
  locationId: string,
  onSuccess?: () => void,
  onError?: () => void
): Promise<void> => {
  try {
    const docRef = doc(firestore, `locations/${locationId}`);
    await updateDoc(docRef, location);
    onSuccess?.();
  } catch (e) {
    onError?.();
  }
};
