import React from 'react';
import { ArrowRight, Clock, LineChart, Lock, RefreshCw, Layers } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

type HeaderProps = {
  setActivePage: (page: 'home' | 'markets' | 'events') => void;
};

const Home: React.FC<HeaderProps> = ({ setActivePage }) => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-900 dark:to-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Trade Options Across <span className="text-teal-300">Multiple Timelines</span>
              </h1>
              <p className="text-indigo-100 text-lg mb-8 max-w-xl">
                The first options DEX that lets you trade based on conditional real-world events. 
                Place bets on what happens if Trump wins or loses, and only pay if your timeline comes true.
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
            <div className="md:w-1/2 flex justify-center">
              <div className="w-full max-w-md relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-indigo-500 rounded-xl transform rotate-3 scale-105 opacity-20 blur-lg"></div>
                <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-3">
                        <div className="text-white font-semibold">US Election 2024</div>
                        <div className="text-xs text-indigo-200">Ends in 127 days</div>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-white/10 rounded-full text-xs text-white">Active</div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="px-2 py-1 bg-green-400/20 rounded text-xs text-green-300 font-medium">
                            CALL
                          </div>
                          <div className="ml-2 text-white">$50,000</div>
                        </div>
                        <div className="text-sm text-indigo-200">
                          If Trump Wins
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="px-2 py-1 bg-red-400/20 rounded text-xs text-red-300 font-medium">
                            PUT
                          </div>
                          <div className="ml-2 text-white">$42,000</div>
                        </div>
                        <div className="text-sm text-indigo-200">
                          If Trump Loses
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors rounded-lg text-white text-sm">
                      Explore
                    </button>
                    <button className="px-4 py-2 bg-teal-500 hover:bg-teal-600 transition-colors rounded-lg text-white text-sm font-medium">
                      Trade Now
                    </button>
                  </div>
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MarketCard 
              title="US Presidential Election 2024"
              description="Trump vs. Democratic Candidate"
              date="Nov 5, 2024"
              active={true}
            />
            <MarketCard 
              title="FED Interest Rate Decision"
              description="Rate hike or hold in December"
              date="Dec 15, 2024"
              active={true}
            />
            <MarketCard 
              title="Bitcoin Halving Effect"
              description="BTC price 3 months after halving"
              date="Jul 20, 2024"
              active={true}
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-indigo-600 dark:bg-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Ready to trade on multiple timelines?</h2>
              <p className="text-indigo-100 mt-2">
                Get started with TimelineDEX today and explore event-based options trading.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="secondary" 
                size="lg"
                className="font-bold"
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
      <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
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
};

const MarketCard: React.FC<MarketCardProps> = ({ title, description, date, active }) => {
  return (
    <Card hover className="overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-indigo-500 to-teal-400"></div>
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
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Timeline 1</span>
            <span className="font-medium text-gray-900 dark:text-white">Trump Wins</span>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Timeline 2</span>
            <span className="font-medium text-gray-900 dark:text-white">Trump Loses</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="primary"
            className="w-full"
            onClick={() => window.location.href = '/markets?timeline=trumpWins'}
          >
            Trump Wins
          </Button>
          <Button 
            variant="primary"
            className="w-full"
            onClick={() => window.location.href = '/markets?timeline=trumpLoses'}
          >
            Trump Loses
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Home;