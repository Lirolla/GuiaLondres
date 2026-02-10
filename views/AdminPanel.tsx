
import React, { useState } from 'react';
import { AppState, Category, Partner, VideoEntry, Giveaway, HeroBanner } from '../types';
import { generateNomineeDescription } from '../services/geminiService';
import StudioAdmin from './StudioAdmin';

interface Props {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
}

const Modal: React.FC<{ title: string, onClose: () => void, children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
    <div className="bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
      <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
        <h3 className="text-xl font-bold font-awards gold-gradient uppercase tracking-widest">{title}</h3>
        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <div className="p-8">{children}</div>
    </div>
  </div>
);

const AdminPanel: React.FC<Props> = ({ state, updateState }) => {
  const [activeTab, setActiveTab] = useState<'config' | 'live-obs' | 'categories' | 'partners' | 'videos' | 'giveaways' | 'studio'>('config');
  const [isGenerating, setIsGenerating] = useState(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [showParticipantsId, setShowParticipantsId] = useState<string | null>(null);
  
  const [formFields, setFormFields] = useState<any>({});

  const handleFieldChange = (key: string, value: any) => {
    setFormFields(prev => ({ ...prev, [key]: value }));
  };

  // --- Handlers ---
  const saveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.title) return;
    const newCat: Category = { id: Date.now().toString(), title: formFields.title, nominees: [] };
    updateState({ categories: [...state.categories, newCat] });
    setModalType(null);
    setFormFields({});
  };

  const saveNominee = async (e: React.FormEvent) => {
    e.preventDefault();
    const catId = formFields.catId;
    if (!formFields.name) return;

    setIsGenerating(true);
    const cat = state.categories.find(c => c.id === catId);
    const description = formFields.description || await generateNomineeDescription(formFields.name, cat?.title || "");
    setIsGenerating(false);

    const newCategories = state.categories.map(c => {
      if (c.id === catId) {
        return {
          ...c,
          nominees: [...c.nominees, { 
            id: Date.now().toString(), 
            name: formFields.name, 
            description, 
            votes: 0, 
            imageUrl: formFields.imageUrl || `https://picsum.photos/seed/${Math.random()}/400/300` 
          }]
        };
      }
      return c;
    });
    updateState({ categories: newCategories });
    setModalType(null);
    setFormFields({});
  };

  const savePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.name || !formFields.logoUrl) return;
    const newPartner: Partner = { 
      id: Date.now().toString(), 
      name: formFields.name, 
      logoUrl: formFields.logoUrl,
      description: formFields.description || '',
      contact: formFields.contact || '',
      websiteUrl: formFields.websiteUrl || ''
    };
    updateState({ partners: [...state.partners, newPartner] });
    setModalType(null);
    setFormFields({});
  };

  const saveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.title || !formFields.imageUrl) return;
    const newBanner: HeroBanner = { 
      id: Date.now().toString(), 
      title: formFields.title, 
      subtitle: formFields.subtitle || "", 
      imageUrl: formFields.imageUrl 
    };
    updateState({ config: { ...state.config, heroBanners: [...state.config.heroBanners, newBanner] } });
    setModalType(null);
    setFormFields({});
  };

  const saveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.title || !formFields.url || !formFields.category) return;
    const newVideo: VideoEntry = { 
      id: Date.now().toString(), 
      title: formFields.title, 
      url: formFields.url,
      category: formFields.category,
      description: formFields.description || ''
    };
    updateState({ videos: [...state.videos, newVideo] });
    setModalType(null);
    setFormFields({});
  };

  const saveGiveaway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.title) return;
    const newGiveaway: Giveaway = {
      id: Date.now().toString(),
      title: formFields.title,
      description: formFields.description || "",
      active: true,
      participants: []
    };
    updateState({ giveaways: [...state.giveaways, newGiveaway] });
    setModalType(null);
    setFormFields({});
  };

  const removeBanner = (id: string) => {
    if (confirm("Remover este banner?")) {
      updateState({ config: { ...state.config, heroBanners: state.config.heroBanners.filter(b => b.id !== id) } });
    }
  };

  const removeCategory = (id: string) => {
    if (confirm("Deseja realmente excluir esta categoria e todos os votos?")) {
      updateState({ categories: state.categories.filter(c => c.id !== id) });
    }
  };

  const removeNominee = (catId: string, nomId: string) => {
    if (confirm("Remover indicado?")) {
      const newCategories = state.categories.map(c => {
        if (c.id === catId) {
          return { ...c, nominees: c.nominees.filter(n => n.id !== nomId) };
        }
        return c;
      });
      updateState({ categories: newCategories });
    }
  };

  const removePartner = (id: string) => {
    if (confirm("Remover parceiro?")) {
      updateState({ partners: state.partners.filter(p => p.id !== id) });
    }
  };

  const removeVideo = (id: string) => {
    if (confirm("Remover vídeo?")) {
      updateState({ videos: state.videos.filter(v => v.id !== id) });
    }
  };

  const removeGiveaway = (id: string) => {
    if (confirm("Remover este sorteio?")) {
      updateState({ giveaways: state.giveaways.filter(g => g.id !== id) });
    }
  };

  const toggleGiveawayStatus = (id: string) => {
    const newGiveaways = state.giveaways.map(g => 
      g.id === id ? { ...g, active: !g.active } : g
    );
    updateState({ giveaways: newGiveaways });
  };

  const drawWinner = (id: string) => {
    const g = state.giveaways.find(x => x.id === id);
    if (!g || g.participants.length === 0) {
      alert("Não há participantes inscritos para este sorteio.");
      return;
    }
    const winner = g.participants[Math.floor(Math.random() * g.participants.length)];
    const newGiveaways = state.giveaways.map(x => 
      x.id === id ? { ...x, winner, active: false } : x
    );
    updateState({ giveaways: newGiveaways });
    alert(`🎉 O GANHADOR É: ${winner}! PARABÉNS! 🎉`);
  };

  return (
    <div className="pt-24 min-h-screen bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center text-zinc-950 font-bold">A</div>
            <h1 className="text-3xl font-awards gold-gradient uppercase tracking-widest">Painel Administrativo</h1>
          </div>
          <div className="text-xs text-zinc-600 uppercase tracking-widest bg-zinc-900 px-6 py-2 rounded-full border border-zinc-800">Guia Londres CMS v3.4</div>
        </header>

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="w-full lg:w-72 space-y-3">
            {[
              { id: 'config', label: 'Banners & Geral' },
              { id: 'live-obs', label: 'Entrar Ao Vivo (OBS)' },
              { id: 'studio', label: 'Estúdio Fotográfico' },
              { id: 'categories', label: 'Categorias & Votos' },
              { id: 'partners', label: 'Parceiros' },
              { id: 'videos', label: 'Vídeos' },
              { id: 'giveaways', label: 'Sorteios' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left px-6 py-4 rounded-2xl transition-all border ${
                  activeTab === tab.id ? "bg-gold-gradient text-zinc-950 font-bold border-transparent shadow-xl translate-x-2" : "bg-zinc-900/50 text-zinc-500 hover:bg-zinc-800 border-zinc-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </aside>

          <div className="flex-grow bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-10 min-h-[600px] backdrop-blur-md">
            
            {activeTab === 'config' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-100">Configuração de Banners</h2>
                    <p className="text-sm text-zinc-500">Gerencie os banners da Home</p>
                  </div>
                  <button onClick={() => { setFormFields({}); setModalType('addBanner'); }} className="bg-amber-600 px-6 py-3 rounded-2xl text-xs font-bold hover:bg-amber-500 transition-colors uppercase tracking-widest shadow-lg">Novo Banner</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {state.config.heroBanners.map(banner => (
                    <div key={banner.id} className="relative group bg-zinc-950 rounded-[2rem] overflow-hidden border border-zinc-800 shadow-2xl">
                      <div className="h-44 w-full relative">
                        <img src={banner.imageUrl} className="h-full w-full object-cover opacity-60" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent"></div>
                      </div>
                      <div className="p-6">
                        <h4 className="font-bold text-amber-200 font-awards tracking-wider">{banner.title}</h4>
                        <p className="text-xs text-zinc-500 mt-2 truncate">{banner.subtitle}</p>
                      </div>
                      <button onClick={() => removeBanner(banner.id)} className="absolute top-4 right-4 bg-red-600/20 text-red-500 p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-10 border-t border-zinc-800 space-y-6">
                  <h2 className="text-2xl font-bold">História do Guia Londres Awards</h2>
                  <textarea 
                    rows={6}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 text-zinc-100 outline-none focus:ring-1 focus:ring-amber-500"
                    value={state.config.historyText}
                    onChange={(e) => updateState({ config: { ...state.config, historyText: e.target.value } })}
                  />
                </div>
              </div>
            )}

            {activeTab === 'live-obs' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div className="border-b border-zinc-800 pb-6">
                  <h2 className="text-3xl font-awards gold-gradient flex items-center gap-3">
                    <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
                    Transmissão Ao Vivo (OBS / RTMP)
                  </h2>
                </div>

                <div className="p-10 bg-zinc-950 rounded-[3rem] border border-zinc-800 space-y-10 shadow-inner">
                  <div className="space-y-4">
                    <label className="block text-xs text-zinc-500 uppercase font-bold tracking-[0.2em]">Link de Reprodução (Player Embed)</label>
                    <input 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-amber-400 focus:ring-2 focus:ring-amber-500/50 outline-none shadow-lg transition-all"
                      placeholder="Ex: https://www.youtube.com/embed/LIVE_ID"
                      value={state.config.liveStreamUrl}
                      onChange={(e) => updateState({ config: { ...state.config, liveStreamUrl: e.target.value } })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="block text-xs text-zinc-600 uppercase font-bold tracking-widest">RTMP Server (URL do OBS)</label>
                      <div className="flex gap-2">
                        <input readOnly value={state.config.rtmpUrl} className="flex-grow bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-400 font-mono" />
                        <button onClick={() => { navigator.clipboard.writeText(state.config.rtmpUrl); alert("Copiado!"); }} className="px-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-[10px] uppercase font-bold">Copiar</button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-xs text-zinc-600 uppercase font-bold tracking-widest">Stream Key (Chave do OBS)</label>
                      <div className="flex gap-2">
                        <input readOnly value={state.config.rtmpKey} className="flex-grow bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-400 font-mono" />
                        <button onClick={() => { navigator.clipboard.writeText(state.config.rtmpKey); alert("Copiado!"); }} className="px-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-[10px] uppercase font-bold">Copiar</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
                  <h2 className="text-2xl font-bold">Categorias</h2>
                  <button onClick={() => { setFormFields({}); setModalType('addCategory'); }} className="bg-amber-600 px-6 py-3 rounded-2xl text-xs font-bold hover:bg-amber-500 transition-colors uppercase tracking-widest">Nova Categoria</button>
                </div>
                <div className="grid gap-10">
                  {state.categories.map(cat => (
                    <div key={cat.id} className="bg-zinc-950 p-8 rounded-3xl border border-zinc-800 shadow-xl relative">
                      <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-900">
                        <h3 className="text-2xl font-bold text-amber-200 font-awards tracking-wider uppercase">{cat.title}</h3>
                        <div className="flex gap-4">
                          <button onClick={() => { setFormFields({ catId: cat.id }); setModalType('addNominee'); }} className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-xl border border-zinc-700 font-bold uppercase tracking-widest">+ Candidato</button>
                          <button onClick={() => removeCategory(cat.id)} className="text-[10px] text-red-500 hover:underline uppercase tracking-widest font-bold">Excluir</button>
                        </div>
                      </div>
                      <div className="grid gap-4">
                        {cat.nominees.map(nom => (
                          <div key={nom.id} className="group flex items-center justify-between p-5 bg-zinc-900/50 rounded-[1.5rem] border border-zinc-800 transition-all hover:bg-zinc-900">
                            <div className="flex items-center gap-5">
                              <img src={nom.imageUrl} className="w-14 h-14 rounded-2xl object-cover border border-zinc-800 shadow-lg" alt="" />
                              <div>
                                <p className="font-bold text-zinc-100 text-lg font-awards">{nom.name}</p>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{nom.votes} votos</p>
                              </div>
                            </div>
                            <button onClick={() => removeNominee(cat.id, nom.id)} className="p-3 text-zinc-600 hover:text-red-500 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PARTNERS TAB */}
            {activeTab === 'partners' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
                  <h2 className="text-2xl font-bold text-zinc-100">Parceiros</h2>
                  <button onClick={() => { setFormFields({}); setModalType('addPartner'); }} className="bg-amber-600 px-6 py-3 rounded-2xl text-xs font-bold hover:bg-amber-500 transition-colors uppercase tracking-widest">Novo Parceiro</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {state.partners.map(p => (
                    <div key={p.id} className="relative group bg-zinc-950 p-8 rounded-[2rem] border border-zinc-800 shadow-xl">
                      <div className="h-24 flex items-center justify-center p-4 bg-white rounded-2xl w-full mb-4">
                        <img src={p.logoUrl} className="max-h-full max-w-full object-contain" alt="" />
                      </div>
                      <h4 className="font-bold text-lg font-awards mb-2">{p.name}</h4>
                      {p.description && <p className="text-sm text-zinc-400 mb-3">{p.description}</p>}
                      {p.contact && <p className="text-xs text-zinc-500 mb-1">📧 {p.contact}</p>}
                      {p.websiteUrl && <p className="text-xs text-zinc-500 truncate">🌐 {p.websiteUrl}</p>}
                      <button onClick={() => removePartner(p.id)} className="absolute top-4 right-4 p-2 bg-red-600/10 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIDEOS TAB */}
            {activeTab === 'videos' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
                  <h2 className="text-2xl font-bold">Vídeos</h2>
                  <button onClick={() => { setFormFields({}); setModalType('addVideo'); }} className="bg-amber-600 px-6 py-3 rounded-2xl text-xs font-bold hover:bg-amber-500 transition-colors uppercase tracking-widest">Novo Vídeo</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {state.videos.map(v => (
                    <div key={v.id} className="group bg-zinc-950 rounded-[2rem] overflow-hidden border border-zinc-800 shadow-2xl">
                      <iframe className="w-full aspect-video pointer-events-none opacity-60" src={v.url} />
                      <div className="p-6">
                        <div className="mb-2">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            v.category === 'podcast' ? 'bg-purple-500/20 text-purple-400' :
                            v.category === 'parceiros' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-amber-500/20 text-amber-400'
                          }`}>
                            {v.category === 'podcast' ? 'Podcast' : v.category === 'parceiros' ? 'Parceiro' : 'Comercial'}
                          </span>
                        </div>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-bold text-zinc-200 font-awards text-lg mb-1">{v.title}</h4>
                            {v.description && <p className="text-sm text-zinc-500">{v.description}</p>}
                          </div>
                          <button onClick={() => removeVideo(v.id)} className="text-red-500 hover:text-red-400 text-[10px] font-bold tracking-widest ml-4">Excluir</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STUDIO TAB */}
            {activeTab === 'studio' && (
              <StudioAdmin state={state} updateState={updateState} />
            )}

            {/* GIVEAWAYS TAB */}
            {activeTab === 'giveaways' && (
              <div className="space-y-10 animate-in fade-in duration-500">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Sorteios Ativos</h2>
                    <p className="text-sm text-zinc-500">Acompanhe participantes e sorteie vencedores</p>
                  </div>
                  <button onClick={() => { setFormFields({}); setModalType('addGiveaway'); }} className="bg-amber-600 px-6 py-3 rounded-2xl text-xs font-bold hover:bg-amber-500 transition-colors uppercase tracking-widest shadow-lg">Novo Sorteio</button>
                </div>

                <div className="grid gap-8">
                  {state.giveaways.map(g => (
                    <div key={g.id} className="bg-zinc-950 p-8 rounded-[2.5rem] border border-zinc-800 shadow-xl relative overflow-hidden group">
                      <div className={`absolute top-0 right-0 p-1 px-4 text-[10px] font-bold uppercase ${g.active ? 'bg-green-600 text-white' : 'bg-red-900 text-red-200'}`}>
                        {g.active ? 'Inscrições Abertas' : 'Encerrado'}
                      </div>
                      
                      <div className="flex flex-col md:flex-row justify-between gap-8 items-start">
                        <div className="flex-grow">
                          <h4 className="text-2xl font-bold text-amber-200 font-awards mb-2">{g.title}</h4>
                          <p className="text-sm text-zinc-500 mb-6">{g.description}</p>
                          
                          <div className="flex flex-wrap gap-8 items-center">
                            <div className="text-center md:text-left">
                              <span className="block text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Participantes</span>
                              <div className="flex items-center gap-3">
                                <span className="text-3xl text-zinc-100 font-awards">{g.participants.length}</span>
                                {g.participants.length > 0 && (
                                  <button 
                                    onClick={() => setShowParticipantsId(showParticipantsId === g.id ? null : g.id)}
                                    className="text-[10px] text-amber-500 hover:underline uppercase font-bold tracking-widest"
                                  >
                                    {showParticipantsId === g.id ? 'Esconder Lista' : 'Ver Nomes'}
                                  </button>
                                )}
                              </div>
                            </div>
                            {g.winner && (
                              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-4">
                                <div>
                                  <span className="block text-[10px] text-amber-600 uppercase tracking-widest font-bold">Vencedor Final</span>
                                  <span className="text-xl text-amber-400 font-bold font-awards">🏆 {g.winner}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {showParticipantsId === g.id && (
                            <div className="mt-6 p-4 bg-zinc-900 rounded-2xl border border-zinc-800 max-h-40 overflow-y-auto">
                              <div className="flex flex-wrap gap-2">
                                {g.participants.map((p, idx) => (
                                  <span key={idx} className="bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full text-[10px] font-medium border border-zinc-700">{p}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-3 w-full md:w-48">
                          {g.active && g.participants.length > 0 && (
                            <button 
                              onClick={() => drawWinner(g.id)}
                              className="px-6 py-4 bg-gold-gradient text-zinc-950 font-black rounded-xl hover:scale-105 transition-all uppercase text-xs shadow-lg"
                            >
                              Sortear Agora!
                            </button>
                          )}
                          <button 
                            onClick={() => toggleGiveawayStatus(g.id)}
                            className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold rounded-xl hover:bg-zinc-800 transition-colors uppercase text-xs"
                          >
                            {g.active ? 'Pausar Inscrições' : 'Retomar Inscrições'}
                          </button>
                          <button 
                            onClick={() => removeGiveaway(g.id)}
                            className="px-6 py-3 bg-red-900/10 text-red-500 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all uppercase text-xs"
                          >
                            Excluir Sorteio
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {state.giveaways.length === 0 && (
                    <div className="py-20 text-center text-zinc-600 italic border-2 border-dashed border-zinc-800 rounded-3xl">
                      Nenhum sorteio cadastrado até o momento.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {modalType === 'addCategory' && (
        <Modal title="Nova Categoria" onClose={() => setModalType(null)}>
          <form onSubmit={saveCategory} className="space-y-6">
            <input placeholder="Ex: Melhor Restaurante Brasileiro" required className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5" onChange={(e) => handleFieldChange('title', e.target.value)} />
            <button className="w-full py-5 bg-gold-gradient text-zinc-950 font-black rounded-2xl uppercase tracking-widest text-xs">Criar Categoria</button>
          </form>
        </Modal>
      )}

      {modalType === 'addNominee' && (
        <Modal title="Novo Candidato" onClose={() => setModalType(null)}>
          <form onSubmit={saveNominee} className="space-y-5">
            <input placeholder="Nome Completo" required className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4" onChange={(e) => handleFieldChange('name', e.target.value)} />
            <textarea placeholder="Bio Curta..." className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4" rows={3} onChange={(e) => handleFieldChange('description', e.target.value)} />
            <input placeholder="Link da Imagem" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4" onChange={(e) => handleFieldChange('imageUrl', e.target.value)} />
            <button className="w-full py-5 bg-gold-gradient text-zinc-950 font-black rounded-2xl uppercase tracking-widest text-xs">Salvar Indicado</button>
          </form>
        </Modal>
      )}

      {modalType === 'addPartner' && (
        <Modal title="Novo Parceiro" onClose={() => setModalType(null)}>
          <form onSubmit={savePartner} className="space-y-5">
            <input placeholder="Nome da Empresa" required className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5" onChange={(e) => handleFieldChange('name', e.target.value)} />
            <input placeholder="URL do Logo" required className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5" onChange={(e) => handleFieldChange('logoUrl', e.target.value)} />
            <textarea placeholder="Descrição da empresa" rows={3} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5" onChange={(e) => handleFieldChange('description', e.target.value)} />
            <input placeholder="Email de contato" type="email" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5" onChange={(e) => handleFieldChange('contact', e.target.value)} />
            <input placeholder="URL do website" type="url" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5" onChange={(e) => handleFieldChange('websiteUrl', e.target.value)} />
            <button className="w-full py-5 bg-gold-gradient text-zinc-950 font-black rounded-2xl uppercase tracking-widest text-xs">Adicionar Parceiro</button>
          </form>
        </Modal>
      )}

      {modalType === 'addBanner' && (
        <Modal title="Novo Banner" onClose={() => setModalType(null)}>
          <form onSubmit={saveBanner} className="space-y-5">
            <input placeholder="Título impactante" required className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5" onChange={(e) => handleFieldChange('title', e.target.value)} />
            <input placeholder="Subtítulo curto" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5" onChange={(e) => handleFieldChange('subtitle', e.target.value)} />
            <input placeholder="URL da Imagem de Fundo" required className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5" onChange={(e) => handleFieldChange('imageUrl', e.target.value)} />
            <button className="w-full py-5 bg-gold-gradient text-zinc-950 font-black rounded-2xl uppercase tracking-widest text-xs">Salvar Banner</button>
          </form>
        </Modal>
      )}

      {modalType === 'addVideo' && (
        <Modal title="Novo Vídeo Galeria" onClose={() => setModalType(null)}>
          <form onSubmit={saveVideo} className="space-y-6">
            <input placeholder="Título do Vídeo" required className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5" onChange={(e) => handleFieldChange('title', e.target.value)} />
            <input placeholder="URL YouTube Embed" required className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5" onChange={(e) => handleFieldChange('url', e.target.value)} />
            <select required className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 text-zinc-300" onChange={(e) => handleFieldChange('category', e.target.value)}>
              <option value="">Selecione a categoria</option>
              <option value="podcast">Podcast</option>
              <option value="parceiros">Parceiros</option>
              <option value="comerciais">Comerciais</option>
            </select>
            <textarea placeholder="Descrição (opcional)" rows={3} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5" onChange={(e) => handleFieldChange('description', e.target.value)} />
            <button className="w-full py-5 bg-gold-gradient text-zinc-950 font-black rounded-2xl uppercase tracking-widest text-xs">Salvar Vídeo</button>
          </form>
        </Modal>
      )}

      {modalType === 'addGiveaway' && (
        <Modal title="Novo Sorteio" onClose={() => setModalType(null)}>
          <form onSubmit={saveGiveaway} className="space-y-5">
            <input placeholder="Nome do Prêmio (Ex: Jantar de Gala)" required className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5" onChange={(e) => handleFieldChange('title', e.target.value)} />
            <textarea placeholder="Descrição e Regras..." className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5" rows={3} onChange={(e) => handleFieldChange('description', e.target.value)} />
            <button className="w-full py-5 bg-gold-gradient text-zinc-950 font-black rounded-2xl shadow-xl uppercase tracking-widest text-xs">Publicar Sorteio</button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminPanel;
