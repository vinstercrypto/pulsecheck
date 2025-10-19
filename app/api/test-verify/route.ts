import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    WLD_APP_ID: process.env.WLD_APP_ID ? 'SET' : 'NOT SET',
    WLD_ACTION_ID_VOTE: process.env.WLD_ACTION_ID_VOTE ? 'SET' : 'NOT SET',
    WLD_VERIFY_ENDPOINT: process.env.WLD_VERIFY_ENDPOINT ? 'SET' : 'NOT SET',
    WLD_API_KEY: process.env.WLD_API_KEY ? 'SET' : 'NOT SET',
  };

  // Test the verify endpoint
  let endpointTest = 'NOT TESTED';
  if (process.env.WLD_VERIFY_ENDPOINT) {
    try {
      const response = await fetch(process.env.WLD_VERIFY_ENDPOINT, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      endpointTest = `Status: ${response.status}, Content-Type: ${response.headers.get('content-type')}`;
    } catch (error: any) {
      endpointTest = `Error: ${error.message}`;
    }
  }

  return NextResponse.json({
    environmentVariables: envVars,
    endpointTest,
    timestamp: new Date().toISOString()
  });
}
