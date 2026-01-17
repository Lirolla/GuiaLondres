
import React, { useState, useEffect } from 'react';
import { AppState, Category } from '../types';

interface Props {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
}

const PublicHome: React.FC<Props> = ({ state, updateState }) => {
  const [votedCategories, setVotedCategories] = useState<string[]>([]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  // Rotação automática dos banners
  useEffect(() => {
    if (state.config.heroBanners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % state.config.heroBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [state.config.heroBanners.length]);

  const handleVote = (categoryId: string, nomineeId: string) => {
    if (votedCategories.includes(categoryId)) return;

    const newCategories = state.categories.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          nominees: cat.nominees.map(nom => {
            if (nom.id === nomineeId) return { ...nom, votes: nom.votes + 1 };
            return nom;
          })
        };
      }
      return cat;
    });

    updateState({ categories: newCategories });
    setVotedCategories([...votedCategories, categoryId]);
    alert("Obrigado! Seu voto foi computado com sucesso.");
  };

  const handleGiveawayJoin = (giveawayId: string) => {
    const name = prompt("Para participar, digite seu nome completo:");
    if (!name) return;

    const newGiveaways = state.giveaways.map(g => {
      if (g.id === giveawayId) {
        return { ...g, participants: [...g.participants, name] };
      }
      return g;
    });
    updateState({ giveaways: newGiveaways });
    alert("Você agora está concorrendo! Fique ligado na nossa live.");
  };

  return (
    <div className="pt-16 bg-zinc-950">
      {/* HERO SECTION - MULTI BANNER */}
      <section className="relative h-[85vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
        {state.config.heroBanners.map((banner, index) => (
          <div 
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeBannerIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-[10s]"
              style={{ backgroundImage: `url(${banner.imageUrl})`, transform: index === activeBannerIndex ? 'scale(1)' : 'scale(1.1)' }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-zinc-950"></div>
            
            <div className="relative h-full z-10 flex flex-col items-center justify-center text-center px-4 max-w-6xl mx-auto">
              <div className="inline-block px-4 py-1 border border-amber-500/50 rounded-full text-[10px] uppercase tracking-[0.3em] text-amber-500 mb-6 bg-amber-500/10 backdrop-blur-sm animate-pulse">
                Guia Londres Awards • Edição 2024
              </div>
              <h1 className="text-5xl md:text-8xl font-awards gold-gradient mb-6 drop-shadow-[0_0_30px_rgba(191,149,63,0.5)] leading-tight">
                {banner.title}
              </h1>
              <p className="text-lg md:text-2xl text-zinc-300 font-light max-w-3xl mx-auto mb-12 tracking-wide leading-relaxed">
                {banner.subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <a href="#voting" className="px-10 py-4 bg-gold-gradient text-zinc-950 font-bold rounded-full hover:scale-105 transition-all shadow-[0_10px_40px_rgba(191,149,63,0.4)] uppercase tracking-widest text-sm">
                  VOTAR AGORA
                </a>
                {state.config.liveStreamUrl && (
                  <a href="#live" className="px-10 py-4 bg-zinc-950/50 backdrop-blur-md border border-amber-500/50 text-amber-500 font-bold rounded-full hover:bg-amber-500 hover:text-zinc-950 transition-all uppercase tracking-widest text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
                    ASSISTIR AO VIVO
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Banner Indicators */}
        {state.config.heroBanners.length > 1 && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
            {state.config.heroBanners.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActiveBannerIndex(i)}
                className={`w-16 h-1 rounded-full transition-all duration-500 ${i === activeBannerIndex ? 'bg-amber-500 w-24' : 'bg-zinc-800 hover:bg-zinc-700'}`}
              ></button>
            ))}
          </div>
        )}
      </section>

      {/* LIVE STREAM SECTION */}
      {state.config.liveStreamUrl && (
        <section id="live" className="py-24 bg-zinc-950 relative">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col items-center mb-12">
              <div className="flex items-center gap-3 text-red-500 font-bold tracking-[0.3em] text-xs mb-4 uppercase">
                <span className="w-3 h-3 bg-red-600 rounded-full animate-ping"></span>
                On Air Now
              </div>
              <h2 className="text-4xl md:text-5xl font-awards gold-gradient text-center uppercase tracking-tighter">Transmissão Oficial</h2>
            </div>
            
            <div className="group relative aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(191,149,63,0.15)] border-4 border-zinc-900">
               <iframe 
                className="w-full h-full"
                src={state.config.liveStreamUrl} 
                title="Live Stream"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>
      )}

      {/* HISTORY SECTION */}
      <section className="py-32 bg-zinc-950 relative overflow-hidden border-t border-zinc-900">
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500 blur-[150px] rounded-full"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.5em] text-amber-500 mb-8">Tradição & Reconhecimento</h2>
          <h3 className="text-4xl md:text-5xl font-awards gold-gradient mb-12 uppercase">Nossa História</h3>
          <p className="text-zinc-400 leading-relaxed text-xl md:text-2xl italic font-light font-awards max-w-3xl mx-auto">
            "{state.config.historyText}"
          </p>
          <div className="w-24 h-px bg-gold-gradient mx-auto mt-12 opacity-50"></div>
        </div>
      </section>

      {/* VOTING SECTION */}
      <section id="voting" className="py-32 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4">
          <header className="text-center mb-24">
            <h2 className="text-5xl md:text-6xl font-awards gold-gradient mb-6 uppercase tracking-tighter">Categorias 2024</h2>
            <p className="text-zinc-500 uppercase tracking-[0.4em] text-[10px]">A sua voz define os grandes vencedores da comunidade</p>
          </header>
          
          <div className="space-y-40">
            {state.categories.map(category => (
              <div key={category.id} className="space-y-16">
                <div className="flex items-center justify-center gap-8">
                  <div className="h-px w-20 bg-zinc-800"></div>
                  <h3 className="text-3xl md:text-4xl font-awards text-amber-200 uppercase tracking-widest">{category.title}</h3>
                  <div className="h-px w-20 bg-zinc-800"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {category.nominees.map(nominee => (
                    <div 
                      key={nominee.id}
                      className="group bg-zinc-900/50 rounded-[3rem] overflow-hidden border border-zinc-800 hover:border-amber-500/40 transition-all duration-700 hover:-translate-y-3 shadow-2xl backdrop-blur-sm"
                    >
                      <div className="relative h-72 overflow-hidden">
                        <img src={nominee.imageUrl} alt={nominee.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
                      </div>
                      <div className="p-10">
                        <h4 className="text-2xl font-bold mb-4 text-zinc-100 font-awards tracking-tight">{nominee.name}</h4>
                        <p className="text-sm text-zinc-500 mb-10 leading-relaxed line-clamp-3 min-h-[4.5rem]">{nominee.description}</p>
                        <button
                          disabled={votedCategories.includes(category.id)}
                          onClick={() => handleVote(category.id, nominee.id)}
                          className={`w-full py-5 rounded-[1.5rem] font-bold uppercase tracking-widest text-[10px] transition-all duration-500 border ${
                            votedCategories.includes(category.id)
                            ? "bg-zinc-800 text-zinc-600 border-transparent cursor-not-allowed"
                            : "bg-transparent text-amber-400 border-amber-400/30 hover:bg-gold-gradient hover:text-zinc-950 hover:border-transparent"
                          }`}
                        >
                          {votedCategories.includes(category.id) ? "Voto Confirmado" : "Confirmar Voto"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GIVEAWAY SECTION */}
      {state.giveaways.some(g => g.active) && (
        <section className="py-32 bg-zinc-900/30">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-zinc-950 p-16 rounded-[4rem] border border-amber-500/20 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-2 bg-gold-gradient"></div>
              <h2 className="text-xs font-bold uppercase tracking-[0.6em] text-amber-600 mb-6">Prêmios Exclusivos</h2>
              <h3 className="text-4xl md:text-5xl font-awards gold-gradient mb-12 uppercase">Sorteios da Noite</h3>
              
              <div className="grid gap-16">
                {state.giveaways.filter(g => g.active).map(giveaway => (
                  <div key={giveaway.id} className="max-w-2xl mx-auto">
                    <h4 className="text-3xl font-bold text-zinc-100 mb-6 font-awards">{giveaway.title}</h4>
                    <p className="text-zinc-400 mb-12 text-lg leading-relaxed">{giveaway.description}</p>
                    <button 
                      onClick={() => handleGiveawayJoin(giveaway.id)}
                      className="px-16 py-6 bg-gold-gradient text-zinc-950 font-black rounded-full hover:scale-105 transition-all shadow-[0_20px_60px_rgba(191,149,63,0.3)] uppercase tracking-widest text-xs"
                    >
                      Participar do Sorteio
                    </button>
                    <p className="mt-8 text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                      {giveaway.participants.length} pessoas já estão concorrendo
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* VIDEOS SECTION */}
      <section className="py-32 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4">
          <header className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-awards gold-gradient uppercase">Galeria Digital</h2>
            <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px] mt-4">Bastidores e Momentos Marcantes</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {state.videos.map(video => (
              <div key={video.id} className="group space-y-6">
                <div className="aspect-video bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-zinc-800 group-hover:border-amber-500/30 transition-all duration-500 shadow-2xl">
                  <iframe className="w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" src={video.url} frameBorder="0" allowFullScreen></iframe>
                </div>
                <h4 className="text-xl font-medium text-zinc-100 font-awards tracking-wider ml-4">{video.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS SECTION */}
      <section className="py-24 bg-zinc-950 border-t border-zinc-900 text-center">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.6em] text-zinc-600 mb-16">Proudly Supported By</h2>
        <div className="flex flex-wrap justify-center gap-16 md:gap-24 items-center opacity-30 hover:opacity-100 transition-all duration-1000">
          {state.partners.map(partner => (
            <img key={partner.id} src={partner.logoUrl} alt={partner.name} className="h-10 md:h-14 object-contain filter grayscale invert brightness-200" title={partner.name} />
          ))}
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="py-32 bg-zinc-900/40 border-t border-zinc-900">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.5em] text-amber-500 mb-6">Contact Us</h2>
              <h3 className="text-5xl font-awards gold-gradient mb-8 leading-tight uppercase">Fale Conosco</h3>
              <p className="text-zinc-400 mb-10 text-lg leading-relaxed">Dúvidas sobre a premiação, parcerias ou imprensa? Nossa equipe está pronta para atendê-lo.</p>
              
              <div className="space-y-6 text-zinc-500">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl border border-zinc-800 flex items-center justify-center text-amber-500 bg-zinc-900">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <span className="font-medium">awards@guialondres.com</span>
                </div>
              </div>
            </div>
            
            <form className="space-y-6 bg-zinc-950 p-12 rounded-[3rem] border border-zinc-800 shadow-2xl" onSubmit={(e) => { e.preventDefault(); alert("Enviado com sucesso!"); }}>
              <input 
                type="text" 
                placeholder="Nome" 
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 focus:ring-1 focus:ring-amber-500 focus:outline-none text-zinc-100 transition-all"
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
              />
              <input 
                type="email" 
                placeholder="E-mail" 
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 focus:ring-1 focus:ring-amber-500 focus:outline-none text-zinc-100 transition-all"
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
              />
              <textarea 
                rows={4} 
                placeholder="Sua Mensagem" 
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 focus:ring-1 focus:ring-amber-500 focus:outline-none text-zinc-100 transition-all"
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
              ></textarea>
              <button className="w-full py-6 bg-gold-gradient text-zinc-950 font-black rounded-2xl hover:opacity-90 transition-opacity shadow-xl uppercase tracking-widest text-xs">
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PublicHome;
