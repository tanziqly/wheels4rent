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
exports.Car = void 0;
const typeorm_1 = require("typeorm");
let Car = class Car {
};
exports.Car = Car;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Car.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Car.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: '' }),
    __metadata("design:type", String)
], Car.prototype, "seed", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Car.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Car.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Car.prototype, "categorySlug", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Car.prototype, "engine", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 4 }),
    __metadata("design:type", Number)
], Car.prototype, "seats", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Car.prototype, "power", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'АКПП' }),
    __metadata("design:type", String)
], Car.prototype, "transmission", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'Полный' }),
    __metadata("design:type", String)
], Car.prototype, "drive", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Car.prototype, "priceFrom", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Car.prototype, "priceNum", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Car.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], Car.prototype, "features", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], Car.prototype, "extraSeeds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], Car.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Car.prototype, "createdAt", void 0);
exports.Car = Car = __decorate([
    (0, typeorm_1.Entity)('cars')
], Car);
//# sourceMappingURL=car.entity.js.map