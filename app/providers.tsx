'use client';
import { ReactNode, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install();
  }, []);
  return <>{children}</>;
}
