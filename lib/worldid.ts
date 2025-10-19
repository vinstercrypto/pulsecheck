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
    // Try with custom endpoint first, then fall back to default
    let verifyRes;
    try {
      if (WLD_VERIFY_ENDPOINT) {
        console.log("Using custom endpoint:", WLD_VERIFY_ENDPOINT);
        verifyRes = await verifyCloudProof(
          payload, 
          WLD_APP_ID, 
          actionId, 
          signal,
          { endpoint: WLD_VERIFY_ENDPOINT }
        );
      } else {
        console.log("Using default endpoint");
        verifyRes = await verifyCloudProof(
          payload, 
          WLD_APP_ID, 
          actionId, 
          signal
        );
      }
    } catch (endpointError: any) {
      console.error("Primary endpoint failed:", endpointError.message);
      
      // If custom endpoint fails, try default endpoint
      if (WLD_VERIFY_ENDPOINT) {
        console.log("Falling back to default endpoint");
        verifyRes = await verifyCloudProof(
          payload, 
          WLD_APP_ID, 
          actionId, 
          signal
        );
      } else {
        throw endpointError;
      }
    }
    
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
  } catch (error: any) {
    console.error("World ID verification error:", error);
    
    // Check if it's an HTML response (common error)
    if (error.message?.includes('<!DOCTYPE') || error.message?.includes('Unexpected token')) {
      return {
        isHuman: false,
        nullifier_hash: payload.nullifier_hash,
        code: 'endpoint_error',
        detail: 'World ID verification endpoint returned HTML instead of JSON. Check your API credentials.',
      };
    }
    
    return {
      isHuman: false,
      nullifier_hash: payload.nullifier_hash,
      code: 'verification_error',
      detail: error.message || 'Verification service error',
    };
  }
}