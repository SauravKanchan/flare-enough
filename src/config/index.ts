// Network Configuration
export const NETWORK = {
  COSTON: {
    chainId: '114',
    name: 'Coston',
    rpcUrl: 'https://coston2-api.flare.network/ext/C/rpc',
    blockExplorer: 'https://coston-explorer.flare.network',
    currency: {
      name: 'Coston2 Flare',
      symbol: 'CFLR',
      decimals: 18
    }
  }
};

// Contract Addresses
export const CONTRACTS = {
  FLARE_ENOUGH: '0x5a4BA81fea443D4E479D86c44b592F7654241C56', // Replace with actual address
  TEST_USDC: '0x34Bef85C3392E6ca7fedDb23b0CA91Ca4f77F495',    // Replace with actual address
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