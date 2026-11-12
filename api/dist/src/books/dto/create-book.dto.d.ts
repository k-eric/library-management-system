export declare class CreateBookDto {
    title: string;
    author: string;
    isbn: string;
    totalCopies: number;
    publishedYear: number;
    genreId: string;
}
export declare class UpdateBookDto {
    title?: string;
    author?: string;
    isbn?: string;
    totalCopies?: number;
    publishedYear?: number;
    genreId?: string;
}
