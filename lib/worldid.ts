interface VerifyReply {
  isHuman: boolean;
  nullifier_hash: string;
}

export async function verifyProof(payload: any, actionId: string): Promise<VerifyReply> {
  const WLD_APP_ID = process.env.NEXT_PUBLIC_WLD_APP_ID;

  if (!WLD_APP_ID) {
    throw new Error("WLD_APP_ID not configured");
  }

  console.log("=== WORLD ID VERIFY DEBUG ===");
  console.log("Action:", actionId);
  console.log("Payload keys:", Object.keys(payload));
  console.log("Payload:", JSON.stringify(payload, null, 2));

  const verifyEndpoint = `https://developer.worldcoin.org/api/v2/verify/${WLD_APP_ID}`;

  const requestBody = {
    nullifier_hash: payload.nullifier_hash,
    merkle_root: payload.merkle_root,
    proof: payload.proof,
    verification_level: payload.verification_level || 'orb',
    action: actionId,
  };

  console.log("Sending to World ID API:", verifyEndpoint);
  console.log("Request body:", JSON.stringify(requestBody, null, 2));

  const res = await fetch(verifyEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  const responseText = await res.text();
  console.log("World ID response status:", res.status);
  console.log("World ID response:", responseText);

  if (!res.ok) {
    throw new Error(`World ID API error: ${responseText}`);
  }

  const data = JSON.parse(responseText);

  return {
    isHuman: data.success === true,
    nullifier_hash: payload.nullifier_hash,
  };
}