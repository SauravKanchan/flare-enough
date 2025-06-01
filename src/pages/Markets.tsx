import React, { useState, useEffect } from 'react';
import { useMarket } from '../context/MarketContext';
import { useWallet } from '../context/WalletContext';
import TimelineSelector from '../components/ui/TimelineSelector';
import { TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import Card from '../components/ui/Card';
import TradeModal from '../components/ui/TradeModal';
import { OptionType } from '../types';
import Button from '../components/ui/Button';
import { generateOrderBook } from '../utils/marketDataGenerator';
import { getOptionPrice } from '../services/BlockScholesService';
import { getTimelineLabel } from '../utils/general';

const Markets: React.FC = () => {
  const { selectedEvent, selectedTimeline, activeOptions, selectEvent, selectTimeline, events, loading, error } = useMarket();
  const { isConnected, signer, connectWallet } = useWallet();
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [orderBook, setOrderBook] = useState(generateOrderBook());
  const [tradeType, setTradeType] = useState<'call' | 'put'>('call');
  const [tradeAction, setTradeAction] = useState<'buy' | 'sell'>('buy');
  
  useEffect(() => {
    if (selectedEvent && selectedTimeline) {
      setOrderBook(generateOrderBook());
    }
  }, [selectedEvent, selectedTimeline]);

  const handleOptionClick = async (strike: number, type: 'call' | 'put', action: 'buy' | 'sell') => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    setTradeType(type);
    setTradeAction(action);
    
    try {
      const premium = await getOptionPrice(strike, type === 'call' ? 'C' : 'P');
      
      const option: OptionType = {
        id: `${type}-${strike}`,
        eventId: selectedEvent?.id || '',
        timeline: selectedTimeline || '',
        strike: strike,
        premium: premium,
        expiryDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        type: type,
        collateral: strike * 0.1,
        description: `${type.toUpperCase()} option at strike $${strike.toLocaleString()}`
      };
      
      setSelectedOption(option);
      setIsTradeModalOpen(true);
    } catch (error) {
      console.error('Error fetching option premium:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">Loading markets data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-card text-card-foreground px-4 py-3 rounded-lg shadow-md flex items-center justify-between border border-border hover:border-primary transition-colors"
            >
              <span className="font-medium">
                {selectedEvent ? selectedEvent.name : 'Select an Event'}
              </span>
              <ChevronDown 
                size={20} 
                className={`text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-lg shadow-lg">
                {events.map((event) => (
                  <button
                    key={event.id}
                    className={`w-full px-4 py-3 text-left hover:bg-accent transition-colors ${
                      selectedEvent?.id === event.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => {
                      selectEvent(event.id);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-card-foreground">{event.name}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                      </div>
                      {event.resolved && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full">
                          Resolved
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedEvent && (
            <div className="flex gap-2">
              {selectedEvent.timelines.map((timeline) => {
                const isWinningTimeline = selectedEvent.resolved && selectedEvent.outcome === timeline;
                const isLosingTimeline = selectedEvent.resolved && selectedEvent.outcome !== timeline;
                
                return (
                  <div key={timeline} className="relative">
                    <Button
                      variant={selectedTimeline === timeline ? 'primary' : 'outline'}
                      onClick={() => !isLosingTimeline && selectTimeline(timeline)}
                      className={`whitespace-nowrap ${isLosingTimeline ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isLosingTimeline}
                    >
                      {getTimelineLabel(timeline)}
                    </Button>
                    {isWinningTimeline && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
                    )}
                    {isLosingTimeline && (
                      <div className="absolute top-full left-0 right-0 mt-1 text-xs text-center text-red-500">
                        Timeline invalid
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedEvent && selectedTimeline ? (
        <div className="space-y-6">
          <div className="bg-card rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-card-foreground">
                BTC/USDC order book expiring in 3 weeks
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted-foreground">
                    <th colSpan={6} className="text-center pb-2 border-b border-border">
                      <div className="flex items-center justify-center text-green-600 dark:text-green-400">
                        <TrendingUp size={16} className="mr-1" />
                        Calls
                      </div>
                    </th>
                    <th className="px-2 pb-2 border-b border-border">Strike</th>
                    <th colSpan={6} className="text-center pb-2 border-b border-border">
                      <div className="flex items-center justify-center text-red-600 dark:text-red-400">
                        <TrendingDown size={16} className="mr-1" />
                        Puts
                      </div>
                    </th>
                  </tr>
                  <tr className="text-xs text-muted-foreground">
                    <th className="py-2">Size</th>
                    <th className="py-2">IV</th>
                    <th className="py-2">Bid</th>
                    <th className="py-2">Ask</th>
                    <th className="py-2">IV Ask</th>
                    <th className="py-2">Size</th>
                    <th className="py-2 font-bold">Price</th>
                    <th className="py-2">Size</th>
                    <th className="py-2">IV</th>
                    <th className="py-2">Bid</th>
                    <th className="py-2">Ask</th>
                    <th className="py-2">IV Ask</th>
                    <th className="py-2">Size</th>
                  </tr>
                </thead>
                <tbody>
                  {orderBook.map((row, index) => (
                    <tr key={index} className="hover:bg-accent/50">
                      <td className="py-2 text-center">{row.call.size.toFixed(1)}</td>
                      <td className="py-2 text-center">{row.call.iv.toFixed(1)}%</td>
                      <td 
                        className="py-2 text-center text-green-600 dark:text-green-400 cursor-pointer hover:underline"
                        onClick={() => handleOptionClick(row.strike, 'call', 'sell')}
                      >
                        {row.call.bid.toFixed(4)}
                      </td>
                      <td 
                        className="py-2 text-center text-red-600 dark:text-red-400 cursor-pointer hover:underline"
                        onClick={() => handleOptionClick(row.strike, 'call', 'buy')}
                      >
                        {row.call.ask.toFixed(4)}
                      </td>
                      <td className="py-2 text-center">{row.call.ivAsk.toFixed(1)}%</td>
                      <td className="py-2 text-center">{row.call.askSize.toFixed(1)}</td>
                      
                      <td className="py-2 font-medium text-center border-x border-border">
                        {row.strike.toLocaleString()}
                      </td>
                      
                      <td className="py-2 text-center">{row.put.size.toFixed(1)}</td>
                      <td className="py-2 text-center">{row.put.iv.toFixed(1)}%</td>
                      <td 
                        className="py-2 text-center text-green-600 dark:text-green-400 cursor-pointer hover:underline"
                        onClick={() => handleOptionClick(row.strike, 'put', 'sell')}
                      >
                        {row.put.bid.toFixed(4)}
                      </td>
                      <td 
                        className="py-2 text-center text-red-600 dark:text-red-400 cursor-pointer hover:underline"
                        onClick={() => handleOptionClick(row.strike, 'put', 'buy')}
                      >
                        {row.put.ask.toFixed(4)}
                      </td>
                      <td className="py-2 text-center">{row.put.ivAsk.toFixed(1)}%</td>
                      <td className="py-2 text-center">{row.put.askSize.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4">
            <p className="text-sm text-indigo-700 dark:text-indigo-300">
              Trading on a conditional timeline means your trades only execute if that specific outcome occurs.
              If another outcome happens, all collateral and premiums are automatically refunded.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow-md p-8 text-center">
          <h3 className="text-xl font-semibold text-card-foreground mb-4">
            Welcome to FlareEnough Markets
          </h3>
          <p className="text-muted-foreground">
            Select an event and timeline to view the order book
          </p>
        </div>
      )}
      
      {selectedOption && (
        <TradeModal
          option={selectedOption}
          isOpen={isTradeModalOpen}
          onClose={() => {
            setIsTradeModalOpen(false);
            setSelectedOption(null);
          }}
          initialSide={tradeAction}
          signer={signer}
        />
      )}
    </div>
  );
};

export default Markets;