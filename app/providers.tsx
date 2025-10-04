'use client';

import { ReactNode, useEffect } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const initMiniKit = async () => {
      const MiniKitModule = await import('@worldcoin/minikit-react');
      const MiniKit = (MiniKitModule as any).MiniKit || (MiniKitModule as any).default?.MiniKit;
      
      if (MiniKit && MiniKit.install) {
        MiniKit.install(process.env.NEXT_PUBLIC_WLD_APP_ID!);
      }
    };
    
    initMiniKit();
  }, []);

  return <>{children}</>;
}