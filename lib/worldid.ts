import { verifyCloudProof, ISuccessResult } from "@worldcoin/minikit-js";

interface VerifyReply {
  isHuman: boolean;
  nullifier_hash: string;
  code?: string;
  detail?: string;
}

/**
 * Server-side Verify v2 using MiniKit cloud verifier.
 * IMPORTANT: pass the SAME `signal` the client used (raw pollId UUID).
 */
export async function verifyProof(
  payload: ISuccessResult,
  actionId: string,
  signal: string
): Promise<VerifyReply> {
  const WLD_APP_ID = process.env.WLD_APP_ID as `app_${string}`;
  const WLD_VERIFY_ENDPOINT = process.env.WLD_VERIFY_ENDPOINT; // string or undefined

  if (!WLD_APP_ID) throw new Error("WLD_APP_ID not configured");
  if (!actionId) throw new Error("WLD_ACTION_ID_VOTE not configured");

  // Diagnostics
  console.log("=== WORLD ID VERIFY v2 ===");
  console.log("app_id:", WLD_APP_ID);
  console.log("action:", actionId);
  console.log("signal:", signal);

  try {
    // NOTE: last param is a string/URL, not an object
    const verifyRes = await verifyCloudProof(
      payload,
      WLD_APP_ID,
      actionId,
      signal,
      WLD_VERIFY_ENDPOINT || undefined
    );

    if (verifyRes?.success) {
      return {
        isHuman: true,
        nullifier_hash: String(payload.nullifier_hash ?? "").toLowerCase(),
      };
    }
    return {
      isHuman: false,
      nullifier_hash: String(payload.nullifier_hash ?? "").toLowerCase(),
      code: (verifyRes as any)?.code,
      detail: (verifyRes as any)?.detail,
    };
  } catch (err: any) {
    return {
      isHuman: false,
      nullifier_hash: String(payload?.nullifier_hash ?? "").toLowerCase(),
      code: "verification_error",
      detail: err?.message ?? "Verification service error",
    };
  }
}
