import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import { OptionType } from '../../types';
import { ethers } from 'ethers';
import * as FlareEnoughABI from '../../config/FlareEnough.json';
import * as TestUSDCABI from '../../config/TestUSDC.json';
import * as TemporaryClearingHouseABI from '../../config/TemporaryClearingHouse.json';
import { CONTRACTS } from '../../config/index';
import { useNotification } from "@blockscout/app-sdk";


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

  const handleTrade = async () => {
    if (!signer) {
      console.error('No signer available');
      return;
    }

    setIsLoading(true);
    try {
      // Here you would implement the actual trading logic using the signer
      // For example:
      // const contract = new ethers.Contract(CONTRACTS.FLARE_ENOUGH, FlareEnoughABI, signer);
      // const tx = await contract.tradeOption(
      //   option.eventId,
      //   option.timeline,
      //   option.strike,
      //   option.type,
      //   side,
      //   amount,
      //   { value: total }
      // );
      // await tx.wait();
      const USDC = new ethers.Contract(
        CONTRACTS.TEST_USDC,
        TestUSDCABI.abi,
        signer
      );
      const amountInWei = ethers.utils.parseUnits(amount, 6); // Assuming USDC has 6 decimals

      // Approve USDC transfer
      // const approveTx = await USDC.approve(CONTRACTS.FLARE_ENOUGH, amountInWei);
      // await approveTx.wait();
      // openTxToast("114", approveTx.hash);

      const contract = new ethers.Contract(
        CONTRACTS.FLARE_ENOUGH,
        FlareEnoughABI.abi,
        signer
      );

      // Get the market data from eventId and timeline
      const eventId = parseInt(option.eventId) - 1;
      const marketData = await contract.getMarket(eventId);
      console.log('Market Data:', marketData);

      // figure out which timeline to use
      let timelineAddress;
      if (marketData.outcome1 === option.timeline) {
        timelineAddress = marketData.clearingHouse1;
      } else if (marketData.outcome2 === option.timeline) {
        timelineAddress = marketData.clearingHouse2;
      }

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
        ethers.utils.parseUnits(option.premium.toString(), 6),
        "0x487A786F9F59c8996f13cb990e1e1e69a85E9857", // seller is kind of hardcoded for simplicity purpose
        ethers.utils.parseUnits(option.strike.toString(), 6),
        ethers.utils.parseUnits(amount, 8),
        new Date("2025-06-27T08:00:00Z").getTime() / 1000, // expiry timestamp
      )
      await depositAndMintTx.wait();
      openTxToast("114", depositAndMintTx.hash);


      console.log('Trade executed:', {
        eventId: option.eventId,
        timeline: option.timeline,
        option,
        side,
        amount,
        total
      });
      
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
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-foreground">
            Trade {option.type.toUpperCase()} Option at ${option.strike.toLocaleString()}
          </h3>
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