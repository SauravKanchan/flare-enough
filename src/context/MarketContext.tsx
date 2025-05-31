import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EventType, OptionType, TimelineType } from '../types';
import MarketService from '../services/MarketService';

type MarketContextType = {
  selectedEvent: EventType | null;
  selectedTimeline: TimelineType | null;
  activeOptions: OptionType[];
  selectEvent: (eventId: string | null) => void;
  selectTimeline: (timeline: TimelineType | null) => void;
};

const MarketContext = createContext<MarketContextType | undefined>(undefined);

export const MarketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState<TimelineType | null>(null);
  const [events, setEvents] = useState<EventType[]>([]);
  const [options, setOptions] = useState<OptionType[]>([]);

  useEffect(() => {
    const loadMarketData = async () => {
      const marketService = MarketService.getInstance();
      const eventsData = await marketService.getEvents();
      const optionsData = await marketService.getOptions();
      setEvents(eventsData);
      setOptions(optionsData);
    };

    loadMarketData();
  }, []);

  const selectEvent = (eventId: string | null) => {
    if (!eventId) {
      setSelectedEvent(null);
      setSelectedTimeline(null);
      return;
    }
    
    const event = events.find(e => e.id === eventId) || null;
    setSelectedEvent(event);
    
    // If event has timelines, select the first one by default
    if (event && event.timelines.length > 0) {
      setSelectedTimeline(event.timelines[0]);
    } else {
      setSelectedTimeline(null);
    }
  };

  const selectTimeline = (timeline: TimelineType | null) => {
    setSelectedTimeline(timeline);
  };

  // Filter options based on selected event and timeline
  const activeOptions = options.filter(option => 
    selectedEvent && 
    option.eventId === selectedEvent.id && 
    option.timeline === selectedTimeline
  );

  return (
    <MarketContext.Provider value={{
      selectedEvent,
      selectedTimeline,
      activeOptions,
      selectEvent,
      selectTimeline
    }}>
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = (): MarketContextType => {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};