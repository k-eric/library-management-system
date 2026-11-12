import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto, UpdateBookDto } from './dto/create-book.dto';
export declare class BooksService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateBookDto): any;
    findAll(query: {
        genreId?: string;
        search?: string;
        page?: string;
        limit?: string;
    }): Promise<{
        data: any;
        total: any;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateBookDto): Promise<any>;
    remove(id: string): Promise<any>;
}
