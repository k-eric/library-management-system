import { GenresService } from './genres.service';
import { CreateGenreDto, UpdateGenreDto } from './dto/create-genre.dto';
export declare class GenresController {
    private readonly genresService;
    constructor(genresService: GenresService);
    create(dto: CreateGenreDto): any;
    findAll(): any;
    findOne(id: string): Promise<any>;
    update(id: string, dto: UpdateGenreDto): Promise<any>;
    remove(id: string): Promise<any>;
}
