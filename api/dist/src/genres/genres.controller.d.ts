import { GenresService } from './genres.service';
import { CreateGenreDto, UpdateGenreDto } from './dto/create-genre.dto';
export declare class GenresController {
    private readonly genresService;
    constructor(genresService: GenresService);
    create(dto: CreateGenreDto): import(".prisma/client").Prisma.Prisma__GenreClient<{
        id: string;
        name: string;
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
    }>;
    update(id: string, dto: UpdateGenreDto): Promise<{
        id: string;
        name: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
    }>;
}
