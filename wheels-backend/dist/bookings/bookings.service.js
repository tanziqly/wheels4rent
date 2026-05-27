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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_emitter_1 = require("@nestjs/event-emitter");
const booking_entity_1 = require("./entities/booking.entity");
let BookingsService = class BookingsService {
    constructor(bookingsRepo, events) {
        this.bookingsRepo = bookingsRepo;
        this.events = events;
    }
    findAll() {
        return this.bookingsRepo.find({ order: { createdAt: 'DESC' } });
    }
    async create(dto) {
        const booking = await this.bookingsRepo.save(this.bookingsRepo.create({ ...dto, status: 'new' }));
        this.events.emit('booking.created', booking);
        return booking;
    }
    async updateStatus(id, dto) {
        await this.bookingsRepo.update(id, { status: dto.status });
        return this.bookingsRepo.findOneByOrFail({ id });
    }
    async remove(id) {
        await this.bookingsRepo.delete(id);
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        event_emitter_1.EventEmitter2])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map