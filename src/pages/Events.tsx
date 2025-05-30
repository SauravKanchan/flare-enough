import React from 'react';
import Card from '../components/ui/Card';
import { EventType } from '../types';
import { events } from '../data/mockData';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';
import { formatDistanceToNow } from '../utils/formatters';
import { getTimelineLabel } from '../utils/general';
import { useMarket } from '../context/MarketContext';

type HeaderProps = {
  setActivePage: (page: 'home' | 'markets' | 'events') => void;
};

const Events: React.FC<HeaderProps> = ({ setActivePage }) => {
  const { selectEvent, selectTimeline } = useMarket();
  const activeEvents = events.filter(event => !event.resolved);
  const resolvedEvents = events.filter(event => event.resolved);

  const handleTimelineClick = (eventId: string, timeline: string) => {
    selectEvent(eventId);
    selectTimeline(timeline);
    setActivePage('markets');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Events</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Browse and explore the conditional events that determine option outcomes
        </p>
      </div>
      
      {/* Info box */}
      <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-lg p-4 mb-8">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-indigo-800 dark:text-indigo-200 font-medium mb-1">How Events Work</h3>
            <p className="text-indigo-700 dark:text-indigo-300 text-sm">
              FlareEnough options are conditional on real-world events. Each event creates multiple possible timelines.
              When an event resolves, only the options on the correct timeline will be executed - all others are refunded.
            </p>
          </div>
        </div>
      </div>
      
      {/* Active Events */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Active Events</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeEvents.map(event => (
            <MarketCard 
              key={event.id}
              event={event}
              onTimelineClick={handleTimelineClick}
            />
          ))}
        </div>
      </section>
      
      {/* Resolved Events */}
      {resolvedEvents.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Resolved Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resolvedEvents.map(event => (
              <MarketCard 
                key={event.id}
                event={event}
                onTimelineClick={handleTimelineClick}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

type MarketCardProps = {
  event: EventType;
  onTimelineClick: (eventId: string, timeline: string) => void;
};

const MarketCard: React.FC<MarketCardProps> = ({ 
  event,
  onTimelineClick
}) => {
  const eventDate = new Date(event.date);
  const timeToEvent = formatDistanceToNow(eventDate);
  
  return (
    <Card hover className="overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-black to-gray-800"></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{event.name}</h3>
          {event.resolved ? (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full font-medium">
              Resolved
            </span>
          ) : (
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs rounded-full font-medium">
              Active
            </span>
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{event.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Clock size={16} className="mr-2" />
          <span>{timeToEvent}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Calendar size={16} className="mr-2" />
          <span>Event date: {eventDate.toLocaleDateString()}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {event.timelines.map((timeline, index) => (
            <Button
              key={index}
              variant={event.resolved && event.outcome === timeline ? 'primary' : 'outline'}
              onClick={() => onTimelineClick(event.id, timeline)}
              className="w-full"
              disabled={event.resolved && event.outcome !== timeline}
            >
              {getTimelineLabel(timeline)}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default Events;