interface VerifyReply {
  isHuman: boolean;
  nullifier_hash: string;
}

export async function verifyProof(proof: any, actionId: string, hashedSignal?: string): Promise<VerifyReply> {
  const WLD_APP_ID = process.env.NEXT_PUBLIC_WLD_APP_ID;

  if (!WLD_APP_ID) {
    throw new Error("WLD_APP_ID environment variable is not set.");
  }

  console.log("Verifying proof with action:", actionId);
  console.log("Proof structure:", Object.keys(proof));

  // World ID v2 verify endpoint format
  const verifyEndpoint = `https://developer.worldcoin.org/api/v2/verify/${WLD_APP_ID}`;

  const requestBody = {
    nullifier_hash: proof.nullifier_hash,
    merkle_root: proof.merkle_root,
    proof: proof.proof,
    verification_level: proof.verification_level,
    action: actionId,
    signal: hashedSignal,
  };

  console.log("Sending to World ID:", { 
    endpoint: verifyEndpoint,
    action: actionId,
    verification_level: requestBody.verification_level 
  });

  const res = await fetch(verifyEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const responseText = await res.text();
  
  if (!res.ok) {
    console.error("World ID API error:", res.status, responseText);
    let errorBody;
    try {
      errorBody = JSON.parse(responseText);
    } catch {
      throw new Error(`World ID API error (${res.status}): ${responseText.substring(0, 200)}`);
    }
    throw new Error(`Verification failed: ${errorBody.detail || errorBody.message || JSON.stringify(errorBody)}`);
  }

  const data = JSON.parse(responseText);
  console.log("World ID verification successful");

  return {
    isHuman: data.success === true,
    nullifier_hash: proof.nullifier_hash,
  };
}