
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import PublicHome from './views/PublicHome';
import AdminPanel from './views/AdminPanel';
import StudioPage from './views/StudioPage';
import VideosPage from './views/VideosPage';
import PartnersPage from './views/PartnersPage';
import { LoginPage } from './views/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppState } from './types';
import { INITIAL_STATE } from './constants';

const AppContent: React.FC = () => {
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
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<PublicHome state={state} updateState={updateState} />} />
          <Route path="/studio" element={<StudioPage state={state} updateState={updateState} />} />
          <Route path="/videos" element={<VideosPage state={state} />} />
          <Route path="/parceiros" element={<PartnersPage state={state} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminPanel state={state} updateState={updateState} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const Navigation: React.FC = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Não mostrar navegação na página de login
  if (isLogin) return null;

  // Fechar menu ao mudar de rota
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold-gradient rounded-full flex items-center justify-center text-zinc-950 font-bold text-sm">G</div>
          <span className="text-base md:text-xl font-bold font-awards tracking-wider gold-gradient">GUIA LONDRES AWARDS</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="text-sm hover:text-amber-400 transition-colors">Home</Link>
          <Link to="/studio" className="text-sm hover:text-amber-400 transition-colors">Estúdio</Link>
          <Link to="/videos" className="text-sm hover:text-amber-400 transition-colors">Vídeos</Link>
          <Link to="/parceiros" className="text-sm hover:text-amber-400 transition-colors">Parceiros</Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-300 hover:text-amber-400 transition-colors"
          aria-label="Menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-zinc-950/98 border-t border-zinc-800 backdrop-blur-lg">
          <div className="px-4 py-4 space-y-3">
            <Link 
              to="/" 
              className="block py-2 px-4 text-sm hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/studio" 
              className="block py-2 px-4 text-sm hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Estúdio
            </Link>
            <Link 
              to="/videos" 
              className="block py-2 px-4 text-sm hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Vídeos
            </Link>
            <Link 
              to="/parceiros" 
              className="block py-2 px-4 text-sm hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Parceiros
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const isLogin = location.pathname === '/login';
  const isAdmin = location.pathname.startsWith('/admin');
  
  // Não mostrar footer na página de login
  if (isLogin) return null;

  const handleAdminClick = () => {
    if (isAdmin) {
      logout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="text-2xl font-bold font-awards gold-gradient mb-4">GUIA LONDRES AWARDS</div>
        <p className="text-zinc-500 max-w-md mx-auto mb-8 text-sm">
          Celebrating community excellence and achievements within the London diaspora.
        </p>
        <div className="flex justify-center gap-8 mb-8">
          <a href="#" className="text-zinc-400 hover:text-amber-400 text-sm">Instagram</a>
          <a href="#" className="text-zinc-400 hover:text-amber-400 text-sm">YouTube</a>
          <a href="#" className="text-zinc-400 hover:text-amber-400 text-sm">Facebook</a>
        </div>
        
        {/* Admin Button no Footer */}
        <div className="mb-6">
          <button 
            onClick={handleAdminClick}
            className={`px-6 py-3 rounded-full text-xs font-bold transition-all uppercase tracking-widest ${
              isAdmin 
              ? "bg-zinc-800 text-white hover:bg-zinc-700" 
              : "bg-gold-gradient text-zinc-950 hover:opacity-90 shadow-[0_0_15px_rgba(191,149,63,0.3)]"
            }`}
          >
            {isAdmin ? "Sair do Admin" : "Área do Admin"}
          </button>
        </div>

        <div className="text-xs text-zinc-600">
          &copy; 2024 Guia Londres. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
