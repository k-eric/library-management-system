import { BorrowRequestsService } from './borrow-requests.service';
import { CreateBorrowRequestDto, UpdateBorrowRequestStatusDto } from './dto/create-borrow-request.dto';
export declare class BorrowRequestsController {
    private readonly borrowRequestsService;
    constructor(borrowRequestsService: BorrowRequestsService);
    create(req: {
        user: {
            userId?: string;
            id?: string;
            sub?: string;
        };
    }, dto: CreateBorrowRequestDto): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
        };
        book: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            author: string;
            isbn: string;
            totalCopies: number;
            publishedYear: number;
            genreId: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.BorrowStatus;
        dueDate: Date | null;
        returnedAt: Date | null;
        fineAmount: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        bookId: string;
    }) | ({
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
        };
        book: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            author: string;
            isbn: string;
            totalCopies: number;
            publishedYear: number;
            genreId: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.BorrowStatus;
        dueDate: Date | null;
        returnedAt: Date | null;
        fineAmount: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        bookId: string;
    })[]>;
    findAll(): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
        };
        book: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            author: string;
            isbn: string;
            totalCopies: number;
            publishedYear: number;
            genreId: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.BorrowStatus;
        dueDate: Date | null;
        returnedAt: Date | null;
        fineAmount: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        bookId: string;
    })[]>;
    updateStatus(id: string, dto: UpdateBorrowRequestStatusDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
        };
        book: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            author: string;
            isbn: string;
            totalCopies: number;
            publishedYear: number;
            genreId: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.BorrowStatus;
        dueDate: Date | null;
        returnedAt: Date | null;
        fineAmount: number;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        bookId: string;
    }>;
}
