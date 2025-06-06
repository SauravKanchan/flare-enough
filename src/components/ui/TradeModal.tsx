import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import Button from './Button';
import { OptionType } from '../../types';
import { ethers } from 'ethers';
import * as FlareEnoughABI from '../../config/FlareEnough.json';
import * as TestUSDCABI from '../../config/TestUSDC.json';
import * as TemporaryClearingHouseABI from '../../config/TemporaryClearingHouse.json';
import { CONTRACTS } from '../../config/index';
import { useNotification } from "@blockscout/app-sdk";
import IndexedDBService from '../../services/IndexedDBService';
import confetti from 'canvas-confetti';

type TradeModalProps = {
  option: OptionType;
  isOpen: boolean;
  onClose: () => void;
  initialSide?: 'buy' | 'sell';
  signer: ethers.Signer | null;
};

const TradeModal: React.FC<TradeModalProps> = ({ 
  option, 
  isOpen, 
  onClose,
  initialSide = 'buy',
  signer
}) => {
  const [amount, setAmount] = useState('1');
  const [side, setSide] = useState<'buy' | 'sell'>(initialSide);
  const [isLoading, setIsLoading] = useState(false);
  const { openTxToast } = useNotification();
  
  if (!isOpen) return null;
  
  const total = side === 'buy' ? parseFloat(amount) * option.premium : parseFloat(amount) * option.collateral;

  const triggerConfetti = () => {
    const duration = 8000; // Increased duration to 8 seconds
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 9999,
      particleCount: 150
    };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleTrade = async () => {
    if (!signer) {
      console.error('No signer available');
      return;
    }

    setIsLoading(true);
    try {
      const USDC = new ethers.Contract(
        CONTRACTS.TEST_USDC,
        TestUSDCABI.abi,
        signer
      );
      const amountInWei = ethers.utils.parseUnits(String(total), 6);
      console.log('Amount in Wei:', amountInWei.toString());
      const contract = new ethers.Contract(
        CONTRACTS.FLARE_ENOUGH,
        FlareEnoughABI.abi,
        signer
      );

      const eventId = parseInt(option.eventId) - 1;
      const marketData = await contract.getMarket(eventId);
      console.log('Market Data:', marketData);

      let timelineAddress;
      if (marketData.outcome1 === option.timeline) {
        timelineAddress = marketData.clearingHouse1;
      } else if (marketData.outcome2 === option.timeline) {
        timelineAddress = marketData.clearingHouse2;
      }

      const approveTx = await USDC.approve(timelineAddress, amountInWei);
      await approveTx.wait();
      openTxToast("114", approveTx.hash);

      const timelineContract = new ethers.Contract(
        timelineAddress,
        TemporaryClearingHouseABI.abi,
        signer
      );

      let function_name;
      if (side === 'buy') {
        function_name = 'depositAndMintCall';
      } else {
        function_name = 'depositAndMintPut';
      }
      
      const depositAndMintTx = await timelineContract[function_name](
        amountInWei,
        "0x487A786F9F59c8996f13cb990e1e1e69a85E9857",
        ethers.utils.parseUnits(option.strike.toString(), 6),
        ethers.utils.parseUnits(amount, 2),
        new Date("2025-06-27T08:00:00Z").getTime() / 1000,
      );
      
      await depositAndMintTx.wait();
      openTxToast("114", depositAndMintTx.hash);

      // Store trade in IndexedDB
      const db = IndexedDBService.getInstance();
      // @ts-ignore
      await db.addTrade({
        eventId: option.eventId,
        timeline: option.timeline,
        type: option.type,
        side: side,
        strike: option.strike,
        premium: option.premium,
        amount: parseFloat(amount),
      });

      // Trigger enhanced confetti animation
      triggerConfetti();
      
      onClose();
    } catch (error) {
      console.error('Trade failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background rounded-lg shadow-xl w-full max-w-md p-6 m-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              Trade {option.type.toUpperCase()} Option at ${option.strike.toLocaleString()}
            </h3>
            <div className="flex items-center mt-2 text-sm text-amber-600 dark:text-amber-400">
              <AlertTriangle size={16} className="mr-1" />
              <span>Only executes if {option.timeline} occurs</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Trade Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={side === 'buy' ? 'primary' : 'outline'}
                onClick={() => setSide('buy')}
              >
                Buy
              </Button>
              <Button
                variant={side === 'sell' ? 'primary' : 'outline'}
                onClick={() => setSide('sell')}
              >
                Sell
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background text-foreground border-input focus:outline-none focus:ring-2 focus:ring-primary"
              min="0.1"
              step="0.1"
            />
          </div>
          
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Strike Price</span>
              <span className="text-foreground">${option.strike.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Event ID</span>
              <span className="text-foreground">{option.eventId}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Timeline</span>
              <span className="text-foreground">{option.timeline}</span>
            </div>
            {side === 'buy' && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Premium</span>
                <span className="text-foreground">${option.premium.toFixed(4)}</span>
              </div>
            )}
            {side === 'sell' && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Collateral Required</span>
                <span className="text-foreground">${option.collateral.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quantity</span>
              <span className="text-foreground">{amount}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t border-border">
              <span>{side === 'buy' ? 'Total Cost' : 'Required Collateral'}</span>
              <span>${total.toFixed(4)}</span>
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              variant="primary" 
              className="w-full"
              onClick={handleTrade}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : `${side === 'buy' ? 'Buy' : 'Sell'} ${option.type.toUpperCase()}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeModal;