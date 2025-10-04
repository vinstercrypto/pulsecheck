interface VerifyReply {
  isHuman: boolean;
  nullifier_hash: string;
}

export async function verifyProof(proof: any, actionId: string): Promise<VerifyReply> {
  const WLD_APP_ID = process.env.NEXT_PUBLIC_WLD_APP_ID;
  const WLD_API_KEY = process.env.WLD_API_KEY;

  if (!WLD_APP_ID || !WLD_API_KEY) {
    throw new Error("World ID environment variables are not set.");
  }

  console.log("Verifying proof with action:", actionId);
  console.log("Proof object keys:", Object.keys(proof));

  const verifyEndpoint = 'https://developer.worldcoin.org/api/v2/verify';

  // Map MiniKit proof to World ID API format
  const requestBody = {
    app_id: WLD_APP_ID,
    action: actionId,
    proof: proof.proof || proof,
    merkle_root: proof.merkle_root,
    nullifier_hash: proof.nullifier_hash,
    verification_level: proof.verification_level,
  };

  console.log("Sending to World ID API:", { ...requestBody, proof: '[REDACTED]' });

  const res = await fetch(verifyEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${WLD_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  const responseText = await res.text();
  console.log("World ID API response status:", res.status);
  console.log("World ID API response (first 200 chars):", responseText.substring(0, 200));

  if (!res.ok) {
    let errorBody;
    try {
      errorBody = JSON.parse(responseText);
    } catch {
      throw new Error(`World ID API returned non-JSON response (${res.status}): ${responseText.substring(0, 100)}`);
    }
    console.error("Verification failed:", errorBody);
    throw new Error(`Verification failed: ${JSON.stringify(errorBody)}`);
  }

  const data = JSON.parse(responseText);

  return {
    isHuman: data.success === true,
    nullifier_hash: proof.nullifier_hash,
  };
}