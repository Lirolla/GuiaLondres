
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import PublicHome from './views/PublicHome';
import AdminPanel from './views/AdminPanel';
import { AppState } from './types';
import { INITIAL_STATE } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('guia_londres_awards_state');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('guia_londres_awards_state', JSON.stringify(state));
  }, [state]);

  const updateState = (newState: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<PublicHome state={state} updateState={updateState} />} />
            <Route path="/admin" element={<AdminPanel state={state} updateState={updateState} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

const Navigation: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold-gradient rounded-full flex items-center justify-center text-zinc-950 font-bold">G</div>
          <span className="text-xl font-bold font-awards tracking-wider gold-gradient">GUIA LONDRES AWARDS</span>
        </Link>
        <div className="flex gap-6 items-center">
          <Link to="/" className="text-sm hover:text-amber-400 transition-colors">Home</Link>
          <Link 
            to={isAdmin ? "/" : "/admin"} 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isAdmin 
              ? "bg-zinc-800 text-white hover:bg-zinc-700" 
              : "bg-gold-gradient text-zinc-950 hover:opacity-90 shadow-[0_0_15px_rgba(191,149,63,0.3)]"
            }`}
          >
            {isAdmin ? "Sair do Admin" : "Área do Admin"}
          </Link>
        </div>
      </div>
    </nav>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-zinc-950 border-t border-zinc-800 py-12">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <div className="text-2xl font-bold font-awards gold-gradient mb-4">GUIA LONDRES AWARDS</div>
      <p className="text-zinc-500 max-w-md mx-auto mb-8 text-sm">
        Celebrating community excellence and achievements within the London diaspora.
      </p>
      <div className="flex justify-center gap-8 mb-8">
        <a href="#" className="text-zinc-400 hover:text-amber-400">Instagram</a>
        <a href="#" className="text-zinc-400 hover:text-amber-400">YouTube</a>
        <a href="#" className="text-zinc-400 hover:text-amber-400">Facebook</a>
      </div>
      <div className="text-xs text-zinc-600">
        &copy; 2024 Guia Londres. All rights reserved.
      </div>
    </div>
  </footer>
);

export default App;
