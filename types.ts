
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

export interface TimeSlot {
  id: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

export interface DayAvailability {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  enabled: boolean;
  timeSlots: TimeSlot[];
}

export interface StudioConfig {
  sessionPrice: number; // Price in GBP
  sessionDuration: number; // Duration in minutes
  slotInterval: number; // Interval between slots in minutes
  daysAvailability: DayAvailability[];
  stripePublicKey: string;
}

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string; // ISO date string
  timeSlot: TimeSlot;
  price: number;
  paid: boolean;
  stripePaymentId?: string;
  createdAt: string;
}

export interface AppState {
  config: SiteConfig;
  partners: Partner[];
  categories: Category[];
  videos: VideoEntry[];
  giveaways: Giveaway[];
  studioConfig: StudioConfig;
  bookings: Booking[];
}
