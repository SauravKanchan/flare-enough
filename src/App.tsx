import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { MarketProvider } from './context/MarketContext';
import { WalletProvider } from './context/WalletContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Markets from './pages/Markets';
import Events from './pages/Events';
import { NotificationProvider } from "@blockscout/app-sdk";
import { TransactionPopupProvider } from "@blockscout/app-sdk";


function App() {
  const [activePage, setActivePage] = useState<'home' | 'markets' | 'events'>('home');
  
  return (
      <React.StrictMode>

<TransactionPopupProvider>
  <NotificationProvider>
    <ThemeProvider>
      <WalletProvider>
        <MarketProvider>
          <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            <Header activePage={activePage} setActivePage={setActivePage} />
            
            <main className="flex-grow">
              {activePage === 'home' && <Home setActivePage={setActivePage} />}
              {activePage === 'markets' && <Markets />}
              {activePage === 'events' && <Events />}
            </main>
            
            <Footer />
          </div>
        </MarketProvider>
      </WalletProvider>
    </ThemeProvider>
  </NotificationProvider>
  </TransactionPopupProvider>
  </React.StrictMode>

  );
}

export default App;