import { EventType, OptionType, TradeType } from '../types';

// Mock events data
export const events: EventType[] = [
  {
    id: 'election-2024',
    name: 'US Presidential Election 2024',
    description: 'The outcome of the 2024 US Presidential Election between candidates.',
    date: '2024-11-05T00:00:00Z',
    timelines: ['trumpWins', 'trumpLoses'],
    resolved: false
  },
  {
    id: 'fed-rates-dec',
    name: 'FED Interest Rate Decision',
    description: 'The Federal Reserve decision on interest rates in December 2024.',
    date: '2024-12-15T00:00:00Z',
    timelines: ['trumpWins', 'trumpLoses'],
    resolved: false
  },
  {
    id: 'btc-halving-effect',
    name: 'Bitcoin Halving Price Effect',
    description: 'The effect of the 2024 Bitcoin halving on BTC price after 3 months.',
    date: '2024-07-20T00:00:00Z',
    timelines: ['trumpWins', 'trumpLoses'],
    resolved: false
  }
];

// Mock options data
export const options: OptionType[] = [
  // Trump Wins Timeline - CALL Options
  {
    id: 'option-1',
    eventId: 'election-2024',
    timeline: 'trumpWins',
    strike: 50000,
    premium: 2500,
    expiryDate: '2024-12-31T00:00:00Z',
    type: 'call',
    collateral: 5000,
    description: 'BTC to 50k if Trump wins - bullish momentum'
  },
  {
    id: 'option-2',
    eventId: 'election-2024',
    timeline: 'trumpWins',
    strike: 60000,
    premium: 3200,
    expiryDate: '2025-01-31T00:00:00Z',
    type: 'call',
    collateral: 6000,
    description: 'BTC to 60k if Trump wins - strong rally'
  },
  
  // Trump Wins Timeline - PUT Options
  {
    id: 'option-3',
    eventId: 'election-2024',
    timeline: 'trumpWins',
    strike: 45000,
    premium: 1800,
    expiryDate: '2024-12-31T00:00:00Z',
    type: 'put',
    collateral: 4500,
    description: 'BTC downside protection if Trump wins'
  },
  {
    id: 'option-4',
    eventId: 'election-2024',
    timeline: 'trumpWins',
    strike: 42000,
    premium: 1600,
    expiryDate: '2025-01-31T00:00:00Z',
    type: 'put',
    collateral: 4200,
    description: 'Long-term hedge if Trump wins'
  },
  
  // Trump Loses Timeline - CALL Options
  {
    id: 'option-5',
    eventId: 'election-2024',
    timeline: 'trumpLoses',
    strike: 40000,
    premium: 2000,
    expiryDate: '2024-12-31T00:00:00Z',
    type: 'call',
    collateral: 4000,
    description: 'BTC recovery if Trump loses'
  },
  {
    id: 'option-6',
    eventId: 'election-2024',
    timeline: 'trumpLoses',
    strike: 45000,
    premium: 2400,
    expiryDate: '2025-01-31T00:00:00Z',
    type: 'call',
    collateral: 4500,
    description: 'Long-term upside if Trump loses'
  },
  
  // Trump Loses Timeline - PUT Options
  {
    id: 'option-7',
    eventId: 'election-2024',
    timeline: 'trumpLoses',
    strike: 35000,
    premium: 1500,
    expiryDate: '2024-12-31T00:00:00Z',
    type: 'put',
    collateral: 3500,
    description: 'Bearish position if Trump loses'
  },
  {
    id: 'option-8',
    eventId: 'election-2024',
    timeline: 'trumpLoses',
    strike: 32000,
    premium: 1400,
    expiryDate: '2025-01-31T00:00:00Z',
    type: 'put',
    collateral: 3200,
    description: 'Extended downside protection if Trump loses'
  },
  
  // FED Rate Decision Options - Trump Wins
  {
    id: 'option-9',
    eventId: 'fed-rates-dec',
    timeline: 'trumpWins',
    strike: 55000,
    premium: 2700,
    expiryDate: '2025-01-15T00:00:00Z',
    type: 'call',
    collateral: 5500,
    description: 'Rate decision upside with Trump win'
  },
  {
    id: 'option-10',
    eventId: 'fed-rates-dec',
    timeline: 'trumpWins',
    strike: 48000,
    premium: 2200,
    expiryDate: '2025-01-15T00:00:00Z',
    type: 'put',
    collateral: 4800,
    description: 'Rate decision hedge with Trump win'
  },
  
  // FED Rate Decision Options - Trump Loses
  {
    id: 'option-11',
    eventId: 'fed-rates-dec',
    timeline: 'trumpLoses',
    strike: 42000,
    premium: 2100,
    expiryDate: '2025-01-15T00:00:00Z',
    type: 'call',
    collateral: 4200,
    description: 'Rate decision upside with Trump loss'
  },
  {
    id: 'option-12',
    eventId: 'fed-rates-dec',
    timeline: 'trumpLoses',
    strike: 36000,
    premium: 1700,
    expiryDate: '2025-01-15T00:00:00Z',
    type: 'put',
    collateral: 3600,
    description: 'Rate decision hedge with Trump loss'
  }
];

// Mock trades data
export const trades: TradeType[] = [
  {
    id: 'trade-1',
    optionId: 'option-1',
    type: 'buy',
    amount: 0.5,
    price: 2500,
    timestamp: '2024-06-01T10:23:45Z'
  },
  {
    id: 'trade-2',
    optionId: 'option-5',
    type: 'sell',
    amount: 1.2,
    price: 2000,
    timestamp: '2024-06-01T11:15:22Z'
  },
  {
    id: 'trade-3',
    optionId: 'option-3',
    type: 'buy',
    amount: 0.8,
    price: 1800,
    timestamp: '2024-06-02T09:45:11Z'
  }
];