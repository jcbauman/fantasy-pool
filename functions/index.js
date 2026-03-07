/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onCall, HttpsError} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();

const INVITATIONS_COLLECTION = "invitations";

/**
 * Verify and consume an invite code. Safe to call unauthenticated.
 * Returns { leagueId } or throws if code invalid. One-time use.
 */
exports.verifyAndConsumeInvite = onCall(async (request) => {
  const code = request.data?.code;
  if (!code || typeof code !== "string" || !code.trim()) {
    throw new HttpsError("invalid-argument", "Invalid invite code");
  }
  const db = admin.firestore();
  const ref = db.collection(INVITATIONS_COLLECTION).doc(code.trim());
  const docSnap = await ref.get();
  if (!docSnap.exists) {
    throw new HttpsError("not-found", "Invalid or expired invite code");
  }
  const leagueId = docSnap.data()?.leagueId;
  if (!leagueId) {
    throw new HttpsError("failed-precondition", "Invalid invite");
  }
  await ref.delete();
  logger.info("Invite consumed", {code: code.trim(), leagueId});
  return {leagueId};
});
