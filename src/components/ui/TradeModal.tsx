import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import { OptionType } from '../../types';

type TradeModalProps = {
  option: OptionType;
  isOpen: boolean;
  onClose: () => void;
  initialSide?: 'buy' | 'sell';
};

const TradeModal: React.FC<TradeModalProps> = ({ 
  option, 
  isOpen, 
  onClose,
  initialSide = 'buy'
}) => {
  const [amount, setAmount] = useState('1');
  const [side, setSide] = useState<'buy' | 'sell'>(initialSide);
  
  if (!isOpen) return null;
  
  const total = side === 'buy' ? parseFloat(amount) * option.premium : parseFloat(amount) * option.collateral;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50\" onClick={onClose} />
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
            <Button variant="primary" className="w-full">
              {side === 'buy' ? 'Buy' : 'Sell'} {option.type.toUpperCase()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeModal;