
export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
}

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
}

export interface Nominee {
  id: string;
  name: string;
  description: string;
  votes: number;
  imageUrl: string;
}

export interface Category {
  id: string;
  title: string;
  nominees: Nominee[];
}

export interface VideoEntry {
  id: string;
  title: string;
  url: string; // YouTube/Vimeo embed URL
}

export interface Giveaway {
  id: string;
  title: string;
  description: string;
  active: boolean;
  participants: string[]; // Mock participant names or IDs
  winner?: string;
}

export interface SiteConfig {
  heroBanners: HeroBanner[];
  historyText: string;
  liveStreamUrl: string; // HLS URL or YouTube embed
  rtmpUrl: string; // For display in admin instructions
  rtmpKey: string; // For display in admin instructions
}

export interface AppState {
  config: SiteConfig;
  partners: Partner[];
  categories: Category[];
  videos: VideoEntry[];
  giveaways: Giveaway[];
}
