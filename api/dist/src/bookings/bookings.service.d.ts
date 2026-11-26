import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateBookingDto): Promise<{
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
        status: import(".prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        startTime: Date;
        endTime: Date;
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
        status: import(".prisma/client").$Enums.BookingStatus;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        date: Date;
        startTime: Date;
        endTime: Date;
        spaceId: string;
    })[]>;
    findSpaces(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        capacity: number;
        description: string | null;
    }[]>;
}
