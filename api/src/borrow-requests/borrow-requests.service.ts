import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BorrowStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateBorrowRequestDto,
  UpdateBorrowRequestStatusDto,
} from './dto/create-borrow-request.dto';
import { calculateFine } from './fine-calculator';

const DEFAULT_FINE_RATE_PER_DAY = 1.0;
const DEFAULT_BORROW_DAYS = 14;

@Injectable()
export class BorrowRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateBorrowRequestDto) {
    const targetBookIds =
      dto.bookIds && dto.bookIds.length > 0
        ? dto.bookIds
        : dto.bookId
          ? [dto.bookId]
          : [];

    if (targetBookIds.length === 0) {
      throw new BadRequestException(
        'Provide either bookId or a non-empty bookIds array.',
      );
    }

    const books = await this.prisma.book.findMany({
      where: { id: { in: targetBookIds } },
    });

    if (books.length !== targetBookIds.length) {
      throw new NotFoundException('One or more requested books were not found.');
    }

    const defaultDueDate = dto.dueDate
      ? new Date(dto.dueDate)
      : new Date(Date.now() + DEFAULT_BORROW_DAYS * 24 * 60 * 60 * 1000);

    const created = await Promise.all(
      targetBookIds.map((bookId) =>
        this.prisma.borrowRequest.create({
          data: {
            userId,
            bookId,
            status: BorrowStatus.PENDING,
            dueDate: defaultDueDate,
          },
          include: {
            book: true,
            user: {
              select: { id: true, email: true, name: true, role: true },
            },
          },
        }),
      ),
    );

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

  async updateStatus(id: string, dto: UpdateBorrowRequestStatusDto) {
    const existing = await this.prisma.borrowRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Borrow request ${id} not found.`);
    }

    const data: {
      status: BorrowStatus;
      returnedAt?: Date;
      fineAmount?: number;
      dueDate?: Date;
    } = {
      status: dto.status,
    };

    if (dto.status === BorrowStatus.APPROVED && !existing.dueDate) {
      data.dueDate = new Date(
        Date.now() + DEFAULT_BORROW_DAYS * 24 * 60 * 60 * 1000,
      );
    }

    if (dto.status === BorrowStatus.RETURNED) {
      const returnDate = dto.returnedAt ? new Date(dto.returnedAt) : new Date();
      const effectiveDueDate = existing.dueDate ?? data.dueDate ?? new Date();
      const rate = dto.fineRatePerDay ?? DEFAULT_FINE_RATE_PER_DAY;

      data.returnedAt = returnDate;
      data.fineAmount = calculateFine(effectiveDueDate, returnDate, rate);
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
}