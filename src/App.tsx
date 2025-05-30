import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { MarketProvider } from './context/MarketContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Markets from './pages/Markets';
import Events from './pages/Events';

function App() {
  const [activePage, setActivePage] = useState<'home' | 'markets' | 'events'>('home');
  
  return (
    <ThemeProvider>
      <MarketProvider>
        <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
          <Header activePage={activePage} setActivePage={setActivePage} />
          
          <main className="flex-grow">
            {activePage === 'home' && <Home />}
            {activePage === 'markets' && <Markets />}
            {activePage === 'events' && <Events />}
          </main>
          
          <Footer />
        </div>
      </MarketProvider>
    </ThemeProvider>
  );
}

export default App;