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
exports.BorrowRequestsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const fine_calculator_1 = require("./fine-calculator");
const DEFAULT_FINE_RATE_PER_DAY = 1.0;
const DEFAULT_BORROW_DAYS = 14;
let BorrowRequestsService = class BorrowRequestsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const targetBookIds = dto.bookIds && dto.bookIds.length > 0
            ? dto.bookIds
            : dto.bookId
                ? [dto.bookId]
                : [];
        if (targetBookIds.length === 0) {
            throw new common_1.BadRequestException('Provide either bookId or a non-empty bookIds array.');
        }
        const books = await this.prisma.book.findMany({
            where: { id: { in: targetBookIds } },
        });
        if (books.length !== targetBookIds.length) {
            throw new common_1.NotFoundException('One or more requested books were not found.');
        }
        const defaultDueDate = dto.dueDate
            ? new Date(dto.dueDate)
            : new Date(Date.now() + DEFAULT_BORROW_DAYS * 24 * 60 * 60 * 1000);
        const created = await Promise.all(targetBookIds.map((bookId) => this.prisma.borrowRequest.create({
            data: {
                userId,
                bookId,
                status: client_1.BorrowStatus.PENDING,
                dueDate: defaultDueDate,
            },
            include: {
                book: true,
                user: {
                    select: { id: true, email: true, name: true, role: true },
                },
            },
        })));
        return created.length === 1 ? created[0] : created;
    }
    async findAll() {
        return this.prisma.borrowRequest.findMany({
            include: {
                book: true,
                user: {
                    select: { id: true, email: true, name: true, role: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateStatus(id, dto) {
        const existing = await this.prisma.borrowRequest.findUnique({
            where: { id },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Borrow request ${id} not found.`);
        }
        const data = {
            status: dto.status,
        };
        if (dto.status === client_1.BorrowStatus.APPROVED && !existing.dueDate) {
            data.dueDate = new Date(Date.now() + DEFAULT_BORROW_DAYS * 24 * 60 * 60 * 1000);
        }
        if (dto.status === client_1.BorrowStatus.RETURNED) {
            const returnDate = dto.returnedAt ? new Date(dto.returnedAt) : new Date();
            const effectiveDueDate = existing.dueDate ?? data.dueDate ?? new Date();
            const rate = dto.fineRatePerDay ?? DEFAULT_FINE_RATE_PER_DAY;
            data.returnedAt = returnDate;
            data.fineAmount = (0, fine_calculator_1.calculateFine)(effectiveDueDate, returnDate, rate);
        }
        return this.prisma.borrowRequest.update({
            where: { id },
            data,
            include: {
                book: true,
                user: {
                    select: { id: true, email: true, name: true, role: true },
                },
            },
        });
    }
};
exports.BorrowRequestsService = BorrowRequestsService;
exports.BorrowRequestsService = BorrowRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BorrowRequestsService);
//# sourceMappingURL=borrow-requests.service.js.map