'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CarSimple, ClipboardText, PaperPlaneRight, SignOut, Plus, Trash,
  CheckCircle, Circle, X, CarProfile, Users, Image as ImageIcon,
} from '@phosphor-icons/react';
import {
  type BookingRequest, type RentOutRequest,
} from '@/lib/adminStore';
import {
  apiLogin, apiGetCars, apiCreateCar, apiDeleteCar,
  apiGetBookings, apiUpdateBookingStatus, apiDeleteBooking,
  apiGetRentOut, apiUpdateRentOutStatus, apiDeleteRentOut,
} from '@/lib/api';
import { cars as staticCars, categories, type Car } from '@/lib/data';
import { carThumb } from '@/lib/carImages';

const AUTH_KEY = 'w4r_admin_auth';
const TOKEN_KEY = 'w4r_admin_token';

const inputCls =
  'w-full px-4 py-2.5 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-gold-500/40 transition-colors';
const selectCls =
  'w-full px-4 py-2.5 bg-zinc-900 border border-white/8 rounded-xl text-sm text-white focus:outline-none focus:border-gold-500/40 transition-colors appearance-none cursor-pointer';
const labelCls = 'block text-xs text-zinc-400 mb-1.5';

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit',
  });
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [login, setLogin] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      const token = await apiLogin(login, pass);
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(AUTH_KEY, '1');
      onLogin();
    } catch {
      setErr('Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 opacity-[0.015]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-sm">
        <div className="rounded-3xl p-8" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-full bg-gold-500 flex items-center justify-center">
              <CarSimple size={17} weight="fill" className="text-zinc-950" />
            </div>
            <span className="font-bold text-white text-lg">Wheels<span className="text-gold-500">4</span>Rent</span>
          </div>
          <h1 className="text-xl font-bold text-white text-center mb-1">Панель управления</h1>
          <p className="text-xs text-zinc-500 text-center mb-7">Введите данные для входа</p>
          <form onSubmit={submit} className="space-y-3">
            <input type="text" placeholder="Логин" value={login}
              onChange={e => { setLogin(e.target.value); setErr(''); }}
              className={inputCls} />
            <input type="password" placeholder="Пароль" value={pass}
              onChange={e => { setPass(e.target.value); setErr(''); }}
              className={inputCls} />
            {err && <p className="text-xs text-red-400 text-center">{err}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gold-500 hover:bg-gold-300 text-zinc-950 text-sm font-bold rounded-xl transition-colors duration-200 mt-1 disabled:opacity-60">
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// ─── CAR FORM ─────────────────────────────────────────────────────────────────

type CarForm = {
  name: string; categorySlug: string; engine: string; seats: number;
  power: string; transmission: string; drive: string; priceNum: number;
  description: string; featuresText: string;
};
const defaultForm: CarForm = {
  name: '', categorySlug: 'new', engine: '', seats: 4, power: '',
  transmission: 'АКПП', drive: 'Полный', priceNum: 10000,
  description: '', featuresText: '',
};

function AddCarPanel({ onSaved, onCancel }: { onSaved: () => void; onCancel: () => void }) {
  const [form, setForm] = useState<CarForm>(defaultForm);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const set = (k: keyof CarForm, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setPreviews(selected.map(f => URL.createObjectURL(f)));
  };

  const removeFile = (idx: number) => {
    setFiles(f => f.filter((_, i) => i !== idx));
    setPreviews(p => p.filter((_, i) => i !== idx));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const catLabel = categories.find(c => c.slug === form.categorySlug)?.label ?? form.categorySlug;
      const features = form.featuresText.split('\n').map(s => s.trim()).filter(Boolean);

      const fd = new FormData();
      fd.append('slug', `car-${Date.now()}`);
      fd.append('name', form.name);
      fd.append('category', catLabel);
      fd.append('categorySlug', form.categorySlug);
      fd.append('engine', form.engine);
      fd.append('seats', String(form.seats));
      fd.append('power', form.power);
      fd.append('transmission', form.transmission);
      fd.append('drive', form.drive);
      fd.append('priceFrom', `от ${Number(form.priceNum).toLocaleString('ru-RU')} ₽`);
      fd.append('priceNum', String(form.priceNum));
      fd.append('description', form.description);
      fd.append('featuresJson', JSON.stringify(features));
      files.forEach(f => fd.append('images', f));

      await apiCreateCar(fd);
      onSaved();
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
      className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-white text-base">Добавить автомобиль</h3>
        <button onClick={onCancel} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
          <X size={14} className="text-zinc-400" />
        </button>
      </div>
      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <label className={labelCls}>Название *</label>
          <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="GT Coupé Série X" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Категория</label>
          <select value={form.categorySlug} onChange={e => set('categorySlug', e.target.value)} className={selectCls}>
            {categories.filter(c => c.slug !== 'all').map(c => (
              <option key={c.slug} value={c.slug}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Двигатель *</label>
          <input required value={form.engine} onChange={e => set('engine', e.target.value)} placeholder="3.0 л" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Мощность *</label>
          <input required value={form.power} onChange={e => set('power', e.target.value)} placeholder="380 л.с." className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Мест</label>
          <input type="number" min={1} max={12} value={form.seats} onChange={e => set('seats', parseInt(e.target.value))} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>КПП</label>
          <select value={form.transmission} onChange={e => set('transmission', e.target.value)} className={selectCls}>
            <option>АКПП</option><option>МКПП</option><option>Автомат</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Привод</label>
          <select value={form.drive} onChange={e => set('drive', e.target.value)} className={selectCls}>
            <option>Полный</option><option>Задний</option><option>Передний</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Цена в сутки (₽) *</label>
          <input required type="number" min={1000} value={form.priceNum} onChange={e => set('priceNum', parseInt(e.target.value))} className={inputCls} />
        </div>

        {/* Загрузка фото */}
        <div className="sm:col-span-2 lg:col-span-3">
          <label className={labelCls}>Фотографии (до 10 шт., jpg/png/webp)</label>
          <label className="flex flex-col items-center justify-center gap-2 w-full h-28 rounded-xl border border-dashed border-white/15 hover:border-white/30 cursor-pointer transition-colors bg-zinc-900/50">
            <ImageIcon size={22} className="text-zinc-500" />
            <span className="text-xs text-zinc-500">Нажмите чтобы выбрать файлы</span>
            <input type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
          </label>
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {previews.map((src, i) => (
                <div key={i} className="relative w-20 h-14 rounded-lg overflow-hidden bg-zinc-800 group">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeFile(i)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <X size={14} className="text-white" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-0.5 left-0.5 text-[9px] bg-gold-500 text-zinc-950 font-bold px-1 rounded">гл.</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <label className={labelCls}>Описание</label>
          <textarea rows={2} value={form.description} onChange={e => set('description', e.target.value)}
            placeholder="Краткое описание автомобиля..."
            className={inputCls + ' resize-none'} />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className={labelCls}>Особенности (каждая с новой строки)</label>
          <textarea rows={3} value={form.featuresText} onChange={e => set('featuresText', e.target.value)}
            placeholder={'Панорамный люк\nАдаптивная подвеска\nВентиляция сидений'}
            className={inputCls + ' resize-none'} />
        </div>
        <div className="sm:col-span-2 lg:col-span-3 flex gap-3 pt-1">
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 bg-gold-500 hover:bg-gold-300 text-zinc-950 text-sm font-bold rounded-xl transition-colors duration-200 flex items-center gap-2 disabled:opacity-60">
            <Plus size={15} weight="bold" />
            {loading ? 'Сохранение...' : 'Добавить'}
          </button>
          <button type="button" onClick={onCancel}
            className="px-5 py-2.5 border border-white/10 text-zinc-400 text-sm rounded-xl hover:border-white/20 hover:text-zinc-300 transition-colors">
            Отмена
          </button>
        </div>
      </form>
    </motion.div>
  );
}

// ─── CARS TAB ─────────────────────────────────────────────────────────────────

function CarsTab() {
  const [adminCars, setAdminCars] = useState<Car[]>([]);
  const [showForm, setShowForm] = useState(false);

  const refresh = useCallback(async () => {
    const cars = await apiGetCars();
    setAdminCars(cars);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const allCars = [...staticCars, ...adminCars];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Автомобили</h2>
          <p className="text-xs text-zinc-500 mt-0.5">{allCars.length} в каталоге · {adminCars.length} добавлено вручную</p>
        </div>
        <button onClick={() => setShowForm(s => !s)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold-500 hover:bg-gold-300 text-zinc-950 text-sm font-bold rounded-xl transition-colors duration-200">
          <Plus size={15} weight="bold" />
          Добавить авто
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <AddCarPanel
            onSaved={() => { refresh(); setShowForm(false); }}
            onCancel={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>

      <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 w-12">#</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500">Название</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 hidden md:table-cell">Категория</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 hidden lg:table-cell">Двигатель</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 hidden lg:table-cell">Привод</th>
              <th className="text-right px-5 py-3.5 text-xs font-medium text-zinc-500">Цена</th>
              <th className="text-right px-5 py-3.5 text-xs font-medium text-zinc-500 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {allCars.map((car, idx) => {
              const isAdmin = adminCars.some(c => c.id === car.id);
              return (
                <tr key={`${isAdmin ? 'a' : 's'}-${car.id}`} className="border-b border-white/4 hover:bg-white/2 transition-colors last:border-0">
                  <td className="px-5 py-3.5 text-xs text-zinc-600">{idx + 1}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                        <img src={carThumb(car, '160/112')} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-medium text-white text-sm leading-tight">{car.name}</div>
                        {isAdmin && <span className="text-[10px] text-gold-500/70">вручную</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-zinc-400 hidden md:table-cell">{car.category}</td>
                  <td className="px-5 py-3.5 text-xs text-zinc-400 hidden lg:table-cell">{car.engine} · {car.power}</td>
                  <td className="px-5 py-3.5 text-xs text-zinc-400 hidden lg:table-cell">{car.drive}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-gold-400 text-right whitespace-nowrap">{car.priceFrom}</td>
                  <td className="px-5 py-3.5 text-right">
                    {isAdmin ? (
                      <button onClick={async () => { await apiDeleteCar(car.id); refresh(); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 text-xs font-medium transition-all duration-200">
                        <Trash size={13} />
                        Удалить
                      </button>
                    ) : (
                      <span className="text-xs text-zinc-700">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── BOOKINGS TAB ─────────────────────────────────────────────────────────────

function BookingsTab() {
  const [items, setItems] = useState<BookingRequest[]>([]);

  const refresh = useCallback(async () => {
    const data = await apiGetBookings();
    setItems(data);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const newCount = items.filter(b => b.status === 'new').length;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Заявки на аренду</h2>
        <p className="text-xs text-zinc-500 mt-0.5">{items.length} всего · {newCount} новых</p>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={<CarProfile size={32} className="text-zinc-700" />} text="Заявки на аренду появятся здесь" />
      ) : (
        <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500">Дата</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500">Клиент</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 hidden sm:table-cell">Автомобиль</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 hidden md:table-cell">Период</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 hidden lg:table-cell">Доставка</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 hidden xl:table-cell">Комментарий</th>
                <th className="text-right px-5 py-3.5 text-xs font-medium text-zinc-500">Статус</th>
                <th className="px-5 py-3.5 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id} className="border-b border-white/4 hover:bg-white/2 transition-colors last:border-0">
                  <td className="px-5 py-4 text-xs text-zinc-500 whitespace-nowrap">{fmtDate(b.createdAt)}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-white text-sm">{b.name}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{b.phone}</div>
                  </td>
                  <td className="px-5 py-4 text-xs text-zinc-400 hidden sm:table-cell">{b.carName || '—'}</td>
                  <td className="px-5 py-4 text-xs text-zinc-400 hidden md:table-cell whitespace-nowrap">
                    {b.dateStart && b.dateEnd ? `${b.dateStart} → ${b.dateEnd}` : '—'}
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${b.delivery === 'yes' ? 'bg-blue-500/15 text-blue-400' : 'bg-white/5 text-zinc-500'}`}>
                      {b.delivery === 'yes' ? 'Да' : 'Нет'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-zinc-500 hidden xl:table-cell max-w-[200px] truncate">{b.comment || '—'}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={async () => {
                      await apiUpdateBookingStatus(b.id, b.status === 'new' ? 'done' : 'new');
                      refresh();
                    }}
                      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-colors ${
                        b.status === 'done'
                          ? 'bg-green-500/15 text-green-400 hover:bg-green-500/25'
                          : 'bg-gold-500/15 text-gold-400 hover:bg-gold-500/25'
                      }`}>
                      {b.status === 'done' ? <CheckCircle size={13} weight="fill" /> : <Circle size={13} />}
                      {b.status === 'done' ? 'Обработана' : 'Новая'}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={async () => { await apiDeleteBooking(b.id); refresh(); }}
                      className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors">
                      <Trash size={13} className="text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── RENT-OUT TAB ─────────────────────────────────────────────────────────────

function RentOutTab() {
  const [items, setItems] = useState<RentOutRequest[]>([]);

  const refresh = useCallback(async () => {
    const data = await apiGetRentOut();
    setItems(data);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const newCount = items.filter(r => r.status === 'new').length;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Заявки на сдачу авто</h2>
        <p className="text-xs text-zinc-500 mt-0.5">{items.length} всего · {newCount} новых</p>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={<Users size={32} className="text-zinc-700" />} text="Заявки на сдачу появятся здесь" />
      ) : (
        <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500">Дата</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500">Клиент</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 hidden sm:table-cell">Автомобиль</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 hidden md:table-cell">Тип</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 hidden lg:table-cell">Год · Пробег</th>
                <th className="text-left px-5 py-3.5 text-xs font-medium text-zinc-500 hidden xl:table-cell">Комментарий</th>
                <th className="text-right px-5 py-3.5 text-xs font-medium text-zinc-500">Статус</th>
                <th className="px-5 py-3.5 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} className="border-b border-white/4 hover:bg-white/2 transition-colors last:border-0">
                  <td className="px-5 py-4 text-xs text-zinc-500 whitespace-nowrap">{fmtDate(r.createdAt)}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-white text-sm">{r.name}</div>
                    <div className="text-xs text-zinc-500 mt-0.5">{r.phone}</div>
                  </td>
                  <td className="px-5 py-4 text-xs text-zinc-400 hidden sm:table-cell">{r.model}</td>
                  <td className="px-5 py-4 text-xs text-zinc-400 hidden md:table-cell">{r.carType}</td>
                  <td className="px-5 py-4 text-xs text-zinc-400 hidden lg:table-cell whitespace-nowrap">
                    {r.year && `${r.year} г.`}{r.year && r.mileage && ' · '}{r.mileage && `${Number(r.mileage).toLocaleString('ru-RU')} км`}
                  </td>
                  <td className="px-5 py-4 text-xs text-zinc-500 hidden xl:table-cell max-w-[200px] truncate">{r.comment || '—'}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={async () => {
                      await apiUpdateRentOutStatus(r.id, r.status === 'new' ? 'done' : 'new');
                      refresh();
                    }}
                      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-colors ${
                        r.status === 'done'
                          ? 'bg-green-500/15 text-green-400 hover:bg-green-500/25'
                          : 'bg-gold-500/15 text-gold-400 hover:bg-gold-500/25'
                      }`}>
                      {r.status === 'done' ? <CheckCircle size={13} weight="fill" /> : <Circle size={13} />}
                      {r.status === 'done' ? 'Обработана' : 'Новая'}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={async () => { await apiDeleteRentOut(r.id); refresh(); }}
                      className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors">
                      <Trash size={13} className="text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="py-20 text-center rounded-2xl" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex justify-center mb-3">{icon}</div>
      <p className="text-sm text-zinc-600">{text}</p>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

type Tab = 'cars' | 'bookings' | 'rentout';

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('cars');
  const [bookingCount, setBookingCount] = useState(0);
  const [rentOutCount, setRentOutCount] = useState(0);

  const refreshCounts = useCallback(async () => {
    const [bookings, rentOut] = await Promise.all([apiGetBookings(), apiGetRentOut()]);
    setBookingCount(bookings.filter((b: BookingRequest) => b.status === 'new').length);
    setRentOutCount(rentOut.filter((r: RentOutRequest) => r.status === 'new').length);
  }, []);

  useEffect(() => {
    refreshCounts();
    const id = setInterval(refreshCounts, 15000);
    return () => clearInterval(id);
  }, [refreshCounts]);

  const tabs: { id: Tab; label: string; badge?: number; icon: React.ReactNode }[] = [
    { id: 'cars', label: 'Автомобили', icon: <CarSimple size={15} weight="fill" /> },
    { id: 'bookings', label: 'Аренда', badge: bookingCount, icon: <ClipboardText size={15} weight="fill" /> },
    { id: 'rentout', label: 'Сдача авто', badge: rentOutCount, icon: <PaperPlaneRight size={15} weight="fill" /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center gap-6">
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 rounded-full bg-gold-500 flex items-center justify-center">
              <CarSimple size={13} weight="fill" className="text-zinc-950" />
            </div>
            <span className="font-bold text-white text-sm">W4R <span className="text-zinc-500 font-normal">Admin</span></span>
          </div>

          <div className="flex items-center gap-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  tab === t.id
                    ? 'bg-white/8 text-white'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/4'
                }`}>
                {t.icon}
                {t.label}
                {t.badge ? (
                  <span className="w-4 h-4 rounded-full bg-gold-500 text-zinc-950 text-[9px] font-black flex items-center justify-center">
                    {t.badge > 9 ? '9+' : t.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          <button onClick={onLogout} className="ml-auto flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-3 py-2 rounded-xl hover:bg-white/4">
            <SignOut size={14} />
            Выйти
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {tab === 'cars' && <CarsTab />}
            {tab === 'bookings' && <BookingsTab />}
            {tab === 'rentout' && <RentOutTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [state, setState] = useState<'loading' | 'auth' | 'unauth'>('loading');

  useEffect(() => {
    setState(sessionStorage.getItem(AUTH_KEY) === '1' ? 'auth' : 'unauth');
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    setState('unauth');
  }, []);

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gold-500/30 border-t-gold-500 animate-spin" />
      </div>
    );
  }

  if (state === 'unauth') return <LoginScreen onLogin={() => setState('auth')} />;
  return <Dashboard onLogout={logout} />;
}
