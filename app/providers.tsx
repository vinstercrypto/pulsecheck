'use client';

import { ReactNode, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      MiniKit.install(process.env.NEXT_PUBLIC_WLD_APP_ID!);
    }
  }, []);

  return <>{children}</>;
}