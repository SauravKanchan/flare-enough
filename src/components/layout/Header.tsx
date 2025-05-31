import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useWallet } from '../../context/WalletContext';
import { Menu, X, Sun, Moon, History } from 'lucide-react';
import Button from '../ui/Button';
import Dialog from '../ui/Dialog';

type HeaderProps = {
  setActivePage: (page: 'home' | 'markets' | 'events') => void;
  activePage: 'home' | 'markets' | 'events';
};

const Header: React.FC<HeaderProps> = ({ setActivePage, activePage }) => {
  const { theme, toggleTheme } = useTheme();
  const { isConnected, address, connectWallet, disconnectWallet } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleWalletClick = () => {
    if (isConnected) {
      setShowDisconnectDialog(true);
    } else {
      connectWallet();
    }
  };

  const handleTransactionHistory = () => {
    console.log('Viewing transaction history for address:', address);
  };
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-black to-gray-800 flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white cursor-pointer" onClick={() => setActivePage('home')}>
                FlareEnough
              </span>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 ml-10">
            <NavItem 
              label="Home" 
              isActive={activePage === 'home'} 
              onClick={() => setActivePage('home')}
            />
            <NavItem 
              label="Markets" 
              isActive={activePage === 'markets'} 
              onClick={() => setActivePage('markets')}
            />
            <NavItem 
              label="Events" 
              isActive={activePage === 'events'} 
              onClick={() => setActivePage('events')}
            />
          </nav>
          
          {/* Right side buttons */}
          <div className="flex items-center">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Transaction History button - only shown when connected */}
            {isConnected && (
              <button
                onClick={handleTransactionHistory}
                className="ml-4 p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Transaction History"
              >
                <History size={20} />
              </button>
            )}
            
            {/* Connect wallet button */}
            <Button 
              className="ml-4 hidden sm:block"
              onClick={handleWalletClick}
            >
              {isConnected ? formatAddress(address!) : 'Connect Wallet'}
            </Button>
            
            {/* Mobile menu button */}
            <div className="md:hidden ml-4">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-4 space-y-1 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
            <MobileNavItem 
              label="Home" 
              isActive={activePage === 'home'} 
              onClick={() => {
                setActivePage('home');
                setMobileMenuOpen(false);
              }}
            />
            <MobileNavItem 
              label="Markets" 
              isActive={activePage === 'markets'} 
              onClick={() => {
                setActivePage('markets');
                setMobileMenuOpen(false);
              }}
            />
            <MobileNavItem 
              label="Events" 
              isActive={activePage === 'events'} 
              onClick={() => {
                setActivePage('events');
                setMobileMenuOpen(false);
              }}
            />
            {isConnected && (
              <MobileNavItem 
                label="Transaction History" 
                isActive={false} 
                onClick={() => {
                  handleTransactionHistory();
                  setMobileMenuOpen(false);
                }}
              />
            )}
            <div className="pt-4">
              <Button 
                className="w-full"
                onClick={handleWalletClick}
              >
                {isConnected ? formatAddress(address!) : 'Connect Wallet'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Disconnect Dialog */}
      <Dialog
        isOpen={showDisconnectDialog}
        onClose={() => setShowDisconnectDialog(false)}
        onConfirm={disconnectWallet}
        title="Disconnect Wallet"
        description="Are you sure you want to disconnect your wallet?"
        confirmText="Disconnect"
        cancelText="Cancel"
      />
    </header>
  );
};

type NavItemProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
};

const NavItem: React.FC<NavItemProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
        isActive 
          ? 'text-primary dark:text-primary' 
          : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
      }`}
    >
      {label}
    </button>
  );
};

const MobileNavItem: React.FC<NavItemProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`block px-3 py-2 text-base font-medium rounded-md w-full text-left ${
        isActive 
          ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary' 
          : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
      }`}
    >
      {label}
    </button>
  );
};

export default Header;