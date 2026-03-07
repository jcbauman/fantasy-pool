import { addDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { LeagueInvite } from "../../types";
import { INVITATIONS_COLLECTION } from "../firebase/controller";
import { app } from "../firebase/firebaseConfig";

/**
 * Verify and consume an invite code via Cloud Function. Safe for unauthenticated users.
 * Returns leagueId or undefined if code invalid/expired. One-time use.
 */
export const verifyAndExhaustInviteCode = async (
  code: string,
): Promise<string | undefined> => {
  try {
    const functions = getFunctions(app);
    const verifyAndConsumeInvite = httpsCallable<
      { code: string },
      { leagueId: string }
    >(functions, "verifyAndConsumeInvite");
    const { data } = await verifyAndConsumeInvite({ code: code.trim() });
    return data?.leagueId ?? undefined;
  } catch (e) {
    console.error("Unable to verify invitation", e);
    return undefined;
  }
};

export const generateNewInvitation = async (
  invitation: Omit<LeagueInvite, "id">,
): Promise<string | undefined> => {
  try {
    const docRef = await addDoc(INVITATIONS_COLLECTION, { ...invitation });
    return docRef.id;
  } catch (e) {
    console.error("Unable to generate invitation, missing permissions");
  }
};
