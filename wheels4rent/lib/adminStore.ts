'use client';

import { useState, useEffect } from 'react';
import { cars as staticCars, type Car } from './data';
import {
  apiGetCars,
  apiCreateCar,
  apiDeleteCar,
  apiGetBookings,
  apiCreateBooking,
  apiUpdateBookingStatus,
  apiDeleteBooking,
  apiGetRentOut,
  apiCreateRentOut,
  apiUpdateRentOutStatus,
  apiDeleteRentOut,
} from './api';

// ─── ТИПЫ ─────────────────────────────────────────────────────────────────────

export type BookingRequest = {
  id: string;
  carName: string;
  name: string;
  phone: string;
  dateStart: string;
  dateEnd: string;
  delivery: 'yes' | 'no';
  comment: string;
  status: 'new' | 'done';
  createdAt: string;
};

export type RentOutRequest = {
  id: string;
  name: string;
  phone: string;
  carType: string;
  model: string;
  year: string;
  mileage: string;
  comment: string;
  status: 'new' | 'done';
  createdAt: string;
};

// ─── ХУК ──────────────────────────────────────────────────────────────────────

// Возвращает статические машины + добавленные через админку
export function useCars(): Car[] {
  const [adminCars, setAdminCars] = useState<Car[]>([]);
  useEffect(() => {
    apiGetCars()
      .then((cars: Car[]) => setAdminCars(cars))
      .catch(() => {});
  }, []);
  return [...staticCars, ...adminCars];
}

// ─── CARS ─────────────────────────────────────────────────────────────────────

export { apiGetCars as getAdminCars };

export async function saveAdminCar(car: Omit<Car, 'id'>): Promise<Car> {
  return apiCreateCar(car as unknown as FormData);
}

export async function deleteAdminCar(id: number): Promise<void> {
  return apiDeleteCar(id);
}

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────

export async function getBookings(): Promise<BookingRequest[]> {
  return apiGetBookings();
}

export async function saveBooking(
  booking: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>,
): Promise<void> {
  return apiCreateBooking(booking as Record<string, unknown>);
}

export async function updateBookingStatus(id: string, status: 'new' | 'done'): Promise<void> {
  return apiUpdateBookingStatus(id, status);
}

export async function deleteBooking(id: string): Promise<void> {
  return apiDeleteBooking(id);
}

// ─── RENT-OUT ─────────────────────────────────────────────────────────────────

export async function getRentOutRequests(): Promise<RentOutRequest[]> {
  return apiGetRentOut();
}

export async function saveRentOutRequest(
  req: Omit<RentOutRequest, 'id' | 'createdAt' | 'status'>,
): Promise<void> {
  return apiCreateRentOut(req as Record<string, unknown>);
}

export async function updateRentOutStatus(id: string, status: 'new' | 'done'): Promise<void> {
  return apiUpdateRentOutStatus(id, status);
}

export async function deleteRentOut(id: string): Promise<void> {
  return apiDeleteRentOut(id);
}
