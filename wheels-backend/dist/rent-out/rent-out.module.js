"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentOutModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const rent_out_controller_1 = require("./rent-out.controller");
const rent_out_service_1 = require("./rent-out.service");
const rent_out_request_entity_1 = require("./entities/rent-out-request.entity");
let RentOutModule = class RentOutModule {
};
exports.RentOutModule = RentOutModule;
exports.RentOutModule = RentOutModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([rent_out_request_entity_1.RentOutRequest])],
        controllers: [rent_out_controller_1.RentOutController],
        providers: [rent_out_service_1.RentOutService],
    })
], RentOutModule);
//# sourceMappingURL=rent-out.module.js.map