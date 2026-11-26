import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { GenresModule } from './genres/genres.module';
import { BorrowRequestsModule } from './borrow-requests/borrow-requests.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    BooksModule,
    GenresModule,
    BorrowRequestsModule,
    BookingsModule,
  ],
})
export class AppModule {}