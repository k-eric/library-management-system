import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

function parseDateTime(dateStr: string, timeStr: string): Date {
  if (timeStr.includes('T')) {
    const dt = new Date(timeStr);
    if (!Number.isNaN(dt.getTime())) return dt;
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

  throw new BadRequestException('Invalid date, startTime, or endTime format.');
}

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookingDto) {
    const space = await this.prisma.space.findUnique({
      where: { id: dto.spaceId },
    });

    if (!space) {
      throw new NotFoundException(`Space ${dto.spaceId} not found.`);
    }

    const bookingDate = new Date(dto.date.split('T')[0]);
    if (Number.isNaN(bookingDate.getTime())) {
      throw new BadRequestException('Invalid booking date.');
    }

    const start = parseDateTime(dto.date, dto.startTime);
    const end = parseDateTime(dto.date, dto.endTime);

    if (end <= start) {
      throw new BadRequestException('End time must be after start time.');
    }

    const conflict = await this.prisma.booking.findFirst({
      where: {
        spaceId: dto.spaceId,
        status: BookingStatus.CONFIRMED,
        startTime: { lt: end },
        endTime: { gt: start },
      },
    });

    if (conflict) {
      throw new ConflictException(
        'This space is already booked during the selected time window.',
      );
    }

    return this.prisma.booking.create({
      data: {
        userId,
        spaceId: dto.spaceId,
        date: bookingDate,
        startTime: start,
        endTime: end,
        status: BookingStatus.CONFIRMED,
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
}