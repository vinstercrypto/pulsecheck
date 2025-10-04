// lib/world.ts
import { hashToField } from '@worldcoin/idkit-core/hashing';

export function hashSignal(signal?: string) {
  if (!signal) return undefined;
  return hashToField(signal).toString();
}

export function requireOrb(): boolean {
  return process.env.REQUIRE_ORB_VERIFICATION === 'true';
}

export function getWorldIds() {
  const appId = process.env.WORLDCON_APP_ID as `app_${string}`;
  const actionId = process.env.WORLDCON_ACTION_ID as string;
  if (!appId || !actionId) throw new Error('Missing WORLDCON_APP_ID or WORLDCON_ACTION_ID');
  return { appId, actionId };
}
