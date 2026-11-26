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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
function parseDateTime(dateStr, timeStr) {
    if (timeStr.includes('T')) {
        const dt = new Date(timeStr);
        if (!Number.isNaN(dt.getTime()))
            return dt;
    }
    const baseDate = dateStr.split('T')[0];
    const normalizedTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
    const combined = new Date(`${baseDate}T${normalizedTime}`);
    if (!Number.isNaN(combined.getTime())) {
        return combined;
    }
    const fallback = new Date(timeStr);
    if (!Number.isNaN(fallback.getTime())) {
        return fallback;
    }
    throw new common_1.BadRequestException('Invalid date, startTime, or endTime format.');
}
let BookingsService = class BookingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const space = await this.prisma.space.findUnique({
            where: { id: dto.spaceId },
        });
        if (!space) {
            throw new common_1.NotFoundException(`Space ${dto.spaceId} not found.`);
        }
        const bookingDate = new Date(dto.date.split('T')[0]);
        if (Number.isNaN(bookingDate.getTime())) {
            throw new common_1.BadRequestException('Invalid booking date.');
        }
        const start = parseDateTime(dto.date, dto.startTime);
        const end = parseDateTime(dto.date, dto.endTime);
        if (end <= start) {
            throw new common_1.BadRequestException('End time must be after start time.');
        }
        const conflict = await this.prisma.booking.findFirst({
            where: {
                spaceId: dto.spaceId,
                status: client_1.BookingStatus.CONFIRMED,
                startTime: { lt: end },
                endTime: { gt: start },
            },
        });
        if (conflict) {
            throw new common_1.ConflictException('This space is already booked during the selected time window.');
        }
        return this.prisma.booking.create({
            data: {
                userId,
                spaceId: dto.spaceId,
                date: bookingDate,
                startTime: start,
                endTime: end,
                status: client_1.BookingStatus.CONFIRMED,
            },
            include: {
                space: true,
                user: {
                    select: { id: true, email: true, name: true, role: true },
                },
            },
        });
    }
    async findAll() {
        return this.prisma.booking.findMany({
            include: {
                space: true,
                user: {
                    select: { id: true, email: true, name: true, role: true },
                },
            },
            orderBy: { startTime: 'asc' },
        });
    }
    async findSpaces() {
        return this.prisma.space.findMany({
            orderBy: { name: 'asc' },
        });
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map