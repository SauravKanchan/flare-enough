import React, { useState, useEffect } from 'react';
import { useMarket } from '../context/MarketContext';
import TimelineSelector from '../components/ui/TimelineSelector';
import { TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import Card from '../components/ui/Card';
import TradeModal from '../components/ui/TradeModal';
import { OptionType } from '../types';
import Button from '../components/ui/Button';
import { generateOrderBook } from '../utils/marketDataGenerator';

const Markets: React.FC = () => {
  const { selectedEvent, selectedTimeline, activeOptions, selectEvent, selectTimeline, events, loading, error } = useMarket();
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [orderBook, setOrderBook] = useState(generateOrderBook());
  
  // Regenerate order book when event or timeline changes
  useEffect(() => {
    if (selectedEvent && selectedTimeline) {
      setOrderBook(generateOrderBook());
    }
  }, [selectedEvent, selectedTimeline]);
  
  const handleOptionClick = (option: OptionType) => {
    setSelectedOption(option);
    setIsTradeModalOpen(true);
  };

  const getTimelineLabel = (timeline: string) => {
    switch (timeline) {
      case 'trumpWins': return 'Trump Wins';
      case 'trumpLoses': return 'Trump Loses';
      case 'rateHike': return 'Rate Hike';
      case 'rateHold': return 'Rate Hold';
      case 'btcUp': return 'BTC Up';
      case 'btcDown': return 'BTC Down';
      default: return timeline;
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
      {/* Event Selector and Timeline Buttons */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Event Selector Dropdown */}
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
                    <div className="font-medium text-card-foreground">{event.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Timeline Buttons */}
          {selectedEvent && (
            <div className="flex gap-2">
              {selectedEvent.timelines.map((timeline) => (
                <Button
                  key={timeline}
                  variant={selectedTimeline === timeline ? 'primary' : 'outline'}
                  onClick={() => selectTimeline(timeline)}
                  className="whitespace-nowrap"
                >
                  {getTimelineLabel(timeline)}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Book */}
      {selectedEvent && selectedTimeline ? (
        <div className="space-y-6">
          <div className="bg-card rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-card-foreground">
                BTC/USDC order book expiring in 3 weeks.
              </h2>
            </div>
            
            {/* Order Book Table */}
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
                      {/* Calls side */}
                      <td className="py-2 text-center">{row.call.size.toFixed(1)}</td>
                      <td className="py-2 text-center">{row.call.iv.toFixed(1)}%</td>
                      <td className="py-2 text-center text-green-600 dark:text-green-400">
                        {row.call.bid.toFixed(4)}
                      </td>
                      <td className="py-2 text-center text-red-600 dark:text-red-400">
                        {row.call.ask.toFixed(4)}
                      </td>
                      <td className="py-2 text-center">{row.call.ivAsk.toFixed(1)}%</td>
                      <td className="py-2 text-center">{row.call.askSize.toFixed(1)}</td>
                      
                      {/* Strike Price */}
                      <td className="py-2 font-medium text-center border-x border-border">
                        {row.strike.toLocaleString()}
                      </td>
                      
                      {/* Puts side */}
                      <td className="py-2 text-center">{row.put.size.toFixed(1)}</td>
                      <td className="py-2 text-center">{row.put.iv.toFixed(1)}%</td>
                      <td className="py-2 text-center text-green-600 dark:text-green-400">
                        {row.put.bid.toFixed(4)}
                      </td>
                      <td className="py-2 text-center text-red-600 dark:text-red-400">
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

          {/* Conditional Trading Info */}
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
      
      {/* Trade Modal */}
      {selectedOption && (
        <TradeModal
          option={selectedOption}
          isOpen={isTradeModalOpen}
          onClose={() => {
            setIsTradeModalOpen(false);
            setSelectedOption(null);
          }}
        />
      )}
    </div>
  );
};

export default Markets;