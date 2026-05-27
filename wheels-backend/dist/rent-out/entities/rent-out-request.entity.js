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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentOutRequest = void 0;
const typeorm_1 = require("typeorm");
let RentOutRequest = class RentOutRequest {
};
exports.RentOutRequest = RentOutRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RentOutRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RentOutRequest.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RentOutRequest.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RentOutRequest.prototype, "carType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RentOutRequest.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RentOutRequest.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], RentOutRequest.prototype, "mileage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], RentOutRequest.prototype, "comment", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'new' }),
    __metadata("design:type", String)
], RentOutRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RentOutRequest.prototype, "createdAt", void 0);
exports.RentOutRequest = RentOutRequest = __decorate([
    (0, typeorm_1.Entity)('rent_out_requests')
], RentOutRequest);
//# sourceMappingURL=rent-out-request.entity.js.map