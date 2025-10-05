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
        to: '0xYOUR_WALLET_ADDRESS', // Replace with your actual address
        tokens: [
          {
            symbol: Tokens.USDC,
            token_amount: tokenToDecimals(2, Tokens.USDC).toString(), // $2 donation
          },
        ],
        description: 'Support PulseCheck ☕',
      };

      try {
        const { finalPayload } = await MiniKit.commandsAsync.pay(donatePayload);
        
        if (finalPayload.status === 'success') {
          alert('Thank you for your support! 🙏');
        } else {
          console.log('Donation cancelled');
        }
      } catch (error) {
        console.error('Donation error:', error);
        alert('Donation failed. Please try again.');
      }
    };

    button.addEventListener('click', handleDonate);
    return () => button.removeEventListener('click', handleDonate);
  }, []);

  return null;
}