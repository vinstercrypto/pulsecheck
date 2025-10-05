'use client';

import { useEffect } from 'react';
import { MiniKit, tokenToDecimals, Tokens, PayCommandInput } from '@worldcoin/minikit-js';

export default function DonateButton() {
  useEffect(() => {
    const button = document.getElementById('donate-button');
    
    if (!button) return;

    const handleDonate = async () => {
      if (!MiniKit.isInstalled()) {
        alert('Please open this app in World App to donate.');
        return;
      }

      const donatePayload: PayCommandInput = {
        reference: `donation-${Date.now()}`,
        to: '0x0a3db9bf7f6a07157a912a29383ac1c130790f15',
        tokens: [
          {
            symbol: Tokens.WLD,
            token_amount: tokenToDecimals(2, Tokens.WLD).toString(),
          },
        ],
        description: 'Thanks for supporting PulseCheck',
      };

      try {
        const { finalPayload } = await MiniKit.commandsAsync.pay(donatePayload);
        
        if (finalPayload.status === 'success') {
          console.log('Donation successful');
        }
      } catch (error) {
        console.error('Donation error:', error);
      }
    };

    button.addEventListener('click', handleDonate);
    return () => button.removeEventListener('click', handleDonate);
  }, []);

  return null;
}