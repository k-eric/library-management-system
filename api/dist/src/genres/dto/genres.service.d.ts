import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreDto, UpdateGenreDto } from './dto/create-genre.dto';
export declare class GenresService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateGenreDto): any;
    findAll(): any;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateGenreDto): Promise<any>;
    remove(id: string): Promise<any>;
}
