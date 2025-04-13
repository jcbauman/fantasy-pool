import { storage } from "../firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadProfilePicture = async (
  file: File,
  playerId: string
): Promise<string> => {
  const fileRef = ref(storage, `profilePictures/${playerId}`);
  await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(fileRef);
  return downloadURL;
};
