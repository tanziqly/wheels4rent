import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Telegraf, Markup } from 'telegraf';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { Booking } from '../bookings/entities/booking.entity';
import { RentOutRequest } from '../rent-out/entities/rent-out-request.entity';

// ─── types ─────────────────────────────────────────────────────────────────────

type EntityType = 'b' | 'r';
type Filter     = 'all' | 'new' | 'done' | 'td' | 'wk' | 'mo' | 'dr';
type Action     = 'done' | 'undone' | 'del';

interface DateRange { from: Date; to: Date; label: string }
interface SearchCtx { t: EntityType }

const PAGE = 5;

// кнопки нижней панели (нужны для проверки в обработчике текста)
const PANEL_BUTTONS = new Set([
  '📋 Аренда', '🚗 Сдача авто', '🆕 Новые заявки', '📊 Статистика', '🔍 Поиск по дате',
]);

// ─── callback builders ─────────────────────────────────────────────────────────
// UUID содержит только '-', ':' — безопасный разделитель

const cb = {
  list:   (t: EntityType, f: Filter, p: number)                        => `L:${t}:${f}:${p}`,
  detail: (t: EntityType, id: string, f: Filter, p: number)            => `D:${t}:${id}:${f}:${p}`,
  action: (t: EntityType, a: Action, id: string, f: Filter, p: number) => `A:${t}:${a}:${id}:${f}:${p}`,
  notif:  (t: EntityType, a: Action, id: string)                       => `N:${t}:${a}:${id}`,
  search: (t: EntityType)                                               => `Q:${t}`,
};

function parseCb(data: string) {
  const p = data.split(':');
  switch (p[0]) {
    case 'L': return { kind: 'L' as const, t: p[1] as EntityType, f: p[2] as Filter, pg: +p[3] };
    case 'D': return { kind: 'D' as const, t: p[1] as EntityType, id: p[2], f: p[3] as Filter, pg: +p[4] };
    case 'A': return { kind: 'A' as const, t: p[1] as EntityType, a: p[2] as Action, id: p[3], f: p[4] as Filter, pg: +p[5] };
    case 'N': return { kind: 'N' as const, t: p[1] as EntityType, a: p[2] as Action, id: p[3] };
    case 'Q': return { kind: 'Q' as const, t: p[1] as EntityType };
    default:  return null;
  }
}

// ─── date helpers ──────────────────────────────────────────────────────────────

function fmtDate(d: string | Date) {
  return new Date(d).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

function shortDate(s: string) {
  if (!s) return '';
  const parts = s.split('-');
  return parts.length === 3 ? `${parts[2]}.${parts[1]}` : s;
}

function parseSingleDate(s: string): Date | null {
  const parts = s.split('.');
  if (parts.length < 2) return null;
  const day   = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year  = parts[2]
    ? (parts[2].length <= 2 ? 2000 + parseInt(parts[2], 10) : parseInt(parts[2], 10))
    : new Date().getFullYear();
  if (day < 1 || day > 31 || month < 0 || month > 11) return null;
  return new Date(year, month, day);
}

/**
 * Распознаёт форматы:
 *   01.06       → один день
 *   01.06.25    → один день с годом
 *   01.06-30.06 → промежуток
 */
function parseDateRange(text: string): DateRange | null {
  const t = text.trim();

  // промежуток: DD.MM[-DD.MM] или DD.MM.YY[-DD.MM.YY]
  const rangeRe = /^(\d{1,2}\.\d{1,2}(?:\.\d{2,4})?)-(\d{1,2}\.\d{1,2}(?:\.\d{2,4})?)$/;
  const rm = t.match(rangeRe);
  if (rm) {
    const from = parseSingleDate(rm[1]);
    const to   = parseSingleDate(rm[2]);
    if (!from || !to) return null;
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);
    return { from, to, label: `${rm[1]}–${rm[2]}` };
  }

  // одна дата
  const singleRe = /^(\d{1,2}\.\d{1,2}(?:\.\d{2,4})?)$/;
  const sm = t.match(singleRe);
  if (sm) {
    const from = parseSingleDate(sm[1]);
    if (!from) return null;
    from.setHours(0, 0, 0, 0);
    const to = new Date(from);
    to.setHours(23, 59, 59, 999);
    return { from, to, label: sm[1] };
  }

  return null;
}

function filterLabel(f: Filter, drLabel?: string): string {
  const MAP: Record<Filter, string> = {
    all:  'Все',
    new:  '🆕 Новые',
    done: '✅ Готово',
    td:   '📅 Сегодня',
    wk:   '📆 7 дней',
    mo:   '📆 30 дней',
    dr:   drLabel ? `🔍 ${drLabel}` : '🔍 Период',
  };
  return MAP[f] ?? f;
}

// ─── text cards ────────────────────────────────────────────────────────────────

function bookingRowText(b: Booking): string {
  const icon  = b.status === 'done' ? '✅' : '🆕';
  const name  = b.name.split(' ')[0];
  const car   = b.carName ? ` · ${b.carName}` : '';
  const dates = b.dateStart
    ? ` · ${shortDate(b.dateStart)}` + (b.dateEnd ? `→${shortDate(b.dateEnd)}` : '')
    : '';
  const full  = `${icon} ${name}${car}${dates}`;
  return full.length > 42 ? full.slice(0, 41) + '…' : full;
}

function rentOutRowText(r: RentOutRequest): string {
  const icon = r.status === 'done' ? '✅' : '🆕';
  const name = r.name.split(' ')[0];
  const full = `${icon} ${name} · ${r.model}`;
  return full.length > 42 ? full.slice(0, 41) + '…' : full;
}

function bookingCard(b: Booking, forNotif = false): string {
  const status = b.status === 'done' ? '✅ Выполнена' : '🆕 Новая';
  const title  = forNotif ? '🔔 <b>Новая заявка на аренду!</b>' : '<b>📋 Аренда — заявка</b>';
  return [
    title, '',
    `<b>Статус:</b> ${status}`,
    '──────────────────',
    `👤 ${b.name}`,
    `📞 <code>${b.phone}</code>`,
    b.carName              ? `🚗 ${b.carName}` : null,
    b.dateStart && b.dateEnd ? `📅 ${b.dateStart} → ${b.dateEnd}` : null,
    `🚚 Доставка: ${b.delivery === 'yes' ? '✔ Да' : '✘ Нет'}`,
    `💬 ${b.comment || '—'}`,
    '',
    `<i>⏱ ${fmtDate(b.createdAt)}</i>`,
  ].filter(l => l !== null).join('\n');
}

function rentOutCard(r: RentOutRequest, forNotif = false): string {
  const status = r.status === 'done' ? '✅ Выполнена' : '🆕 Новая';
  const title  = forNotif ? '🔔 <b>Новая заявка на сдачу авто!</b>' : '<b>🚗 Сдача авто — заявка</b>';
  const specs  = [
    r.year    ? `${r.year} г.` : null,
    r.mileage ? `${Number(r.mileage).toLocaleString('ru-RU')} км` : null,
  ].filter(Boolean).join(' · ');
  return [
    title, '',
    `<b>Статус:</b> ${status}`,
    '──────────────────',
    `👤 ${r.name}`,
    `📞 <code>${r.phone}</code>`,
    `🚗 ${r.model}`,
    `🏷 ${r.carType}`,
    specs       ? `📊 ${specs}` : null,
    `💬 ${r.comment || '—'}`,
    '',
    `<i>⏱ ${fmtDate(r.createdAt)}</i>`,
  ].filter(l => l !== null).join('\n');
}

// ─── keyboards ─────────────────────────────────────────────────────────────────

/** Постоянная нижняя панель управления */
const MAIN_KB = Markup.keyboard([
  ['📋 Аренда',        '🚗 Сдача авто'],
  ['🆕 Новые заявки',  '📊 Статистика'],
  ['🔍 Поиск по дате'],
]).resize();

function detailKeyboard(t: EntityType, item: Booking | RentOutRequest, f: Filter, pg: number) {
  const id        = item.id;
  const statusBtn = item.status === 'done'
    ? Markup.button.callback('🔄 Вернуть',    cb.action(t, 'undone', id, f, pg))
    : Markup.button.callback('✅ Выполнено',  cb.action(t, 'done',   id, f, pg));
  return Markup.inlineKeyboard([
    [statusBtn, Markup.button.callback('🗑 Удалить', cb.action(t, 'del', id, f, pg))],
    [Markup.button.callback('◀ Назад к списку', cb.list(t, f, pg))],
  ]);
}

function notifKeyboard(t: EntityType, item: Booking | RentOutRequest) {
  const id        = item.id;
  const statusBtn = item.status === 'done'
    ? Markup.button.callback('🔄 Вернуть',   cb.notif(t, 'undone', id))
    : Markup.button.callback('✅ Выполнено', cb.notif(t, 'done',   id));
  return Markup.inlineKeyboard([
    [statusBtn, Markup.button.callback('🗑 Удалить', cb.notif(t, 'del', id))],
  ]);
}

function listKeyboard(
  t: EntityType,
  items: Array<Booking | RentOutRequest>,
  f: Filter,
  pg: number,
  totalPages: number,
) {
  const rows: any[] = [];

  // каждая заявка — отдельная кнопка-строка
  for (const item of items) {
    const text = t === 'b' ? bookingRowText(item as Booking) : rentOutRowText(item as RentOutRequest);
    rows.push([Markup.button.callback(text, cb.detail(t, item.id, f, pg))]);
  }

  // фильтры по статусу
  rows.push([
    Markup.button.callback(f === 'all'  ? '▸ Все'       : 'Все',       cb.list(t, 'all',  0)),
    Markup.button.callback(f === 'new'  ? '▸ 🆕 Новые'  : '🆕 Новые',  cb.list(t, 'new',  0)),
    Markup.button.callback(f === 'done' ? '▸ ✅ Готово' : '✅ Готово', cb.list(t, 'done', 0)),
  ]);

  // фильтры по дате
  rows.push([
    Markup.button.callback(f === 'td' ? '▸ Сег.'   : 'Сег.',    cb.list(t, 'td', 0)),
    Markup.button.callback(f === 'wk' ? '▸ 7 дн.'  : '7 дн.',   cb.list(t, 'wk', 0)),
    Markup.button.callback(f === 'mo' ? '▸ 30 дн.' : '30 дн.',  cb.list(t, 'mo', 0)),
    Markup.button.callback(f === 'dr' ? '▸ 🔍 Дата' : '🔍 Дата', cb.search(t)),
  ]);

  // пагинация
  if (totalPages > 1) {
    const nav: any[] = [];
    if (pg > 0)               nav.push(Markup.button.callback('◀', cb.list(t, f, pg - 1)));
    nav.push(Markup.button.callback(`${pg + 1} / ${totalPages}`, 'noop'));
    if (pg < totalPages - 1)  nav.push(Markup.button.callback('▶', cb.list(t, f, pg + 1)));
    rows.push(nav);
  }

  return Markup.inlineKeyboard(rows);
}

// ─── service ───────────────────────────────────────────────────────────────────

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly log = new Logger(TelegramService.name);
  private bot: Telegraf | null = null;
  private adminChatId: string;

  // per-chat state
  private dateRanges  = new Map<string, DateRange>(); // key: `${chatId}:${t}`
  private searchQueue = new Map<string, SearchCtx>(); // chatId → ждёт ввода даты

  constructor(
    @InjectRepository(Booking)         private bookingsRepo: Repository<Booking>,
    @InjectRepository(RentOutRequest)  private rentOutRepo:  Repository<RentOutRequest>,
    private config: ConfigService,
  ) {}

  async onModuleInit() {
    const token = this.config.get<string>('TELEGRAM_BOT_TOKEN');
    this.adminChatId = this.config.get<string>('TELEGRAM_ADMIN_CHAT_ID');

    if (!token || !this.adminChatId) {
      this.log.warn('Telegram bot disabled — задай TELEGRAM_BOT_TOKEN и TELEGRAM_ADMIN_CHAT_ID');
      return;
    }

    const proxyUrl = this.config.get<string>('TELEGRAM_PROXY_URL');
    let agent: any = undefined;
    if (proxyUrl) {
      agent = proxyUrl.startsWith('socks')
        ? new SocksProxyAgent(proxyUrl)
        : new HttpsProxyAgent(proxyUrl);
      this.log.log(`🔌 Using proxy: ${proxyUrl.replace(/:([^:@]+)@/, ':***@')}`);
    }

    this.bot = new Telegraf(token, { telegram: { agent } });
    this.registerHandlers();
    this.bot.launch().catch((e) => this.log.error('Bot launch:', e));
    this.log.log('✅ Telegram bot started');
  }

  async onModuleDestroy() {
    this.bot?.stop('shutdown');
  }

  // ─── уведомления ────────────────────────────────────────────────────────────

  @OnEvent('booking.created')
  async notifyBooking(booking: Booking) {
    if (!this.bot) return;
    await this.bot.telegram.sendMessage(
      this.adminChatId,
      bookingCard(booking, true),
      { parse_mode: 'HTML', ...notifKeyboard('b', booking) },
    ).catch((e) => this.log.error('notify booking:', e));
  }

  @OnEvent('rentout.created')
  async notifyRentOut(req: RentOutRequest) {
    if (!this.bot) return;
    await this.bot.telegram.sendMessage(
      this.adminChatId,
      rentOutCard(req, true),
      { parse_mode: 'HTML', ...notifKeyboard('r', req) },
    ).catch((e) => this.log.error('notify rentout:', e));
  }

  // ─── регистрация хендлеров ──────────────────────────────────────────────────

  private registerHandlers() {
    const bot = this.bot!;

    // /start — показываем панель управления
    bot.command(['start', 'menu'], (ctx) =>
      ctx.replyWithHTML(
        `<b>🚗 Wheels4Rent — Admin</b>\n\n` +
        `Используй кнопки панели управления ниже или команды:\n` +
        `/bookings — заявки на аренду\n` +
        `/rentout  — заявки на сдачу авто\n` +
        `/new      — необработанные\n` +
        `/stats    — статистика\n` +
        `/search   — поиск по дате`,
        MAIN_KB,
      ),
    );

    // команды
    bot.command('bookings', (ctx) => { this.clearSearch(ctx); this.renderList(ctx, 'b', 'all', 0, false); });
    bot.command('rentout',  (ctx) => { this.clearSearch(ctx); this.renderList(ctx, 'r', 'all', 0, false); });
    bot.command('new',      (ctx) => { this.clearSearch(ctx); this.showNew(ctx); });
    bot.command('stats',    (ctx) => { this.clearSearch(ctx); this.showStats(ctx); });
    bot.command('search',   (ctx) => { this.clearSearch(ctx); this.promptSearch(ctx, null); });

    // нижняя панель (reply keyboard)
    bot.hears('📋 Аренда',        (ctx) => { this.clearSearch(ctx); this.renderList(ctx, 'b', 'all', 0, false); });
    bot.hears('🚗 Сдача авто',    (ctx) => { this.clearSearch(ctx); this.renderList(ctx, 'r', 'all', 0, false); });
    bot.hears('🆕 Новые заявки',  (ctx) => { this.clearSearch(ctx); this.showNew(ctx); });
    bot.hears('📊 Статистика',    (ctx) => { this.clearSearch(ctx); this.showStats(ctx); });
    bot.hears('🔍 Поиск по дате', (ctx) => { this.clearSearch(ctx); this.promptSearch(ctx, null); });

    // текстовые сообщения — ввод даты в режиме поиска
    bot.on('text', async (ctx) => {
      const chatId = String(ctx.chat.id);
      const sq     = this.searchQueue.get(chatId);
      if (!sq) return;

      const text = (ctx.message as any).text as string;

      // игнорируем кнопки нижней панели и команды
      if (PANEL_BUTTONS.has(text) || text.startsWith('/')) return;

      const range = parseDateRange(text);
      if (!range) {
        return ctx.replyWithHTML(
          `⚠️ Не могу распознать дату.\n\n` +
          `Допустимые форматы:\n` +
          `• <code>01.06</code> — один день\n` +
          `• <code>01.06.25</code> — день с годом\n` +
          `• <code>01.06-30.06</code> — промежуток`,
        );
      }

      this.searchQueue.delete(chatId);
      this.dateRanges.set(`${chatId}:${sq.t}`, range);
      await this.renderList(ctx, sq.t, 'dr', 0, false);
    });

    // callback кнопки
    bot.on('callback_query', async (ctx) => {
      const data = (ctx.callbackQuery as any).data as string | undefined;
      if (!data || data === 'noop') return ctx.answerCbQuery();

      const parsed = parseCb(data);
      if (!parsed) return ctx.answerCbQuery();

      const chatId = String(
        (ctx.callbackQuery as any).message?.chat?.id ?? this.adminChatId,
      );

      try {
        switch (parsed.kind) {
          case 'L':
            await this.renderList(ctx, parsed.t, parsed.f, parsed.pg, true);
            return ctx.answerCbQuery();
          case 'D':
            await this.renderDetail(ctx, parsed.t, parsed.id, parsed.f, parsed.pg, true);
            return ctx.answerCbQuery();
          case 'A':
            await this.execAction(ctx, parsed.t, parsed.a, parsed.id, parsed.f, parsed.pg, false);
            break;
          case 'N':
            await this.execAction(ctx, parsed.t, parsed.a, parsed.id, 'all', 0, true);
            break;
          case 'Q':
            await this.promptSearchFromInline(ctx, parsed.t, chatId);
            return ctx.answerCbQuery('Введи дату ниже 👇');
        }
      } catch (e) {
        this.log.error('callback error:', e);
        ctx.answerCbQuery('Ошибка, попробуй снова');
      }
    });
  }

  // ─── поиск ──────────────────────────────────────────────────────────────────

  private clearSearch(ctx: any) {
    const chatId = String(ctx.chat?.id ?? ctx.from?.id);
    this.searchQueue.delete(chatId);
  }

  private async promptSearch(ctx: any, t: EntityType | null) {
    if (t) {
      const chatId = String(ctx.chat?.id ?? ctx.from?.id);
      this.searchQueue.set(chatId, { t });
      await ctx.replyWithHTML(
        `🔍 <b>Поиск по дате · ${t === 'b' ? 'Аренда' : 'Сдача авто'}</b>\n\n` +
        `Введите дату или промежуток:\n` +
        `• <code>01.06</code> — один день\n` +
        `• <code>01.06.25</code> — с указанием года\n` +
        `• <code>01.06-30.06</code> — период`,
      );
    } else {
      // сначала выбираем тип
      await ctx.replyWithHTML(
        `🔍 <b>Поиск по дате</b>\nВыберите тип заявок:`,
        Markup.inlineKeyboard([
          [
            Markup.button.callback('📋 Аренда',     cb.search('b')),
            Markup.button.callback('🚗 Сдача авто', cb.search('r')),
          ],
        ]),
      );
    }
  }

  private async promptSearchFromInline(ctx: any, t: EntityType, chatId: string) {
    this.searchQueue.set(chatId, { t });
    await ctx.replyWithHTML(
      `🔍 <b>Поиск · ${t === 'b' ? 'Аренда' : 'Сдача авто'}</b>\n\n` +
      `Введите дату или промежуток:\n` +
      `• <code>01.06</code> — один день\n` +
      `• <code>01.06.25</code> — с указанием года\n` +
      `• <code>01.06-30.06</code> — период`,
    );
  }

  // ─── /new ────────────────────────────────────────────────────────────────────

  private async showNew(ctx: any) {
    const [bn, rn] = await Promise.all([
      this.bookingsRepo.count({ where: { status: 'new' } }),
      this.rentOutRepo.count({ where: { status: 'new' } }),
    ]);
    if (bn + rn === 0) return ctx.reply('✅ Новых заявок нет');

    await ctx.replyWithHTML(
      `🆕 <b>Необработанных: ${bn + rn}</b>\nАренда: ${bn} · Сдача авто: ${rn}`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback(`📋 Аренда (${bn})`,     cb.list('b', 'new', 0)),
          Markup.button.callback(`🚗 Сдача авто (${rn})`, cb.list('r', 'new', 0)),
        ],
      ]),
    );
  }

  // ─── /stats ──────────────────────────────────────────────────────────────────

  private async showStats(ctx: any) {
    const [bAll, bNew, rAll, rNew] = await Promise.all([
      this.bookingsRepo.count(),
      this.bookingsRepo.count({ where: { status: 'new' } }),
      this.rentOutRepo.count(),
      this.rentOutRepo.count({ where: { status: 'new' } }),
    ]);
    const now   = new Date();
    const today = new Date(now); today.setHours(0, 0, 0, 0);
    const week  = new Date(now); week.setDate(now.getDate() - 7); week.setHours(0, 0, 0, 0);

    const [bToday, bWeek, rToday, rWeek] = await Promise.all([
      this.bookingsRepo.count({ where: { createdAt: MoreThanOrEqual(today) } } as any),
      this.bookingsRepo.count({ where: { createdAt: MoreThanOrEqual(week) }  } as any),
      this.rentOutRepo.count({ where: { createdAt: MoreThanOrEqual(today) }  } as any),
      this.rentOutRepo.count({ where: { createdAt: MoreThanOrEqual(week) }   } as any),
    ]);

    await ctx.replyWithHTML(
      `<b>📊 Статистика</b>\n` +
      `──────────────────\n` +
      `<b>📋 Аренда:</b>\n` +
      `  Всего: ${bAll}  ·  🆕 ${bNew}  ·  ✅ ${bAll - bNew}\n` +
      `  За сегодня: ${bToday}  ·  За 7 дней: ${bWeek}\n\n` +
      `<b>🚗 Сдача авто:</b>\n` +
      `  Всего: ${rAll}  ·  🆕 ${rNew}  ·  ✅ ${rAll - rNew}\n` +
      `  За сегодня: ${rToday}  ·  За 7 дней: ${rWeek}`,
    );
  }

  // ─── buildWhere ──────────────────────────────────────────────────────────────

  private buildWhere(f: Filter, chatId: string, t: EntityType): any {
    const where: any = {};
    const now = new Date();

    if (f === 'new')  where.status = 'new';
    if (f === 'done') where.status = 'done';

    if (f === 'td') {
      const from = new Date(now); from.setHours(0, 0, 0, 0);
      const to   = new Date(now); to.setHours(23, 59, 59, 999);
      where.createdAt = Between(from, to);
    } else if (f === 'wk') {
      const from = new Date(now); from.setDate(now.getDate() - 7); from.setHours(0, 0, 0, 0);
      where.createdAt = MoreThanOrEqual(from);
    } else if (f === 'mo') {
      const from = new Date(now); from.setDate(now.getDate() - 30); from.setHours(0, 0, 0, 0);
      where.createdAt = MoreThanOrEqual(from);
    } else if (f === 'dr') {
      const range = this.dateRanges.get(`${chatId}:${t}`);
      if (range) where.createdAt = Between(range.from, range.to);
    }

    return where;
  }

  // ─── renderList ──────────────────────────────────────────────────────────────

  private async renderList(ctx: any, t: EntityType, f: Filter, pg: number, edit: boolean) {
    const repo   = t === 'b' ? this.bookingsRepo : this.rentOutRepo;
    const label  = t === 'b' ? 'Аренда' : 'Сдача авто';
    const chatId = String(ctx.chat?.id ?? ctx.callbackQuery?.message?.chat?.id ?? this.adminChatId);

    const where = this.buildWhere(f, chatId, t);
    const all   = await repo.find({ where, order: { createdAt: 'DESC' } } as any);

    const totalNew  = await repo.count({ where: { status: 'new'  } } as any);
    const totalDone = await repo.count({ where: { status: 'done' } } as any);

    const totalPages = Math.max(1, Math.ceil(all.length / PAGE));
    const safePg     = Math.min(pg, totalPages - 1);
    const items      = all.slice(safePg * PAGE, safePg * PAGE + PAGE);

    const drRange = this.dateRanges.get(`${chatId}:${t}`);
    const fLabel  = filterLabel(f, drRange?.label);

    const header =
      `<b>📋 ${label} · ${fLabel}</b>\n` +
      `──────────────────\n` +
      (all.length === 0
        ? 'Заявок нет'
        : `Показано: ${all.length}  ·  🆕 ${totalNew}  ·  ✅ ${totalDone}`
      );

    const kb = listKeyboard(t, items, f, safePg, totalPages);

    try {
      if (edit) {
        await ctx.editMessageText(header, { parse_mode: 'HTML', ...kb });
      } else {
        await ctx.replyWithHTML(header, kb);
      }
    } catch {
      await ctx.replyWithHTML(header, kb);
    }
  }

  // ─── renderDetail ────────────────────────────────────────────────────────────

  private async renderDetail(ctx: any, t: EntityType, id: string, f: Filter, pg: number, edit: boolean) {
    const item = t === 'b'
      ? await this.bookingsRepo.findOneBy({ id })
      : await this.rentOutRepo.findOneBy({ id });

    if (!item) {
      const text = '⚠️ Заявка не найдена (возможно удалена)';
      if (edit) {
        await ctx.editMessageText(text, Markup.inlineKeyboard([[
          Markup.button.callback('◀ Назад', cb.list(t, f, pg)),
        ]]));
      } else {
        await ctx.reply(text);
      }
      return;
    }

    const card = t === 'b' ? bookingCard(item as Booking) : rentOutCard(item as RentOutRequest);
    const kb   = detailKeyboard(t, item, f, pg);

    if (edit) {
      await ctx.editMessageText(card, { parse_mode: 'HTML', ...kb });
    } else {
      await ctx.replyWithHTML(card, kb);
    }
  }

  // ─── execAction ──────────────────────────────────────────────────────────────

  private async execAction(
    ctx: any, t: EntityType, a: Action, id: string, f: Filter, pg: number, isNotif: boolean,
  ) {
    const repo = t === 'b' ? this.bookingsRepo : this.rentOutRepo;
    const item = await repo.findOneBy({ id } as any);
    if (!item) return ctx.answerCbQuery('⚠️ Заявка не найдена');

    if (a === 'del') {
      await repo.delete(id);
      if (isNotif) {
        await ctx.deleteMessage().catch(() => {});
        return ctx.answerCbQuery('🗑 Удалено');
      }
      await ctx.answerCbQuery('🗑 Удалено');
      return this.renderList(ctx, t, f, pg, true);
    }

    (item as any).status = a === 'done' ? 'done' : 'new';
    await (repo as Repository<any>).save(item);

    const card = t === 'b' ? bookingCard(item as Booking) : rentOutCard(item as RentOutRequest);
    const kb   = isNotif ? notifKeyboard(t, item) : detailKeyboard(t, item, f, pg);

    await ctx.editMessageText(card, { parse_mode: 'HTML', ...kb });
    ctx.answerCbQuery(a === 'done' ? '✅ Выполнено' : '🔄 Возвращено');
  }
}
