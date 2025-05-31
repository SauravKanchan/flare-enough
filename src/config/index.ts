// Network Configuration
export const NETWORK = {
  COSTON: {
    chainId: '114',
    name: 'Coston',
    rpcUrl: 'https://coston-api.flare.network/ext/bc/C/rpc',
    blockExplorer: 'https://coston-explorer.flare.network',
    currency: {
      name: 'Coston Flare',
      symbol: 'CFLR',
      decimals: 18
    }
  }
};

// Contract Addresses
export const CONTRACTS = {
  FLARE_ENOUGH: '0x1234567890123456789012345678901234567890', // Replace with actual address
  TEST_USDC: '0x0987654321098765432109876543210987654321',    // Replace with actual address
  CLEARING_HOUSE: '0x2468135790246813579024681357902468135790' // Replace with actual address
};

// API Configuration
export const API = {
  BASE_URL: 'https://api.flare-enough.com', // Replace with actual API URL
  TIMEOUT: 30000 // 30 seconds
};

// UI Configuration
export const UI = {
  MAX_DECIMALS: 6,
  REFRESH_INTERVAL: 30000, // 30 seconds
  DATE_FORMAT: 'yyyy-MM-dd HH:mm:ss',
  THEME: {
    light: {
      primary: '#1a1a1a',
      secondary: '#4a4a4a'
    },
    dark: {
      primary: '#ffffff',
      secondary: '#a0a0a0'
    }
  }
};

// Feature Flags
export const FEATURES = {
  ENABLE_TESTNET: true,
  ENABLE_TRADING: true,
  ENABLE_NOTIFICATIONS: true
};

// Error Messages
export const ERRORS = {
  WALLET_CONNECTION: 'Failed to connect wallet. Please try again.',
  NETWORK_SWITCH: 'Please switch to the Coston network to continue.',
  INSUFFICIENT_BALANCE: 'Insufficient balance to complete the transaction.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.'
};

// Transaction Settings
export const TRANSACTION = {
  GAS_LIMIT_MULTIPLIER: 1.2,
  MAX_SLIPPAGE: 0.5, // 0.5%
  CONFIRMATION_BLOCKS: 2
};