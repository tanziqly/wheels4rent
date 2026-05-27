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
exports.RentOutService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const event_emitter_1 = require("@nestjs/event-emitter");
const rent_out_request_entity_1 = require("./entities/rent-out-request.entity");
let RentOutService = class RentOutService {
    constructor(rentOutRepo, events) {
        this.rentOutRepo = rentOutRepo;
        this.events = events;
    }
    findAll() {
        return this.rentOutRepo.find({ order: { createdAt: 'DESC' } });
    }
    async create(dto) {
        const req = await this.rentOutRepo.save(this.rentOutRepo.create({ ...dto, status: 'new' }));
        this.events.emit('rentout.created', req);
        return req;
    }
    async updateStatus(id, dto) {
        await this.rentOutRepo.update(id, { status: dto.status });
        return this.rentOutRepo.findOneByOrFail({ id });
    }
    async remove(id) {
        await this.rentOutRepo.delete(id);
    }
};
exports.RentOutService = RentOutService;
exports.RentOutService = RentOutService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rent_out_request_entity_1.RentOutRequest)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        event_emitter_1.EventEmitter2])
], RentOutService);
//# sourceMappingURL=rent-out.service.js.map