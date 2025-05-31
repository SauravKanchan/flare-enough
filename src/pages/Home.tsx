import React from 'react';
import { ArrowRight, Clock, LineChart, Lock, RefreshCw, Layers } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { getTimelineLabel } from '../utils/general';
import { useMarket } from '../context/MarketContext';
import { useNotification } from "@blockscout/app-sdk";

type HeaderProps = {
  setActivePage: (page: 'home' | 'markets' | 'events') => void;
};

const Home: React.FC<HeaderProps> = ({ setActivePage }) => {
  const { openTxToast } = useNotification();
  const { events, selectEvent, selectTimeline, loading, error } = useMarket();
  const featuredEvents = events.filter(event => !event.resolved).slice(0, 3);

  const handleTimelineClick = (eventId: string, timeline: string) => {
    selectEvent(eventId);
    // @ts-ignore
    selectTimeline(timeline);
    setActivePage('markets');
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-900 dark:from-black dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                FlareEnough <span className="text-gray-300"></span>
              </h1>
              <p className="text-gray-300 text-lg mb-8 max-w-xl">
                The first options DEX that lets you trade based on conditional real-world events. 
                Place orders on what happens if Trump wins or loses, and only pay if your timeline comes true.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="font-bold"
                  onClick={() => setActivePage('markets')}
                >
                  Start Trading
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-transparent border-white text-white hover:bg-white/10"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-white" />
                    <div className="ml-2">
                      <div className="text-white font-semibold">US Election 2024</div>
                      <div className="text-xs text-gray-300">Ends in 127 days</div>
                    </div>
                  </div>
                  <div className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-white">Active</div>
                </div>
                
                <div className="space-y-2">
                  {/* Trump Wins Timeline */}
                  <div className="text-xs text-gray-300 font-medium">If Trump Wins:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="px-1.5 py-0.5 bg-green-400/20 rounded text-xs text-green-300 font-medium">
                            CALL
                          </div>
                          <div className="ml-1.5 text-sm text-white">$50,000</div>
                        </div>
                        <div className="text-xs text-gray-300">$2,500</div>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="px-1.5 py-0.5 bg-red-400/20 rounded text-xs text-red-300 font-medium">
                            PUT
                          </div>
                          <div className="ml-1.5 text-sm text-white">$50,000</div>
                        </div>
                        <div className="text-xs text-gray-300">$2,300</div>
                      </div>
                    </div>
                  </div>

                  {/* Trump Loses Timeline */}
                  <div className="text-xs text-gray-300 font-medium mt-2">If Trump Loses:</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="px-1.5 py-0.5 bg-green-400/20 rounded text-xs text-green-300 font-medium">
                            CALL
                          </div>
                          <div className="ml-1.5 text-sm text-white">$42,000</div>
                        </div>
                        <div className="text-xs text-gray-300">$2,100</div>
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="px-1.5 py-0.5 bg-red-400/20 rounded text-xs text-red-300 font-medium">
                            PUT
                          </div>
                          <div className="ml-1.5 text-sm text-white">$42,000</div>
                        </div>
                        <div className="text-xs text-gray-300">$2,000</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-3">
                  <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-white text-sm">
                    Explore
                  </button>
                  <button className="px-3 py-1.5 bg-black hover:bg-gray-900 transition-colors rounded-lg text-white text-sm font-medium">
                    Trade Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How it Works */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">
              Trade options with a unique twist: conditional on real-world events happening
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Layers />}
              title="Multiple Timelines"
              description="Trade options across parallel timelines based on different real-world outcomes."
            />
            <FeatureCard 
              icon={<Clock />}
              title="Event-Based Settlement"
              description="Options settle differently based on which real-world event actually occurs."
            />
            <FeatureCard 
              icon={<RefreshCw />}
              title="Refund Mechanism"
              description="If your timeline doesn't happen, get your collateral and premiums back automatically."
            />
          </div>
        </div>
      </section>
      
      {/* Featured Markets */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Featured Markets</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                Explore the most popular event-based options markets currently available
              </p>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center">Loading featured markets...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map(event => (
                <MarketCard 
                  key={event.id}
                  title={event.name}
                  description={event.description}
                  date={new Date(event.date).toLocaleDateString()}
                  active={!event.resolved}
                  timelines={event.timelines}
                  onTimelineClick={(timeline) => handleTimelineClick(event.id, timeline)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-black dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Ready to trade on multiple timelines?</h2>
              <p className="text-gray-300 mt-2">
                Get started with FlareEnough today and explore event-based options trading.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="secondary" 
                size="lg"
                className="font-bold"
                onClick={() => setActivePage('markets')}
              >
                Start Trading
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white/10"
              >
                View Tutorial
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <Card className="p-6">
      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-black dark:text-white mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </Card>
  );
};

type MarketCardProps = {
  title: string;
  description: string;
  date: string;
  active: boolean;
  timelines: string[];
  onTimelineClick: (timeline: string) => void;
};

const MarketCard: React.FC<MarketCardProps> = ({ 
  title, 
  description, 
  date, 
  active,
  timelines,
  onTimelineClick
}) => {
  return (
    <Card hover className="overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-black to-gray-800"></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          {active && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full font-medium">
              Active
            </span>
          )}
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{description}</p>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Clock size={16} className="mr-2" />
          <span>Event date: {date}</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {timelines.map((timeline, index) => (
            <Button 
              key={index}
              variant="primary"
              className="w-full"
              onClick={() => onTimelineClick(timeline)}
            >
              {getTimelineLabel(timeline)}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default Home;