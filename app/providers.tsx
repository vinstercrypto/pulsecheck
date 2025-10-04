'use client';

import { ReactNode, useEffect } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const initMiniKit = async () => {
      const { MiniKit } = await import('@worldcoin/minikit-react');
      
      MiniKit.install(process.env.NEXT_PUBLIC_WLD_APP_ID!);
    };
    
    initMiniKit();
  }, []);

  return <>{children}</>;
}