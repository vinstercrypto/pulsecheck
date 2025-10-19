import { verifyCloudProof, IVerifyResponse, ISuccessResult } from '@worldcoin/minikit-js';

interface VerifyReply {
  isHuman: boolean;
  nullifier_hash: string;
  code?: string;
  detail?: string;
}

export async function verifyProof(payload: ISuccessResult, actionId: string, signal?: string): Promise<VerifyReply> {
  const WLD_APP_ID = process.env.WLD_APP_ID as `app_${string}`;
  const WLD_VERIFY_ENDPOINT = process.env.WLD_VERIFY_ENDPOINT;

  if (!WLD_APP_ID) {
    throw new Error("WLD_APP_ID not configured");
  }

  console.log("=== WORLD ID VERIFY v2 DEBUG ===");
  console.log("WLD_APP_ID:", WLD_APP_ID);
  console.log("Action:", actionId);
  console.log("Signal:", signal);
  console.log("Payload:", JSON.stringify(payload, null, 2));

  try {
    // Use custom endpoint if provided, otherwise use default
    const verifyRes = await verifyCloudProof(
      payload, 
      WLD_APP_ID, 
      actionId, 
      signal,
      WLD_VERIFY_ENDPOINT ? { endpoint: WLD_VERIFY_ENDPOINT } : undefined
    );
    
    console.log("World ID verification result:", JSON.stringify(verifyRes, null, 2));

    if (verifyRes.success) {
      return {
        isHuman: true,
        nullifier_hash: payload.nullifier_hash,
      };
    } else {
      return {
        isHuman: false,
        nullifier_hash: payload.nullifier_hash,
        code: (verifyRes as any).code,
        detail: (verifyRes as any).detail,
      };
    }
  } catch (error) {
    console.error("World ID verification error:", error);
    return {
      isHuman: false,
      nullifier_hash: payload.nullifier_hash,
      code: 'verification_error',
      detail: 'Verification service error',
    };
  }
}