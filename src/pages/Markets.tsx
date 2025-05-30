import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import TimelineSelector from '../components/ui/TimelineSelector';
import { events } from '../data/mockData';
import { AlertCircle, ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import TradeModal from '../components/ui/TradeModal';
import { OptionType } from '../types';

const Markets: React.FC = () => {
  const { selectedEvent, selectedTimeline, activeOptions, selectEvent } = useMarket();
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  
  // Separate options into calls and puts
  const calls = activeOptions.filter(opt => opt.type === 'call');
  const puts = activeOptions.filter(opt => opt.type === 'put');
  
  const handleOptionClick = (option: OptionType) => {
    setSelectedOption(option);
    setIsTradeModalOpen(true);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Options Markets</h1>
        <p className="text-muted-foreground">
          Trade options based on conditional event outcomes
        </p>
      </div>
      
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar with events list */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg shadow-md p-4 mb-4">
            <h2 className="text-lg font-semibold text-card-foreground mb-3">Events</h2>
            <div className="space-y-4">
              {events.map((event) => (
                <Card 
                  key={event.id}
                  className={`w-full ${selectedEvent?.id === event.id ? 'border-2 border-primary' : ''}`}
                  hover={true}
                  onClick={() => selectEvent(event.id)}
                >
                  <div className="p-4">
                    <h3 className="font-medium text-card-foreground">{event.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main order book area */}
        <div className="lg:col-span-3">
          {selectedEvent && selectedTimeline ? (
            <>
              <TimelineSelector />
              
              {/* Order Book Header */}
              <div className="bg-card rounded-lg shadow-md p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-card-foreground">
                    Order Book
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
                      {Array.from(new Set([...calls, ...puts].map(opt => opt.strike)))
                        .sort((a, b) => b - a)
                        .map(strike => {
                          const call = calls.find(opt => opt.strike === strike);
                          const put = puts.find(opt => opt.strike === strike);
                          return (
                            <tr key={strike} className="hover:bg-accent/50">
                              {/* Calls side */}
                              <td 
                                colSpan={6} 
                                className="py-2 cursor-pointer hover:bg-accent"
                                onClick={() => call && handleOptionClick(call)}
                              >
                                <div className="flex justify-around">
                                  <span>{call?.collateral || '-'}</span>
                                  <span>32.5%</span>
                                  <span className="text-green-600 dark:text-green-400">
                                    {call?.premium.toFixed(4) || '-'}
                                  </span>
                                  <span className="text-red-600 dark:text-red-400">
                                    {call ? (call.premium * 1.02).toFixed(4) : '-'}
                                  </span>
                                  <span>33.1%</span>
                                  <span>{call?.collateral || '-'}</span>
                                </div>
                              </td>
                              
                              {/* Strike Price */}
                              <td className="py-2 font-medium text-center border-x border-border">
                                {strike.toLocaleString()}
                              </td>
                              
                              {/* Puts side */}
                              <td 
                                colSpan={6}
                                className="py-2 cursor-pointer hover:bg-accent"
                                onClick={() => put && handleOptionClick(put)}
                              >
                                <div className="flex justify-around">
                                  <span>{put?.collateral || '-'}</span>
                                  <span>31.8%</span>
                                  <span className="text-green-600 dark:text-green-400">
                                    {put?.premium.toFixed(4) || '-'}
                                  </span>
                                  <span className="text-red-600 dark:text-red-400">
                                    {put ? (put.premium * 1.02).toFixed(4) : '-'}
                                  </span>
                                  <span>32.4%</span>
                                  <span>{put?.collateral || '-'}</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
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
        </div>
      </div>
      
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