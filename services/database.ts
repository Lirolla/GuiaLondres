// Configuração hardcoded do banco de dados MySQL
const DB_CONFIG = {
  host: 'localhost',
  user: 'u219024948_guialondres',
  password: 'Pagotto24',
  database: 'u219024948_guialondres'
};

// URL base da API (você precisará criar endpoints PHP na Hostinger)
const API_BASE_URL = 'https://palegreen-shark-426093.hostingersite.com/api';

// Funções de API para cada tabela
export const db = {
  // Banners
  getBanners: async () => {
    const response = await fetch(`${API_BASE_URL}/banners.php`);
    return response.json();
  },
  
  // Categories
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/categories.php`);
    return response.json();
  },
  
  // Nominees
  getNominees: async (categoryId?: number) => {
    const url = categoryId 
      ? `${API_BASE_URL}/nominees.php?category_id=${categoryId}`
      : `${API_BASE_URL}/nominees.php`;
    const response = await fetch(url);
    return response.json();
  },
  
  // Vote
  vote: async (nomineeId: number, voterIp: string) => {
    const response = await fetch(`${API_BASE_URL}/vote.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nominee_id: nomineeId, voter_ip: voterIp })
    });
    return response.json();
  },
  
  // Partners
  getPartners: async () => {
    const response = await fetch(`${API_BASE_URL}/partners.php`);
    return response.json();
  },
  
  // Videos
  getVideos: async (category?: string) => {
    const url = category 
      ? `${API_BASE_URL}/videos.php?category=${category}`
      : `${API_BASE_URL}/videos.php`;
    const response = await fetch(url);
    return response.json();
  },
  
  // Giveaways
  getGiveaways: async () => {
    const response = await fetch(`${API_BASE_URL}/giveaways.php`);
    return response.json();
  },
  
  // Live Config
  getLiveConfig: async () => {
    const response = await fetch(`${API_BASE_URL}/live.php`);
    return response.json();
  },
  
  // Studio Config
  getStudioConfig: async () => {
    const response = await fetch(`${API_BASE_URL}/studio.php`);
    return response.json();
  },
  
  // Bookings
  createBooking: async (booking: any) => {
    const response = await fetch(`${API_BASE_URL}/bookings.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    return response.json();
  },
  
  getAvailability: async (date: string) => {
    const response = await fetch(`${API_BASE_URL}/availability.php?date=${date}`);
    return response.json();
  }
};

export default db;
