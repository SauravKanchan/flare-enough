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
    timelines: ['rateHike', 'rateHold'],
    resolved: false
  },
  {
    id: 'btc-halving-effect',
    name: 'Bitcoin Halving Price Effect',
    description: 'The effect of the 2024 Bitcoin halving on BTC price after 3 months.',
    date: '2024-07-20T00:00:00Z',
    timelines: ['btcUp', 'btcDown'],
    resolved: false
  }
];

// Mock options data
export const options: OptionType[] = [
  // Election Options - Trump Wins/Loses
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
    timeline: 'trumpLoses',
    strike: 40000,
    premium: 2000,
    expiryDate: '2024-12-31T00:00:00Z',
    type: 'put',
    collateral: 4000,
    description: 'BTC downside protection if Trump loses'
  },
  
  // FED Rate Decision - Hike/Hold
  {
    id: 'option-3',
    eventId: 'fed-rates-dec',
    timeline: 'rateHike',
    strike: 45000,
    premium: 2200,
    expiryDate: '2025-01-15T00:00:00Z',
    type: 'put',
    collateral: 4500,
    description: 'Hedge against rate hike impact'
  },
  {
    id: 'option-4',
    eventId: 'fed-rates-dec',
    timeline: 'rateHold',
    strike: 52000,
    premium: 2800,
    expiryDate: '2025-01-15T00:00:00Z',
    type: 'call',
    collateral: 5200,
    description: 'Upside exposure if rates remain unchanged'
  },
  
  // BTC Halving Effect - Up/Down
  {
    id: 'option-5',
    eventId: 'btc-halving-effect',
    timeline: 'btcUp',
    strike: 55000,
    premium: 3000,
    expiryDate: '2024-10-20T00:00:00Z',
    type: 'call',
    collateral: 5500,
    description: 'Long position on post-halving rally'
  },
  {
    id: 'option-6',
    eventId: 'btc-halving-effect',
    timeline: 'btcDown',
    strike: 38000,
    premium: 1900,
    expiryDate: '2024-10-20T00:00:00Z',
    type: 'put',
    collateral: 3800,
    description: 'Protection against post-halving selloff'
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
    optionId: 'option-3',
    type: 'sell',
    amount: 1.2,
    price: 2200,
    timestamp: '2024-06-01T11:15:22Z'
  },
  {
    id: 'trade-3',
    optionId: 'option-5',
    type: 'buy',
    amount: 0.8,
    price: 3000,
    timestamp: '2024-06-02T09:45:11Z'
  }
];