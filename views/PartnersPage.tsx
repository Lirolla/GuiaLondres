import React from 'react';
import { AppState } from '../types';
import { ExternalLink, Mail, Globe } from 'lucide-react';

interface PartnersPageProps {
  state: AppState;
}

const PartnersPage: React.FC<PartnersPageProps> = ({ state }) => {
  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-awards gold-gradient mb-4 md:mb-6">
            PARCEIROS & PATROCINADORES
          </h1>
          <p className="text-base md:text-xl text-zinc-400 max-w-2xl mx-auto px-4">
            Conheça as empresas e organizações que tornam o Guia Londres Awards possível
          </p>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {state.partners.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-zinc-500">
                Nenhum parceiro cadastrado ainda
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {state.partners.map(partner => (
                <div 
                  key={partner.id}
                  className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-amber-600 transition-all group"
                >
                  {/* Logo */}
                  <div className="bg-white p-4 md:p-8 flex items-center justify-center h-32 md:h-48">
                    <img 
                      src={partner.logoUrl} 
                      alt={partner.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  {/* Partner Info */}
                  <div className="p-4 md:p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                      {partner.name}
                    </h3>
                    
                    <p className="text-sm md:text-base text-zinc-400 mb-4 md:mb-6 leading-relaxed">
                      {partner.description}
                    </p>

                    {/* Contact Info */}
                    <div className="space-y-3 mb-6">
                      {partner.contact && (
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                          <Mail className="w-4 h-4 text-amber-500" />
                          <a 
                            href={`mailto:${partner.contact}`}
                            className="hover:text-amber-400 transition-colors"
                          >
                            {partner.contact}
                          </a>
                        </div>
                      )}

                      {partner.websiteUrl && (
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                          <Globe className="w-4 h-4 text-amber-500" />
                          <a 
                            href={partner.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-amber-400 transition-colors flex items-center gap-1"
                          >
                            {partner.websiteUrl.replace(/^https?:\/\/(www\.)?/, '')}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Visit Website Button */}
                    {partner.websiteUrl && (
                      <a
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-gold-gradient text-zinc-950 font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all transform hover:scale-105"
                      >
                        Visitar Website
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
            Quer se tornar um parceiro?
          </h2>
          <p className="text-base md:text-xl text-zinc-400 mb-6 md:mb-8">
            Entre em contato conosco e faça parte desta celebração da comunidade brasileira em Londres
          </p>
          <a
            href="mailto:awards@guialondres.com"
            className="inline-block bg-gold-gradient text-zinc-950 font-bold py-3 px-6 md:py-4 md:px-8 rounded-lg hover:opacity-90 transition-all transform hover:scale-105 text-sm md:text-base"
          >
            Fale Conosco
          </a>
        </div>
      </section>
    </div>
  );
};

export default PartnersPage;
