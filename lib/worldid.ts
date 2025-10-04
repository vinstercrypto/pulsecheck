
interface VerifyReply {
  isHuman: boolean;
  nullifier_hash: string;
  // Other fields are available but we only need these two
}

export async function verifyProof(proof: any, actionId: string): Promise<VerifyReply> {
  const WLD_APP_ID = process.env.NEXT_PUBLIC_WLD_APP_ID;
  const WLD_API_KEY = process.env.WLD_API_KEY;

  if (!WLD_APP_ID || !WLD_API_KEY) {
    throw new Error("World ID environment variables are not set.");
  }

  const verifyEndpoint = 'https://developer.worldcoin.org/api/v2/verify';

  console.log("Verifying proof with action:", actionId);

  const res = await fetch(verifyEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${WLD_API_KEY}`,
    },
    body: JSON.stringify({
      ...proof,
      action: actionId,
      app_id: WLD_APP_ID,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.json();
    console.error("Verification failed:", errorBody);
    throw new Error(`Verification failed: ${res.statusText} - ${JSON.stringify(errorBody)}`);
  }

  const data = await res.json();

  return {
    isHuman: data.is_human,
    nullifier_hash: data.nullifier_hash,
  };
}
