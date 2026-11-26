import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BorrowRequestsController } from './borrow-requests.controller';
import { BorrowRequestsService } from './borrow-requests.service';

@Module({
  imports: [PrismaModule],
  controllers: [BorrowRequestsController],
  providers: [BorrowRequestsService],
  exports: [BorrowRequestsService],
})
export class BorrowRequestsModule {}