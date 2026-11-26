import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/dto/auth.dto';
import { BorrowRequestsService } from './borrow-requests.service';
import {
  CreateBorrowRequestDto,
  UpdateBorrowRequestStatusDto,
} from './dto/create-borrow-request.dto';

@Controller('borrow-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BorrowRequestsController {
  constructor(private readonly borrowRequestsService: BorrowRequestsService) {}

  @Post()
  create(
    @Req() req: { user: { userId?: string; id?: string; sub?: string } },
    @Body() dto: CreateBorrowRequestDto,
  ) {
    const userId = req.user.userId || req.user.id || req.user.sub;
    return this.borrowRequestsService.create(userId, dto);
  }

  @Get()
  @Roles(Role.LIBRARIAN)
  findAll() {
    return this.borrowRequestsService.findAll();
  }

  @Patch(':id')
  @Roles(Role.LIBRARIAN)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBorrowRequestStatusDto,
  ) {
    return this.borrowRequestsService.updateStatus(id, dto);
  }
}