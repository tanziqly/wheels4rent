import type { Car } from './data';

const API =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');

function hasUploads(car: Car): boolean {
  return !!(car.images && car.images.length > 0);
}

/** Полный список URL для галереи */
export function carAllImages(car: Car): string[] {
  if (hasUploads(car)) {
    return car.images!.map((p) => `${API}${p}`);
  }
  const seeds = [car.seed, ...(car.extraSeeds || [])].filter(Boolean);
  return seeds.map((s) => `https://picsum.photos/seed/${s}/1200/675`);
}

/** Первое (главное) изображение */
export function carMainImage(car: Car): string {
  if (hasUploads(car)) return `${API}${car.images![0]}`;
  return `https://picsum.photos/seed/${car.seed}/1200/675`;
}

/** Маленький превью (для каталога, карточек, таблицы) */
export function carThumb(car: Car, size = '800/450'): string {
  if (hasUploads(car)) return `${API}${car.images![0]}`;
  return `https://picsum.photos/seed/${car.seed}/${size}`;
}

/** Превью по индексу (для галереи/миниатюр) */
export function carImageAt(car: Car, index: number): string {
  const all = carAllImages(car);
  return all[index] ?? all[0];
}
