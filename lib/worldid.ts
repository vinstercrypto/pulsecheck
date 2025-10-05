import { verifyCloudProof, IVerifyResponse, ISuccessResult } from '@worldcoin/minikit-js';

interface VerifyReply {
  isHuman: boolean;
  nullifier_hash: string;
}

export async function verifyProof(payload: ISuccessResult, actionId: string, signal?: string): Promise<VerifyReply> {
  const WLD_APP_ID = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;

  if (!WLD_APP_ID) {
    throw new Error("WLD_APP_ID not configured");
  }

    console.log("WLD_APP_ID:", WLD_APP_ID);
  console.log("Action:", actionId);
  console.log("Signal:", signal);
  console.log("Payload keys:", Object.keys(payload));
  console.log("Payload:", JSON.stringify(payload, null, 2));

  try {
    const verifyRes = await verifyCloudProof(payload, WLD_APP_ID, actionId, signal) as IVerifyResponse;
    console.log("World ID verification result:", verifyRes);

    // Return structured result; do NOT throw raw error bodies to callers
    return {
      isHuman: verifyRes.success === true,
      nullifier_hash: payload.nullifier_hash,
      // pass through useful context for routing decisions
      ...(verifyRes.success ? {} : { code: (verifyRes as any).code, detail: (verifyRes as any).detail }),
    } as { isHuman: boolean; nullifier_hash: string; code?: string; detail?: string };
  } catch (error) {
    console.error("World ID verification error:", error);
    // Surface a generic failure without leaking third-party response details
    return {
      isHuman: false,
      nullifier_hash: payload.nullifier_hash,
      code: 'verification_error',
      detail: 'Verification service error',
    };
  }
}