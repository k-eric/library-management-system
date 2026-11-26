import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(req: {
        user: {
            userId?: string;
            id?: string;
            sub?: string;
        };
    }, dto: CreateBookingDto): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
        };
        space: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            capacity: number;
            description: string | null;
        };
    } & {
        id: string;
        date: Date;
        startTime: Date;
        endTime: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        spaceId: string;
    }>;
    findAll(): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.Role;
        };
        space: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            capacity: number;
            description: string | null;
        };
    } & {
        id: string;
        date: Date;
        startTime: Date;
        endTime: Date;
        status: import(".prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        spaceId: string;
    })[]>;
}
