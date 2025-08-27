import { Barber, User, AuthResponse, WaitlistResponse, SearchFilters } from '../types';
import dayjs from 'dayjs';

// Mock berber verileri
const mockBarbers: Barber[] = [
  {
    id: '1',
    name: 'Mehmet Usta',
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    isPopular: true,
    distanceKm: 0.5,
    address: 'Kadıköy, İstanbul',
    phone: '+90 532 123 4567',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1493666438817-866a91353ca9?w=400&h=300&fit=crop'
    ],
    reviewCount: 127,
    description: 'Deneyimli berber. Klasik ve modern saç kesim teknikleri konusunda uzman.',
    workingHours: {
      'Pazartesi': '09:00 - 18:00',
      'Salı': '09:00 - 18:00',
      'Çarşamba': '09:00 - 18:00',
      'Perşembe': '09:00 - 18:00',
      'Cuma': '09:00 - 18:00',
      'Cumartesi': '10:00 - 17:00',
      'Pazar': 'Kapalı'
    },
    services: [
      { id: '1', name: 'Saç Kesimi', duration: 30, price: 50, description: 'Profesyonel saç kesimi ve şekillendirme' },
      { id: '2', name: 'Sakal Tıraşı', duration: 20, price: 30, description: 'Geleneksel ustura ile sakal tıraşı' },
    ],
    openHours: {
      [dayjs().format('YYYY-MM-DD')]: { start: '09:00', end: '18:00' },
      [dayjs().add(1, 'day').format('YYYY-MM-DD')]: { start: '09:00', end: '18:00' },
      [dayjs().add(2, 'day').format('YYYY-MM-DD')]: { start: '09:00', end: '18:00' },
    },
    bookedSlots: {
      [dayjs().format('YYYY-MM-DD')]: ['10:00', '11:00', '14:00'],
      [dayjs().add(1, 'day').format('YYYY-MM-DD')]: ['09:00', '15:00'],
    },
  },
  {
    id: '2',
    name: 'Ali Berber',
    rating: 4.5,
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    isPopular: false,
    distanceKm: 1.2,
    address: 'Beşiktaş, İstanbul',
    phone: '+90 532 234 5678',
    images: [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
    ],
    reviewCount: 89,
    description: 'Hızlı ve kaliteli hizmet. Uygun fiyatlarla profesyonel berberlik.',
    workingHours: {
      'Pazartesi': '10:00 - 19:00',
      'Salı': '10:00 - 19:00',
      'Çarşamba': '10:00 - 19:00',
      'Perşembe': '10:00 - 19:00',
      'Cuma': '10:00 - 19:00',
      'Cumartesi': '10:00 - 18:00',
      'Pazar': 'Kapalı'
    },
    services: [
      { id: '1', name: 'Saç Kesimi', duration: 25, price: 45, description: 'Hızlı ve pratik saç kesimi' },
      { id: '3', name: 'Yıkama', duration: 15, price: 20, description: 'Saç yıkama ve bakım' },
    ],
    openHours: {
      [dayjs().format('YYYY-MM-DD')]: { start: '10:00', end: '19:00' },
      [dayjs().add(1, 'day').format('YYYY-MM-DD')]: { start: '10:00', end: '19:00' },
    },
    bookedSlots: {
      [dayjs().format('YYYY-MM-DD')]: ['11:00', '12:00', '16:00', '17:00'],
    },
  },
  {
    id: '3',
    name: 'Hasan Kuaför',
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
    isPopular: true,
    distanceKm: 0.8,
    address: 'Şişli, İstanbul',
    phone: '+90 532 345 6789',
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop'
    ],
    reviewCount: 203,
    description: 'Premium kuaför hizmetleri. Modern teknikler ve lüks atmosfer.',
    workingHours: {
      'Pazartesi': '08:00 - 20:00',
      'Salı': '08:00 - 20:00',
      'Çarşamba': '08:00 - 20:00',
      'Perşembe': '08:00 - 20:00',
      'Cuma': '08:00 - 20:00',
      'Cumartesi': '09:00 - 19:00',
      'Pazar': '10:00 - 18:00'
    },
    services: [
      { id: '1', name: 'Saç Kesimi', duration: 35, price: 60, description: 'Premium saç kesimi ve şekillendirme' },
      { id: '2', name: 'Sakal Tıraşı', duration: 25, price: 35, description: 'Profesyonel sakal düzenleme' },
      { id: '4', name: 'Styling', duration: 20, price: 40, description: 'Saç styling ve şekillendirme' },
    ],
    openHours: {
      [dayjs().format('YYYY-MM-DD')]: { start: '08:00', end: '20:00' },
      [dayjs().add(1, 'day').format('YYYY-MM-DD')]: { start: '08:00', end: '20:00' },
      [dayjs().add(2, 'day').format('YYYY-MM-DD')]: { start: '08:00', end: '20:00' },
    },
    bookedSlots: {
      [dayjs().format('YYYY-MM-DD')]: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
      [dayjs().add(1, 'day').format('YYYY-MM-DD')]: ['10:00', '11:00', '15:00'],
    },
  },
  {
    id: '4',
    name: 'Emre Styling',
    rating: 4.3,
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face',
    isPopular: false,
    distanceKm: 2.1,
    address: 'Beyoğlu, İstanbul',
    phone: '+90 532 456 7890',
    services: [
      { id: '1', name: 'Saç Kesimi', duration: 40, price: 55 },
      { id: '4', name: 'Styling', duration: 30, price: 45 },
    ],
    openHours: {
      [dayjs().add(1, 'day').format('YYYY-MM-DD')]: { start: '11:00', end: '18:00' },
      [dayjs().add(2, 'day').format('YYYY-MM-DD')]: { start: '11:00', end: '18:00' },
    },
    bookedSlots: {
      [dayjs().add(1, 'day').format('YYYY-MM-DD')]: ['12:00', '14:00'],
    },
  },
  {
    id: '5',
    name: 'Kemal Usta',
    rating: 4.7,
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face',
    isPopular: true,
    distanceKm: 1.5,
    address: 'Üsküdar, İstanbul',
    phone: '+90 532 567 8901',
    services: [
      { id: '1', name: 'Saç Kesimi', duration: 30, price: 50 },
      { id: '2', name: 'Sakal Tıraşı', duration: 20, price: 30 },
      { id: '3', name: 'Yıkama', duration: 15, price: 25 },
    ],
    openHours: {
      [dayjs().format('YYYY-MM-DD')]: { start: '09:00', end: '17:00' },
      [dayjs().add(1, 'day').format('YYYY-MM-DD')]: { start: '09:00', end: '17:00' },
    },
    bookedSlots: {
      [dayjs().format('YYYY-MM-DD')]: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
    },
  },
];

// Daha fazla berber verisi ekleyelim
const additionalBarbers: Barber[] = [
  {
    id: '6',
    name: 'Oğuz Berber',
    rating: 4.4,
    imageUrl: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&h=300&fit=crop&crop=face',
    isPopular: false,
    distanceKm: 3.2,
    address: 'Fatih, İstanbul',
    phone: '+90 532 678 9012',
    services: [{ id: '1', name: 'Saç Kesimi', duration: 25, price: 40 }],
    openHours: {
      [dayjs().format('YYYY-MM-DD')]: { start: '10:00', end: '18:00' },
      [dayjs().add(1, 'day').format('YYYY-MM-DD')]: { start: '10:00', end: '18:00' },
    },
    bookedSlots: {
      [dayjs().format('YYYY-MM-DD')]: ['11:00', '15:00'],
    },
  },
  {
    id: '7',
    name: 'Serkan Kuaför',
    rating: 4.6,
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop&crop=face',
    isPopular: false,
    distanceKm: 1.8,
    address: 'Bakırköy, İstanbul',
    phone: '+90 532 789 0123',
    services: [
      { id: '1', name: 'Saç Kesimi', duration: 30, price: 48 },
      { id: '2', name: 'Sakal Tıraşı', duration: 20, price: 28 },
    ],
    openHours: {
      [dayjs().format('YYYY-MM-DD')]: { start: '09:00', end: '19:00' },
      [dayjs().add(1, 'day').format('YYYY-MM-DD')]: { start: '09:00', end: '19:00' },
    },
    bookedSlots: {
      [dayjs().format('YYYY-MM-DD')]: ['10:00', '14:00', '16:00'],
    },
  },
];

// Toplam 20 berber için daha fazla veri ekleyelim
const generateMoreBarbers = (): Barber[] => {
  const names = [
    'Murat Berber', 'Ahmet Kuaför', 'Burak Styling', 'Cem Usta', 'Deniz Berber',
    'Erkan Kuaför', 'Fatih Berber', 'Gökhan Usta', 'Halil Kuaför', 'İbrahim Berber',
    'Jale Kuaför', 'Kaan Berber', 'Levent Usta'
  ];
  
  const addresses = [
    'Maltepe, İstanbul', 'Pendik, İstanbul', 'Kartal, İstanbul', 'Ataşehir, İstanbul',
    'Çekmeköy, İstanbul', 'Sancaktepe, İstanbul', 'Sultanbeyli, İstanbul',
    'Tuzla, İstanbul', 'Avcılar, İstanbul', 'Küçükçekmece, İstanbul',
    'Bahçelievler, İstanbul', 'Bağcılar, İstanbul', 'Güngören, İstanbul'
  ];

  return names.map((name, index) => ({
    id: (8 + index).toString(),
    name,
    rating: Number((3.8 + Math.random() * 1.2).toFixed(1)),
    imageUrl: `https://images.unsplash.com/photo-${1500000000000 + index * 1000000}?w=300&h=300&fit=crop&crop=face`,
    isPopular: Math.random() > 0.7,
    distanceKm: Number((0.5 + Math.random() * 4).toFixed(1)),
    address: addresses[index % addresses.length],
    phone: `+90 532 ${String(Math.floor(Math.random() * 900) + 100)} ${String(Math.floor(Math.random() * 9000) + 1000)}`,
    services: [
      { id: '1', name: 'Saç Kesimi', duration: 30, price: 35 + Math.floor(Math.random() * 25) },
      { id: '2', name: 'Sakal Tıraşı', duration: 20, price: 20 + Math.floor(Math.random() * 15) },
    ],
    openHours: {
      [dayjs().format('YYYY-MM-DD')]: { start: '09:00', end: '18:00' },
      [dayjs().add(1, 'day').format('YYYY-MM-DD')]: { start: '09:00', end: '18:00' },
    },
    bookedSlots: {
      [dayjs().format('YYYY-MM-DD')]: Math.random() > 0.5 ? ['10:00', '14:00'] : [],
    },
  }));
};

const allBarbers = [...mockBarbers, ...additionalBarbers, ...generateMoreBarbers()];

// Mock kullanıcı
const mockUser: User = {
  id: '1',
  name: 'Test Kullanıcı',
  email: 'test@example.com',
  phone: '+90 532 123 4567',
};

// Servis fonksiyonları
export const getBarbers = async (filters?: SearchFilters): Promise<Barber[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredBarbers = [...allBarbers];
  
  if (filters) {
    // Location filter (basit string match)
    if (filters.location) {
      filteredBarbers = filteredBarbers.filter(barber => 
        barber.address.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
  }
  
  return filteredBarbers;
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Mock validation
  if (email === 'test@example.com' && password === 'password') {
    return {
      success: true,
      user: mockUser,
      token: 'mock-jwt-token-' + Date.now(),
    };
  }
  
  return {
    success: false,
    message: 'Geçersiz email veya şifre',
  };
};

export const signUp = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock validation
  if (email === 'existing@example.com') {
    return {
      success: false,
      message: 'Bu email adresi zaten kullanılıyor',
    };
  }
  
  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
  };
  
  return {
    success: true,
    user: newUser,
    token: 'mock-jwt-token-' + Date.now(),
  };
};

export const requestWaitlist = async (
  barberId: string,
  date: string,
  time: string
): Promise<WaitlistResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const barber = allBarbers.find(b => b.id === barberId);
  
  if (!barber) {
    return {
      success: false,
      message: 'Berber bulunamadı',
    };
  }
  
  return {
    success: true,
    message: `${barber.name} için ${date} tarihinde ${time} saatinde bildirim talebiniz alındı.`,
  };
};

export const getBarberById = async (id: string): Promise<Barber | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return allBarbers.find(barber => barber.id === id) || null;
};