import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/dto/auth.dto';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(
    @Req() req: { user: { userId?: string; id?: string; sub?: string } },
    @Body() dto: CreateBookingDto,
  ) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.bookingsService.create(userId, dto);
  }

  @Get()
  @Roles(Role.LIBRARIAN)
  findAll() {
    return this.bookingsService.findAll();
  }
}