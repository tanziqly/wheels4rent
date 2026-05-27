const API_URL =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
    : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('w4r_admin_token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export async function apiLogin(login: string, password: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, password }),
  });
  if (!res.ok) throw new Error('Неверный логин или пароль');
  const data = await res.json();
  return data.access_token as string;
}

// ─── CARS ─────────────────────────────────────────────────────────────────────

export async function apiGetCars() {
  const res = await fetch(`${API_URL}/api/cars`);
  if (!res.ok) return [];
  return res.json();
}

export async function apiCreateCar(formData: FormData) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/cars`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData, // multipart/form-data — Content-Type браузер выставит сам
  });
  if (!res.ok) throw new Error('Ошибка сохранения автомобиля');
  return res.json();
}

export async function apiDeleteCar(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/cars/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error('Ошибка удаления автомобиля');
}

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────

export async function apiGetBookings() {
  const res = await fetch(`${API_URL}/api/bookings`, {
    headers: authHeaders(),
  });
  if (!res.ok) return [];
  return res.json();
}

export async function apiCreateBooking(booking: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${API_URL}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
  });
  if (!res.ok) throw new Error('Ошибка отправки заявки');
}

export async function apiUpdateBookingStatus(id: string, status: 'new' | 'done'): Promise<void> {
  const res = await fetch(`${API_URL}/api/bookings/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Ошибка обновления статуса');
}

export async function apiDeleteBooking(id: string): Promise<void> {
  await fetch(`${API_URL}/api/bookings/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}

// ─── RENT-OUT ─────────────────────────────────────────────────────────────────

export async function apiGetRentOut() {
  const res = await fetch(`${API_URL}/api/rent-out`, {
    headers: authHeaders(),
  });
  if (!res.ok) return [];
  return res.json();
}

export async function apiCreateRentOut(req: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${API_URL}/api/rent-out`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error('Ошибка отправки заявки');
}

export async function apiUpdateRentOutStatus(id: string, status: 'new' | 'done'): Promise<void> {
  await fetch(`${API_URL}/api/rent-out/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
}

export async function apiDeleteRentOut(id: string): Promise<void> {
  await fetch(`${API_URL}/api/rent-out/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
}
