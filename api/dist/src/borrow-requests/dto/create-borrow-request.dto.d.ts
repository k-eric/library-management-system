import { BorrowStatus } from '@prisma/client';
export declare class CreateBorrowRequestDto {
    bookId?: string;
    bookIds?: string[];
    dueDate?: string;
}
export declare class UpdateBorrowRequestStatusDto {
    status: BorrowStatus;
    returnedAt?: string;
    fineRatePerDay?: number;
}
