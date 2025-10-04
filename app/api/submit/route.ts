
import { NextResponse } from 'next/server';

const ENABLE_PAY = process.env.ENABLE_PAY === 'true';

// Define types for what a sponsored poll submission might look like.
interface SponsoredPollSubmission {
  question: string;
  options: string[]; // e.g., ["Yes", "No"]
  durationHours: number; // e.g., 24
}

// Define the expected structure of a payment receipt from MiniKit Pay.
interface MiniKitPayReceipt {
  transactionId: string;
  amount: number;
  currency: 'USDC';
  timestamp: string;
  // ... other receipt details
}

interface SubmitPollRequestBody {
  pollData: SponsoredPollSubmission;
  paymentReceipt: MiniKitPayReceipt;
}

export async function POST(request: Request) {
  if (!ENABLE_PAY) {
    // TODO: When payments are enabled:
    // 1. Add logic to verify the MiniKit Pay receipt with a payment provider or on-chain.
    // 2. Validate the pollData (e.g., check for profanity, ensure option limits).
    // 3. If valid, insert the new poll into the `poll` table with a 'scheduled' or 'priority' status.
    // 4. Return the new poll ID or a success message.
    return NextResponse.json({ error: 'Sponsored poll submissions are not yet enabled.' }, { status: 501 });
  }

  try {
    const body: SubmitPollRequestBody = await request.json();
    
    // Placeholder for when the feature is enabled
    console.log("Received sponsored poll submission:", body.pollData);
    console.log("With payment receipt:", body.paymentReceipt);

    return NextResponse.json({ message: 'Submission received, processing pending feature activation.' });

  } catch (error) {
    console.error("Error processing poll submission:", error);
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}
