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

  console.log("=== WORLD ID VERIFY DEBUG ===");
  console.log("WLD_APP_ID:", WLD_APP_ID);
  console.log("Action:", actionId);
  console.log("Signal:", signal);
  console.log("Payload keys:", Object.keys(payload));
  console.log("Payload:", JSON.stringify(payload, null, 2));

  try {
    // Use the official verifyCloudProof function from MiniKit
    const verifyRes = await verifyCloudProof(payload, WLD_APP_ID, actionId, signal) as IVerifyResponse;
    
    console.log("World ID verification result:", verifyRes);
    console.log("Verification success:", verifyRes.success);
    console.log("Verification details:", JSON.stringify(verifyRes, null, 2));

    if (!verifyRes.success) {
      console.error("Verification failed with details:", verifyRes);
      throw new Error(`World ID verification failed: ${JSON.stringify(verifyRes)}`);
    }

    return {
      isHuman: verifyRes.success === true,
      nullifier_hash: payload.nullifier_hash,
    };
  } catch (error) {
    console.error("World ID verification error:", error);
    throw new Error(`World ID verification failed: ${error}`);
  }
}