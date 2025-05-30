export type TimelineType = 'trumpWins' | 'trumpLoses';

export type EventType = {
  id: string;
  name: string;
  description: string;
  date: string; // ISO date string
  timelines: TimelineType[];
  resolved: boolean;
  outcome?: TimelineType;
};

export type OptionType = {
  id: string;
  eventId: string;
  timeline: TimelineType;
  strike: number;
  premium: number;
  expiryDate: string; // ISO date string
  type: 'call' | 'put';
  collateral: number;
  description: string;
};

export type TradeType = {
  id: string;
  optionId: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: string;
};

export type ThemeType = 'light' | 'dark';