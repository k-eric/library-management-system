import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto, UpdateBookDto } from './dto/create-book.dto';
export declare class BooksService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateBookDto): import(".prisma/client").Prisma.Prisma__BookClient<{
        id: string;
        title: string;
        author: string;
        isbn: string;
        totalCopies: number;
        publishedYear: number;
        createdAt: Date;
        updatedAt: Date;
        genreId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(query: {
        genreId?: string;
        search?: string;
        page?: string;
        limit?: string;
    }): Promise<{
        data: ({
            genre: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            title: string;
            author: string;
            isbn: string;
            totalCopies: number;
            publishedYear: number;
            createdAt: Date;
            updatedAt: Date;
            genreId: string;
        })[];
        total: number;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string): Promise<{
        genre: {
            id: string;
            name: string;
        };
        reviews: {
            id: string;
            createdAt: Date;
            rating: number;
            comment: string | null;
            bookId: string;
            userId: string;
        }[];
    } & {
        id: string;
        title: string;
        author: string;
        isbn: string;
        totalCopies: number;
        publishedYear: number;
        createdAt: Date;
        updatedAt: Date;
        genreId: string;
    }>;
    update(id: string, dto: UpdateBookDto): Promise<{
        id: string;
        title: string;
        author: string;
        isbn: string;
        totalCopies: number;
        publishedYear: number;
        createdAt: Date;
        updatedAt: Date;
        genreId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        title: string;
        author: string;
        isbn: string;
        totalCopies: number;
        publishedYear: number;
        createdAt: Date;
        updatedAt: Date;
        genreId: string;
    }>;
}
