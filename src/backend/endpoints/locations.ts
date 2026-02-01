import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
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

  const byName = new Map<string, PoolHallLocation[]>();
  for (const loc of locations) {
    const list = byName.get(loc.name) ?? [];
    list.push(loc);
    byName.set(loc.name, list);
  }
  const names: string[] = [];
  for (const [, list] of byName) {
    const withCity = list.find((l) => l.city?.trim());
    names.push((withCity ?? list[0]).name);
  }
  return names.sort();
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

  const byName = new Map<string, PoolHallLocation[]>();
  for (const loc of locations) {
    const list = byName.get(loc.name) ?? [];
    list.push(loc);
    byName.set(loc.name, list);
  }
  const deduped: PoolHallLocation[] = [];
  for (const [, list] of byName) {
    const withCity = list.find((l) => l.city?.trim());
    deduped.push(withCity ?? list[0]);
  }
  return deduped;
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

export const deleteLocation = async (
  locationId: string,
  onSuccess?: () => void,
  onError?: () => void
): Promise<void> => {
  try {
    await deleteDoc(doc(firestore, `locations/${locationId}`));
    onSuccess?.();
  } catch (e) {
    onError?.();
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

export const fetchLocationByName = async (
  name: string
): Promise<PoolHallLocation | undefined> => {
  const querySnapshot = await getDocs(
    query(LOCATIONS_COLLECTION, where("name", "==", name))
  );
  if (querySnapshot.docs.length > 0) {
    const docs = querySnapshot.docs;
    const withCity = docs.find((d) =>
      (d.data() as PoolHallLocation)?.city?.trim()
    );
    const chosen = withCity ?? docs[0];
    const data = chosen.data() as Omit<PoolHallLocation, "id">;
    return {
      id: chosen.id,
      ...data,
    };
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
