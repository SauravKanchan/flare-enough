import React, { useState } from 'react';
import { TimelineType } from '../../types';
import { useMarket } from '../../context/MarketContext';
import { Clock, ArrowRightLeft, ChevronDown } from 'lucide-react';
import Tooltip from './Tooltip';
import { events } from '../../data/mockData';

const TimelineSelector: React.FC = () => {
  const { selectedEvent, selectedTimeline, selectEvent, selectTimeline } = useMarket();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const getTimelineLabel = (timeline: TimelineType) => {
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

  const getTimelineDescription = (timeline: TimelineType) => {
    switch (timeline) {
      case 'trumpWins': return 'Options that execute only if Trump wins the election';
      case 'trumpLoses': return 'Options that execute only if Trump loses the election';
      case 'rateHike': return 'Options that execute only if FED increases rates';
      case 'rateHold': return 'Options that execute only if FED maintains current rates';
      case 'btcUp': return 'Options that execute only if BTC price increases post-halving';
      case 'btcDown': return 'Options that execute only if BTC price decreases post-halving';
      default: return 'Options for this timeline';
    }
  };
  
  return (
    <div className="bg-card rounded-lg shadow-md p-6 mb-6">
      {/* Event Selector */}
      <div className="mb-6">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-background text-foreground px-4 py-3 rounded-lg shadow-sm flex items-center justify-between border border-input hover:border-ring transition-colors"
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
      </div>

      {selectedEvent && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-card-foreground mb-2 sm:mb-0">
              Timeline Selection
            </h2>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock size={16} className="mr-2" />
              <span>Event Date: {new Date(selectedEvent.date).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="bg-accent/50 rounded-lg p-3 mb-4">
            <div className="flex items-start">
              <ArrowRightLeft size={18} className="text-primary mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Trading on a conditional timeline means your trades only execute if that specific outcome occurs.
                If another outcome happens, all collateral and premiums are automatically refunded.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {selectedEvent.timelines.map((timeline) => (
              <TimelineButton
                key={timeline}
                timeline={timeline}
                label={getTimelineLabel(timeline)}
                description={getTimelineDescription(timeline)}
                isSelected={selectedTimeline === timeline}
                onClick={() => selectTimeline(timeline)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

type TimelineButtonProps = {
  timeline: TimelineType;
  label: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
};

const TimelineButton: React.FC<TimelineButtonProps> = ({
  label,
  description,
  isSelected,
  onClick,
}) => {
  return (
    <Tooltip content={description}>
      <button
        onClick={onClick}
        className={`
          px-4 py-2 rounded-lg font-medium transition-all duration-200
          ${isSelected 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-accent text-accent-foreground hover:bg-accent/80'
          }
        `}
      >
        {label}
      </button>
    </Tooltip>
  );
};

export default TimelineSelector;