import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { NETWORK, ERRORS, CONTRACTS } from '../config';
import TestUSDCABI from '../config/TestUSDC.json';

type WalletContextType = {
  isConnected: boolean;
  address: string | null;
  signer: ethers.Signer | null;
  provider: ethers.providers.Web3Provider | null;
  balance: number | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  deposit: (amount: number) => Promise<void>;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setSigner(provider.getSigner());
          setIsConnected(true);
          updateBalance(accounts[0], provider);
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  const updateBalance = async (userAddress: string, provider: ethers.providers.Web3Provider) => {
    try {
      const contract = new ethers.Contract(CONTRACTS.TEST_USDC, TestUSDCABI, provider);
      const rawBalance = await contract.balanceOf(userAddress);
      setBalance(parseFloat(ethers.utils.formatUnits(rawBalance, 6))); // USDC has 6 decimals
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(null);
    }
  };

  const connectWallet = async () => {
    if (!provider) {
      alert('Please install MetaMask!');
      return;
    }

    try {
      // @ts-ignore
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Check if we're on the correct network
      const network = await provider.getNetwork();
      if (network.chainId.toString() !== NETWORK.COSTON.chainId) {
        alert(ERRORS.NETWORK_SWITCH);
        return;
      }

      setAddress(accounts[0]);
      setSigner(provider.getSigner());
      setIsConnected(true);
      updateBalance(accounts[0], provider);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert(ERRORS.WALLET_CONNECTION);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setSigner(null);
    setIsConnected(false);
    setBalance(null);
  };

  const deposit = async (amount: number) => {
    if (!signer || !address) {
      throw new Error('Wallet not connected');
    }

    try {
      const contract = new ethers.Contract(CONTRACTS.TEST_USDC, TestUSDCABI, signer);
      const decimals = await contract.decimals();
      const depositAmount = ethers.utils.parseUnits(amount.toString(), decimals);
      
      const tx = await contract.mint(address, depositAmount);
      await tx.wait();
      
      // Update balance after successful deposit
      await updateBalance(address, provider!);
    } catch (error) {
      console.error('Deposit failed:', error);
      throw error;
    }
  };

  return (
    <WalletContext.Provider value={{
      isConnected,
      address,
      signer,
      provider,
      balance,
      connectWallet,
      disconnectWallet,
      deposit
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};