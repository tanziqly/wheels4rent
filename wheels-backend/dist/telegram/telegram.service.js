"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TelegramService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const telegraf_1 = require("telegraf");
const booking_entity_1 = require("../bookings/entities/booking.entity");
const rent_out_request_entity_1 = require("../rent-out/entities/rent-out-request.entity");
const PAGE = 5;
const PANEL_BUTTONS = new Set([
    '📋 Аренда', '🚗 Сдача авто', '🆕 Новые заявки', '📊 Статистика', '🔍 Поиск по дате',
]);
const cb = {
    list: (t, f, p) => `L:${t}:${f}:${p}`,
    detail: (t, id, f, p) => `D:${t}:${id}:${f}:${p}`,
    action: (t, a, id, f, p) => `A:${t}:${a}:${id}:${f}:${p}`,
    notif: (t, a, id) => `N:${t}:${a}:${id}`,
    search: (t) => `Q:${t}`,
};
function parseCb(data) {
    const p = data.split(':');
    switch (p[0]) {
        case 'L': return { kind: 'L', t: p[1], f: p[2], pg: +p[3] };
        case 'D': return { kind: 'D', t: p[1], id: p[2], f: p[3], pg: +p[4] };
        case 'A': return { kind: 'A', t: p[1], a: p[2], id: p[3], f: p[4], pg: +p[5] };
        case 'N': return { kind: 'N', t: p[1], a: p[2], id: p[3] };
        case 'Q': return { kind: 'Q', t: p[1] };
        default: return null;
    }
}
function fmtDate(d) {
    return new Date(d).toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: '2-digit',
        hour: '2-digit', minute: '2-digit',
    });
}
function shortDate(s) {
    if (!s)
        return '';
    const parts = s.split('-');
    return parts.length === 3 ? `${parts[2]}.${parts[1]}` : s;
}
function parseSingleDate(s) {
    const parts = s.split('.');
    if (parts.length < 2)
        return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parts[2]
        ? (parts[2].length <= 2 ? 2000 + parseInt(parts[2], 10) : parseInt(parts[2], 10))
        : new Date().getFullYear();
    if (day < 1 || day > 31 || month < 0 || month > 11)
        return null;
    return new Date(year, month, day);
}
function parseDateRange(text) {
    const t = text.trim();
    const rangeRe = /^(\d{1,2}\.\d{1,2}(?:\.\d{2,4})?)-(\d{1,2}\.\d{1,2}(?:\.\d{2,4})?)$/;
    const rm = t.match(rangeRe);
    if (rm) {
        const from = parseSingleDate(rm[1]);
        const to = parseSingleDate(rm[2]);
        if (!from || !to)
            return null;
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        return { from, to, label: `${rm[1]}–${rm[2]}` };
    }
    const singleRe = /^(\d{1,2}\.\d{1,2}(?:\.\d{2,4})?)$/;
    const sm = t.match(singleRe);
    if (sm) {
        const from = parseSingleDate(sm[1]);
        if (!from)
            return null;
        from.setHours(0, 0, 0, 0);
        const to = new Date(from);
        to.setHours(23, 59, 59, 999);
        return { from, to, label: sm[1] };
    }
    return null;
}
function filterLabel(f, drLabel) {
    const MAP = {
        all: 'Все',
        new: '🆕 Новые',
        done: '✅ Готово',
        td: '📅 Сегодня',
        wk: '📆 7 дней',
        mo: '📆 30 дней',
        dr: drLabel ? `🔍 ${drLabel}` : '🔍 Период',
    };
    return MAP[f] ?? f;
}
function bookingRowText(b) {
    const icon = b.status === 'done' ? '✅' : '🆕';
    const name = b.name.split(' ')[0];
    const car = b.carName ? ` · ${b.carName}` : '';
    const dates = b.dateStart
        ? ` · ${shortDate(b.dateStart)}` + (b.dateEnd ? `→${shortDate(b.dateEnd)}` : '')
        : '';
    const full = `${icon} ${name}${car}${dates}`;
    return full.length > 42 ? full.slice(0, 41) + '…' : full;
}
function rentOutRowText(r) {
    const icon = r.status === 'done' ? '✅' : '🆕';
    const name = r.name.split(' ')[0];
    const full = `${icon} ${name} · ${r.model}`;
    return full.length > 42 ? full.slice(0, 41) + '…' : full;
}
function bookingCard(b, forNotif = false) {
    const status = b.status === 'done' ? '✅ Выполнена' : '🆕 Новая';
    const title = forNotif ? '🔔 <b>Новая заявка на аренду!</b>' : '<b>📋 Аренда — заявка</b>';
    return [
        title, '',
        `<b>Статус:</b> ${status}`,
        '──────────────────',
        `👤 ${b.name}`,
        `📞 <code>${b.phone}</code>`,
        b.carName ? `🚗 ${b.carName}` : null,
        b.dateStart && b.dateEnd ? `📅 ${b.dateStart} → ${b.dateEnd}` : null,
        `🚚 Доставка: ${b.delivery === 'yes' ? '✔ Да' : '✘ Нет'}`,
        `💬 ${b.comment || '—'}`,
        '',
        `<i>⏱ ${fmtDate(b.createdAt)}</i>`,
    ].filter(l => l !== null).join('\n');
}
function rentOutCard(r, forNotif = false) {
    const status = r.status === 'done' ? '✅ Выполнена' : '🆕 Новая';
    const title = forNotif ? '🔔 <b>Новая заявка на сдачу авто!</b>' : '<b>🚗 Сдача авто — заявка</b>';
    const specs = [
        r.year ? `${r.year} г.` : null,
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
        specs ? `📊 ${specs}` : null,
        `💬 ${r.comment || '—'}`,
        '',
        `<i>⏱ ${fmtDate(r.createdAt)}</i>`,
    ].filter(l => l !== null).join('\n');
}
const MAIN_KB = telegraf_1.Markup.keyboard([
    ['📋 Аренда', '🚗 Сдача авто'],
    ['🆕 Новые заявки', '📊 Статистика'],
    ['🔍 Поиск по дате'],
]).resize();
function detailKeyboard(t, item, f, pg) {
    const id = item.id;
    const statusBtn = item.status === 'done'
        ? telegraf_1.Markup.button.callback('🔄 Вернуть', cb.action(t, 'undone', id, f, pg))
        : telegraf_1.Markup.button.callback('✅ Выполнено', cb.action(t, 'done', id, f, pg));
    return telegraf_1.Markup.inlineKeyboard([
        [statusBtn, telegraf_1.Markup.button.callback('🗑 Удалить', cb.action(t, 'del', id, f, pg))],
        [telegraf_1.Markup.button.callback('◀ Назад к списку', cb.list(t, f, pg))],
    ]);
}
function notifKeyboard(t, item) {
    const id = item.id;
    const statusBtn = item.status === 'done'
        ? telegraf_1.Markup.button.callback('🔄 Вернуть', cb.notif(t, 'undone', id))
        : telegraf_1.Markup.button.callback('✅ Выполнено', cb.notif(t, 'done', id));
    return telegraf_1.Markup.inlineKeyboard([
        [statusBtn, telegraf_1.Markup.button.callback('🗑 Удалить', cb.notif(t, 'del', id))],
    ]);
}
function listKeyboard(t, items, f, pg, totalPages) {
    const rows = [];
    for (const item of items) {
        const text = t === 'b' ? bookingRowText(item) : rentOutRowText(item);
        rows.push([telegraf_1.Markup.button.callback(text, cb.detail(t, item.id, f, pg))]);
    }
    rows.push([
        telegraf_1.Markup.button.callback(f === 'all' ? '▸ Все' : 'Все', cb.list(t, 'all', 0)),
        telegraf_1.Markup.button.callback(f === 'new' ? '▸ 🆕 Новые' : '🆕 Новые', cb.list(t, 'new', 0)),
        telegraf_1.Markup.button.callback(f === 'done' ? '▸ ✅ Готово' : '✅ Готово', cb.list(t, 'done', 0)),
    ]);
    rows.push([
        telegraf_1.Markup.button.callback(f === 'td' ? '▸ Сег.' : 'Сег.', cb.list(t, 'td', 0)),
        telegraf_1.Markup.button.callback(f === 'wk' ? '▸ 7 дн.' : '7 дн.', cb.list(t, 'wk', 0)),
        telegraf_1.Markup.button.callback(f === 'mo' ? '▸ 30 дн.' : '30 дн.', cb.list(t, 'mo', 0)),
        telegraf_1.Markup.button.callback(f === 'dr' ? '▸ 🔍 Дата' : '🔍 Дата', cb.search(t)),
    ]);
    if (totalPages > 1) {
        const nav = [];
        if (pg > 0)
            nav.push(telegraf_1.Markup.button.callback('◀', cb.list(t, f, pg - 1)));
        nav.push(telegraf_1.Markup.button.callback(`${pg + 1} / ${totalPages}`, 'noop'));
        if (pg < totalPages - 1)
            nav.push(telegraf_1.Markup.button.callback('▶', cb.list(t, f, pg + 1)));
        rows.push(nav);
    }
    return telegraf_1.Markup.inlineKeyboard(rows);
}
let TelegramService = TelegramService_1 = class TelegramService {
    constructor(bookingsRepo, rentOutRepo, config) {
        this.bookingsRepo = bookingsRepo;
        this.rentOutRepo = rentOutRepo;
        this.config = config;
        this.log = new common_1.Logger(TelegramService_1.name);
        this.bot = null;
        this.dateRanges = new Map();
        this.searchQueue = new Map();
    }
    async onModuleInit() {
        const token = this.config.get('TELEGRAM_BOT_TOKEN');
        this.adminChatId = this.config.get('TELEGRAM_ADMIN_CHAT_ID');
        if (!token || !this.adminChatId) {
            this.log.warn('Telegram bot disabled — задай TELEGRAM_BOT_TOKEN и TELEGRAM_ADMIN_CHAT_ID');
            return;
        }
        this.bot = new telegraf_1.Telegraf(token);
        this.registerHandlers();
        this.bot.launch().catch((e) => this.log.error('Bot launch:', e));
        this.log.log('✅ Telegram bot started');
    }
    async onModuleDestroy() {
        this.bot?.stop('shutdown');
    }
    async notifyBooking(booking) {
        if (!this.bot)
            return;
        await this.bot.telegram.sendMessage(this.adminChatId, bookingCard(booking, true), { parse_mode: 'HTML', ...notifKeyboard('b', booking) }).catch((e) => this.log.error('notify booking:', e));
    }
    async notifyRentOut(req) {
        if (!this.bot)
            return;
        await this.bot.telegram.sendMessage(this.adminChatId, rentOutCard(req, true), { parse_mode: 'HTML', ...notifKeyboard('r', req) }).catch((e) => this.log.error('notify rentout:', e));
    }
    registerHandlers() {
        const bot = this.bot;
        bot.command(['start', 'menu'], (ctx) => ctx.replyWithHTML(`<b>🚗 Wheels4Rent — Admin</b>\n\n` +
            `Используй кнопки панели управления ниже или команды:\n` +
            `/bookings — заявки на аренду\n` +
            `/rentout  — заявки на сдачу авто\n` +
            `/new      — необработанные\n` +
            `/stats    — статистика\n` +
            `/search   — поиск по дате`, MAIN_KB));
        bot.command('bookings', (ctx) => { this.clearSearch(ctx); this.renderList(ctx, 'b', 'all', 0, false); });
        bot.command('rentout', (ctx) => { this.clearSearch(ctx); this.renderList(ctx, 'r', 'all', 0, false); });
        bot.command('new', (ctx) => { this.clearSearch(ctx); this.showNew(ctx); });
        bot.command('stats', (ctx) => { this.clearSearch(ctx); this.showStats(ctx); });
        bot.command('search', (ctx) => { this.clearSearch(ctx); this.promptSearch(ctx, null); });
        bot.hears('📋 Аренда', (ctx) => { this.clearSearch(ctx); this.renderList(ctx, 'b', 'all', 0, false); });
        bot.hears('🚗 Сдача авто', (ctx) => { this.clearSearch(ctx); this.renderList(ctx, 'r', 'all', 0, false); });
        bot.hears('🆕 Новые заявки', (ctx) => { this.clearSearch(ctx); this.showNew(ctx); });
        bot.hears('📊 Статистика', (ctx) => { this.clearSearch(ctx); this.showStats(ctx); });
        bot.hears('🔍 Поиск по дате', (ctx) => { this.clearSearch(ctx); this.promptSearch(ctx, null); });
        bot.on('text', async (ctx) => {
            const chatId = String(ctx.chat.id);
            const sq = this.searchQueue.get(chatId);
            if (!sq)
                return;
            const text = ctx.message.text;
            if (PANEL_BUTTONS.has(text) || text.startsWith('/'))
                return;
            const range = parseDateRange(text);
            if (!range) {
                return ctx.replyWithHTML(`⚠️ Не могу распознать дату.\n\n` +
                    `Допустимые форматы:\n` +
                    `• <code>01.06</code> — один день\n` +
                    `• <code>01.06.25</code> — день с годом\n` +
                    `• <code>01.06-30.06</code> — промежуток`);
            }
            this.searchQueue.delete(chatId);
            this.dateRanges.set(`${chatId}:${sq.t}`, range);
            await this.renderList(ctx, sq.t, 'dr', 0, false);
        });
        bot.on('callback_query', async (ctx) => {
            const data = ctx.callbackQuery.data;
            if (!data || data === 'noop')
                return ctx.answerCbQuery();
            const parsed = parseCb(data);
            if (!parsed)
                return ctx.answerCbQuery();
            const chatId = String(ctx.callbackQuery.message?.chat?.id ?? this.adminChatId);
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
            }
            catch (e) {
                this.log.error('callback error:', e);
                ctx.answerCbQuery('Ошибка, попробуй снова');
            }
        });
    }
    clearSearch(ctx) {
        const chatId = String(ctx.chat?.id ?? ctx.from?.id);
        this.searchQueue.delete(chatId);
    }
    async promptSearch(ctx, t) {
        if (t) {
            const chatId = String(ctx.chat?.id ?? ctx.from?.id);
            this.searchQueue.set(chatId, { t });
            await ctx.replyWithHTML(`🔍 <b>Поиск по дате · ${t === 'b' ? 'Аренда' : 'Сдача авто'}</b>\n\n` +
                `Введите дату или промежуток:\n` +
                `• <code>01.06</code> — один день\n` +
                `• <code>01.06.25</code> — с указанием года\n` +
                `• <code>01.06-30.06</code> — период`);
        }
        else {
            await ctx.replyWithHTML(`🔍 <b>Поиск по дате</b>\nВыберите тип заявок:`, telegraf_1.Markup.inlineKeyboard([
                [
                    telegraf_1.Markup.button.callback('📋 Аренда', cb.search('b')),
                    telegraf_1.Markup.button.callback('🚗 Сдача авто', cb.search('r')),
                ],
            ]));
        }
    }
    async promptSearchFromInline(ctx, t, chatId) {
        this.searchQueue.set(chatId, { t });
        await ctx.replyWithHTML(`🔍 <b>Поиск · ${t === 'b' ? 'Аренда' : 'Сдача авто'}</b>\n\n` +
            `Введите дату или промежуток:\n` +
            `• <code>01.06</code> — один день\n` +
            `• <code>01.06.25</code> — с указанием года\n` +
            `• <code>01.06-30.06</code> — период`);
    }
    async showNew(ctx) {
        const [bn, rn] = await Promise.all([
            this.bookingsRepo.count({ where: { status: 'new' } }),
            this.rentOutRepo.count({ where: { status: 'new' } }),
        ]);
        if (bn + rn === 0)
            return ctx.reply('✅ Новых заявок нет');
        await ctx.replyWithHTML(`🆕 <b>Необработанных: ${bn + rn}</b>\nАренда: ${bn} · Сдача авто: ${rn}`, telegraf_1.Markup.inlineKeyboard([
            [
                telegraf_1.Markup.button.callback(`📋 Аренда (${bn})`, cb.list('b', 'new', 0)),
                telegraf_1.Markup.button.callback(`🚗 Сдача авто (${rn})`, cb.list('r', 'new', 0)),
            ],
        ]));
    }
    async showStats(ctx) {
        const [bAll, bNew, rAll, rNew] = await Promise.all([
            this.bookingsRepo.count(),
            this.bookingsRepo.count({ where: { status: 'new' } }),
            this.rentOutRepo.count(),
            this.rentOutRepo.count({ where: { status: 'new' } }),
        ]);
        const now = new Date();
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);
        const week = new Date(now);
        week.setDate(now.getDate() - 7);
        week.setHours(0, 0, 0, 0);
        const [bToday, bWeek, rToday, rWeek] = await Promise.all([
            this.bookingsRepo.count({ where: { createdAt: (0, typeorm_2.MoreThanOrEqual)(today) } }),
            this.bookingsRepo.count({ where: { createdAt: (0, typeorm_2.MoreThanOrEqual)(week) } }),
            this.rentOutRepo.count({ where: { createdAt: (0, typeorm_2.MoreThanOrEqual)(today) } }),
            this.rentOutRepo.count({ where: { createdAt: (0, typeorm_2.MoreThanOrEqual)(week) } }),
        ]);
        await ctx.replyWithHTML(`<b>📊 Статистика</b>\n` +
            `──────────────────\n` +
            `<b>📋 Аренда:</b>\n` +
            `  Всего: ${bAll}  ·  🆕 ${bNew}  ·  ✅ ${bAll - bNew}\n` +
            `  За сегодня: ${bToday}  ·  За 7 дней: ${bWeek}\n\n` +
            `<b>🚗 Сдача авто:</b>\n` +
            `  Всего: ${rAll}  ·  🆕 ${rNew}  ·  ✅ ${rAll - rNew}\n` +
            `  За сегодня: ${rToday}  ·  За 7 дней: ${rWeek}`);
    }
    buildWhere(f, chatId, t) {
        const where = {};
        const now = new Date();
        if (f === 'new')
            where.status = 'new';
        if (f === 'done')
            where.status = 'done';
        if (f === 'td') {
            const from = new Date(now);
            from.setHours(0, 0, 0, 0);
            const to = new Date(now);
            to.setHours(23, 59, 59, 999);
            where.createdAt = (0, typeorm_2.Between)(from, to);
        }
        else if (f === 'wk') {
            const from = new Date(now);
            from.setDate(now.getDate() - 7);
            from.setHours(0, 0, 0, 0);
            where.createdAt = (0, typeorm_2.MoreThanOrEqual)(from);
        }
        else if (f === 'mo') {
            const from = new Date(now);
            from.setDate(now.getDate() - 30);
            from.setHours(0, 0, 0, 0);
            where.createdAt = (0, typeorm_2.MoreThanOrEqual)(from);
        }
        else if (f === 'dr') {
            const range = this.dateRanges.get(`${chatId}:${t}`);
            if (range)
                where.createdAt = (0, typeorm_2.Between)(range.from, range.to);
        }
        return where;
    }
    async renderList(ctx, t, f, pg, edit) {
        const repo = t === 'b' ? this.bookingsRepo : this.rentOutRepo;
        const label = t === 'b' ? 'Аренда' : 'Сдача авто';
        const chatId = String(ctx.chat?.id ?? ctx.callbackQuery?.message?.chat?.id ?? this.adminChatId);
        const where = this.buildWhere(f, chatId, t);
        const all = await repo.find({ where, order: { createdAt: 'DESC' } });
        const totalNew = await repo.count({ where: { status: 'new' } });
        const totalDone = await repo.count({ where: { status: 'done' } });
        const totalPages = Math.max(1, Math.ceil(all.length / PAGE));
        const safePg = Math.min(pg, totalPages - 1);
        const items = all.slice(safePg * PAGE, safePg * PAGE + PAGE);
        const drRange = this.dateRanges.get(`${chatId}:${t}`);
        const fLabel = filterLabel(f, drRange?.label);
        const header = `<b>📋 ${label} · ${fLabel}</b>\n` +
            `──────────────────\n` +
            (all.length === 0
                ? 'Заявок нет'
                : `Показано: ${all.length}  ·  🆕 ${totalNew}  ·  ✅ ${totalDone}`);
        const kb = listKeyboard(t, items, f, safePg, totalPages);
        try {
            if (edit) {
                await ctx.editMessageText(header, { parse_mode: 'HTML', ...kb });
            }
            else {
                await ctx.replyWithHTML(header, kb);
            }
        }
        catch {
            await ctx.replyWithHTML(header, kb);
        }
    }
    async renderDetail(ctx, t, id, f, pg, edit) {
        const item = t === 'b'
            ? await this.bookingsRepo.findOneBy({ id })
            : await this.rentOutRepo.findOneBy({ id });
        if (!item) {
            const text = '⚠️ Заявка не найдена (возможно удалена)';
            if (edit) {
                await ctx.editMessageText(text, telegraf_1.Markup.inlineKeyboard([[
                        telegraf_1.Markup.button.callback('◀ Назад', cb.list(t, f, pg)),
                    ]]));
            }
            else {
                await ctx.reply(text);
            }
            return;
        }
        const card = t === 'b' ? bookingCard(item) : rentOutCard(item);
        const kb = detailKeyboard(t, item, f, pg);
        if (edit) {
            await ctx.editMessageText(card, { parse_mode: 'HTML', ...kb });
        }
        else {
            await ctx.replyWithHTML(card, kb);
        }
    }
    async execAction(ctx, t, a, id, f, pg, isNotif) {
        const repo = t === 'b' ? this.bookingsRepo : this.rentOutRepo;
        const item = await repo.findOneBy({ id });
        if (!item)
            return ctx.answerCbQuery('⚠️ Заявка не найдена');
        if (a === 'del') {
            await repo.delete(id);
            if (isNotif) {
                await ctx.deleteMessage().catch(() => { });
                return ctx.answerCbQuery('🗑 Удалено');
            }
            await ctx.answerCbQuery('🗑 Удалено');
            return this.renderList(ctx, t, f, pg, true);
        }
        item.status = a === 'done' ? 'done' : 'new';
        await repo.save(item);
        const card = t === 'b' ? bookingCard(item) : rentOutCard(item);
        const kb = isNotif ? notifKeyboard(t, item) : detailKeyboard(t, item, f, pg);
        await ctx.editMessageText(card, { parse_mode: 'HTML', ...kb });
        ctx.answerCbQuery(a === 'done' ? '✅ Выполнено' : '🔄 Возвращено');
    }
};
exports.TelegramService = TelegramService;
__decorate([
    (0, event_emitter_1.OnEvent)('booking.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [booking_entity_1.Booking]),
    __metadata("design:returntype", Promise)
], TelegramService.prototype, "notifyBooking", null);
__decorate([
    (0, event_emitter_1.OnEvent)('rentout.created'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rent_out_request_entity_1.RentOutRequest]),
    __metadata("design:returntype", Promise)
], TelegramService.prototype, "notifyRentOut", null);
exports.TelegramService = TelegramService = TelegramService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(rent_out_request_entity_1.RentOutRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map