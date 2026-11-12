import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreDto, UpdateGenreDto } from './dto/create-genre.dto';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateGenreDto) {
    return this.prisma.genre.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.genre.findMany({
      include: { books: true },
    });
  }

  async findOne(id: string) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: { books: true },
    });
    if (!genre) {
      throw new NotFoundException('Genre not found');
    }
    return genre;
  }

  async update(id: string, dto: UpdateGenreDto) {
    await this.findOne(id);
    return this.prisma.genre.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.genre.delete({
      where: { id },
    });
  }
}