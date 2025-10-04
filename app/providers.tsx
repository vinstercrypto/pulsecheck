'use client';

import { ReactNode } from 'react';
import { MiniKit } from '@worldcoin/minikit-react';

export function Providers({ children }: { children: ReactNode }) {
  if (typeof window !== 'undefined') {
    MiniKit.install(process.env.NEXT_PUBLIC_WLD_APP_ID!);
  }

  return <>{children}</>;
}