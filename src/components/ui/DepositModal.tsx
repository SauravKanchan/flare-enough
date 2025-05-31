import React, { useState } from 'react';
import { X, DollarSign } from 'lucide-react';
import Button from './Button';

type DepositModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number) => void;
};

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onDeposit }) => {
  const [amount, setAmount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    const depositAmount = parseFloat(amount);
    if (!isNaN(depositAmount) && depositAmount > 0) {
      onDeposit(depositAmount);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 m-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Deposit USDC
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign size={16} className="text-gray-400" />
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={handleSubmit}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            Deposit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;