
import { AppState } from './types';

export const INITIAL_STATE: AppState = {
  config: {
    heroBanners: [
      {
        id: 'b1',
        title: "Guia Londres Awards 2024",
        subtitle: "Celebrating the best of the Brazilian community in London",
        imageUrl: "https://picsum.photos/id/192/1920/1080"
      }
    ],
    historyText: "The Guia Londres Awards started as a small community gathering to recognize the hard work of Brazilians living in London. Today, it has grown into a major annual event that brings together entrepreneurs, artists, and community leaders.",
    liveStreamUrl: "", // Empty means offline
    rtmpUrl: "rtmp://live.guialondres.com/app",
    rtmpKey: "gl-awards-key-2024"
  },
  partners: [
    { id: '1', name: 'Premium London Agency', logoUrl: 'https://picsum.photos/id/1/200/100' },
    { id: '2', name: 'Taste of Brazil', logoUrl: 'https://picsum.photos/id/2/200/100' }
  ],
  categories: [
    {
      id: 'cat-1',
      title: 'Best Brazilian Restaurant',
      nominees: [
        { id: 'n1', name: 'Sabor de Casa', description: 'Traditional feijoada experts', votes: 120, imageUrl: 'https://picsum.photos/id/102/400/300' },
        { id: 'n2', name: 'Grill Master London', description: 'Elite steakhouse experience', votes: 85, imageUrl: 'https://picsum.photos/id/103/400/300' }
      ]
    }
  ],
  videos: [
    { id: 'v1', title: 'Last Year Highlights', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
  ],
  giveaways: [
    { id: 'g1', title: 'Dinner for Two at Savoy', description: 'Register to participate in our luxury dinner draw!', active: true, participants: [] }
  ],
  studioConfig: {
    sessionPrice: 150,
    sessionDuration: 60,
    slotInterval: 60,
    stripePublicKey: '',
    daysAvailability: [
      { id: 'd0', dayOfWeek: 0, enabled: false, timeSlots: [] },
      { id: 'd1', dayOfWeek: 1, enabled: false, timeSlots: [] },
      { id: 'd2', dayOfWeek: 2, enabled: true, timeSlots: [
        { id: 't1', startTime: '09:00', endTime: '10:00' },
        { id: 't2', startTime: '10:00', endTime: '11:00' },
        { id: 't3', startTime: '11:00', endTime: '12:00' },
        { id: 't4', startTime: '13:00', endTime: '14:00' },
        { id: 't5', startTime: '14:00', endTime: '15:00' },
        { id: 't6', startTime: '15:00', endTime: '16:00' },
        { id: 't7', startTime: '16:00', endTime: '17:00' }
      ] },
      { id: 'd3', dayOfWeek: 3, enabled: false, timeSlots: [] },
      { id: 'd4', dayOfWeek: 4, enabled: false, timeSlots: [] },
      { id: 'd5', dayOfWeek: 5, enabled: false, timeSlots: [] },
      { id: 'd6', dayOfWeek: 6, enabled: false, timeSlots: [] }
    ]
  },
  bookings: []
};
