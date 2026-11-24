import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreDto, UpdateGenreDto } from './dto/create-genre.dto';
export declare class GenresService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateGenreDto): import(".prisma/client").Prisma.Prisma__GenreClient<{
        id: string;
        name: string;
        description: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        books: {
            id: string;
            title: string;
            author: string;
            isbn: string;
            totalCopies: number;
            publishedYear: number;
            createdAt: Date;
            updatedAt: Date;
            genreId: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
    })[]>;
    findOne(id: string): Promise<{
        books: {
            id: string;
            title: string;
            author: string;
            isbn: string;
            totalCopies: number;
            publishedYear: number;
            createdAt: Date;
            updatedAt: Date;
            genreId: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
    }>;
    update(id: string, dto: UpdateGenreDto): Promise<{
        id: string;
        name: string;
        description: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
    }>;
}
