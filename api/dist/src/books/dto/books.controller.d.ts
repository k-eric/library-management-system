import { BooksService } from './books.service';
import { CreateBookDto, UpdateBookDto } from './dto/create-book.dto';
export declare class BooksController {
    private readonly booksService;
    constructor(booksService: BooksService);
    create(dto: CreateBookDto): any;
    findAll(genreId?: string, search?: string, page?: string, limit?: string): Promise<{
        data: any;
        total: any;
        page: number;
        lastPage: number;
    }>;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateBookDto): Promise<any>;
    remove(id: string): Promise<any>;
}
