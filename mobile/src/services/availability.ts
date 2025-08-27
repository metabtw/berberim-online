import { Barber } from '../types';
import dayjs from 'dayjs';

/**
 * Berberin belirtilen tarihte kapalı olup olmadığını kontrol eder
 */
export const isClosed = (barber: Barber, date: string): boolean => {
  const dateKey = dayjs(date).format('YYYY-MM-DD');
  return !barber.openHours[dateKey];
};

/**
 * Berberin belirtilen tarih ve saatte dolu olup olmadığını kontrol eder
 */
export const isFull = (barber: Barber, date: string, time: string): boolean => {
  const dateKey = dayjs(date).format('YYYY-MM-DD');
  const bookedSlots = barber.bookedSlots[dateKey] || [];
  return bookedSlots.includes(time);
};

/**
 * Berberin belirtilen tarih ve saatte müsait olup olmadığını kontrol eder
 */
export const isAvailable = (barber: Barber, date: string, time: string): boolean => {
  // Önce kapalı mı kontrol et
  if (isClosed(barber, date)) {
    return false;
  }
  
  // Sonra dolu mu kontrol et
  if (isFull(barber, date, time)) {
    return false;
  }
  
  // Çalışma saatleri içinde mi kontrol et
  const dateKey = dayjs(date).format('YYYY-MM-DD');
  const openHours = barber.openHours[dateKey];
  
  if (!openHours) {
    return false;
  }
  
  const timeMinutes = timeToMinutes(time);
  const startMinutes = timeToMinutes(openHours.start);
  const endMinutes = timeToMinutes(openHours.end);
  
  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
};

/**
 * Saat string'ini dakikaya çevirir (HH:mm -> minutes)
 */
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Dakikayı saat string'ine çevirir (minutes -> HH:mm)
 */
const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Berberin belirtilen tarihte müsait olduğu saatleri döndürür
 */
export const getAvailableSlots = (barber: Barber, date: string): string[] => {
  if (isClosed(barber, date)) {
    return [];
  }
  
  const dateKey = dayjs(date).format('YYYY-MM-DD');
  const openHours = barber.openHours[dateKey];
  const bookedSlots = barber.bookedSlots[dateKey] || [];
  
  if (!openHours) {
    return [];
  }
  
  const startMinutes = timeToMinutes(openHours.start);
  const endMinutes = timeToMinutes(openHours.end);
  const slotDuration = 60; // 1 saatlik slotlar
  
  const availableSlots: string[] = [];
  
  for (let minutes = startMinutes; minutes < endMinutes; minutes += slotDuration) {
    const timeSlot = minutesToTime(minutes);
    if (!bookedSlots.includes(timeSlot)) {
      availableSlots.push(timeSlot);
    }
  }
  
  return availableSlots;
};

/**
 * Berberin durumunu döndürür: 'available', 'full', 'closed'
 */
export const getBarberStatus = (barber: Barber, date: string, time?: string): 'available' | 'full' | 'closed' => {
  if (isClosed(barber, date)) {
    return 'closed';
  }
  
  if (time && isFull(barber, date, time)) {
    return 'full';
  }
  
  // Eğer belirli bir saat belirtilmemişse, o gün için genel durumu kontrol et
  if (!time) {
    const availableSlots = getAvailableSlots(barber, date);
    return availableSlots.length > 0 ? 'available' : 'full';
  }
  
  return isAvailable(barber, date, time) ? 'available' : 'full';
};

/**
 * Berber listesini müsaitlik durumuna göre sıralar
 * Öncelik: available -> full -> closed
 */
export const sortBarbersByAvailability = (
  barbers: Barber[],
  date: string,
  time?: string
): Barber[] => {
  return [...barbers].sort((a, b) => {
    const statusA = getBarberStatus(a, date, time);
    const statusB = getBarberStatus(b, date, time);
    
    const statusOrder = { available: 0, full: 1, closed: 2 };
    
    const orderA = statusOrder[statusA];
    const orderB = statusOrder[statusB];
    
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    
    // Aynı durumda olanları popülerlik ve rating'e göre sırala
    if (a.isPopular !== b.isPopular) {
      return a.isPopular ? -1 : 1;
    }
    
    return b.rating - a.rating;
  });
};

/**
 * Belirtilen tarih aralığında berberin müsait olduğu günleri döndürür
 */
export const getAvailableDates = (barber: Barber, startDate: string, endDate: string): string[] => {
  const availableDates: string[] = [];
  let currentDate = dayjs(startDate);
  const end = dayjs(endDate);
  
  while (currentDate.isBefore(end) || currentDate.isSame(end)) {
    const dateStr = currentDate.format('YYYY-MM-DD');
    if (!isClosed(barber, dateStr)) {
      const availableSlots = getAvailableSlots(barber, dateStr);
      if (availableSlots.length > 0) {
        availableDates.push(dateStr);
      }
    }
    currentDate = currentDate.add(1, 'day');
  }
  
  return availableDates;
};