import React, { useState } from 'react';
import { AppState, VideoCategory } from '../types';

interface VideosPageProps {
  state: AppState;
}

const VideosPage: React.FC<VideosPageProps> = ({ state }) => {
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory | 'all'>('all');

  const categories: { value: VideoCategory | 'all'; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'podcast', label: 'Podcasts' },
    { value: 'parceiros', label: 'Parceiros' },
    { value: 'comerciais', label: 'Comerciais' }
  ];

  const filteredVideos = selectedCategory === 'all' 
    ? state.videos 
    : state.videos.filter(v => v.category === selectedCategory);

  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-zinc-900 to-zinc-950">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold font-awards gold-gradient mb-6">
            VÍDEOS
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Confira nossos conteúdos exclusivos: podcasts, entrevistas com parceiros e comerciais
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-gold-gradient text-zinc-950'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Videos Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {filteredVideos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-zinc-500">
                Nenhum vídeo encontrado nesta categoria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos.map(video => (
                <div 
                  key={video.id}
                  className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-amber-600 transition-all group"
                >
                  {/* Video Embed */}
                  <div className="aspect-video bg-zinc-800">
                    <iframe
                      src={video.url}
                      title={video.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  {/* Video Info */}
                  <div className="p-6">
                    {/* Category Badge */}
                    <div className="mb-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        video.category === 'podcast' ? 'bg-purple-500/20 text-purple-400' :
                        video.category === 'parceiros' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {video.category === 'podcast' ? 'Podcast' :
                         video.category === 'parceiros' ? 'Parceiro' :
                         'Comercial'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                      {video.title}
                    </h3>
                    
                    {video.description && (
                      <p className="text-zinc-400 text-sm">
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default VideosPage;
