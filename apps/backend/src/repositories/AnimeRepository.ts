import { PrismaService } from '@/services/PrismaService';
import { Injectable } from '@nestjs/common';
import { Anime, Prisma } from '@prisma/client';

@Injectable()
export class AnimeRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public createAnime(data: Prisma.AnimeCreateManyInput): Promise<Anime> {
    return this.prismaService.anime.create({ data });
  }

  public getAllAnime(): Promise<Anime[]> {
    return this.prismaService.anime.findMany();
  }

  public getAllAnimeWhere(where: Prisma.AnimeWhereInput) {
    return this.prismaService.anime.findMany({ where });
  }

  public getAnimeWhereUnique(
    where: Prisma.AnimeWhereUniqueInput,
  ): Promise<Anime | null> {
    return this.prismaService.anime.findUnique({ where });
  }

  public getAllAnimeWithoutImageWhere(where: Prisma.AnimeWhereInput) {
    return this.prismaService.anime.findMany({
      where,
      select: {
        createdAt: true,
        id: true,
        isWatching: true,
        lastUpdate: true,
        rating: true,
        titleEn: true,
        titleJp: true,
        titleTh: true,
        userId: true,
      },
    });
  }

  public getAnimeWithoutImageWhereUnique(where: Prisma.AnimeWhereUniqueInput) {
    return this.prismaService.anime.findUnique({
      where,
      select: {
        createdAt: true,
        id: true,
        isWatching: true,
        lastUpdate: true,
        rating: true,
        titleEn: true,
        titleJp: true,
        titleTh: true,
        userId: true,
      },
    });
  }

  public getAnimeImageWhereUnique(where: Prisma.AnimeWhereUniqueInput) {
    return this.prismaService.anime.findUnique({
      where,
      select: { image: true },
    });
  }

  public updateAnimeWhereUnique(args: Prisma.AnimeUpdateArgs): Promise<Anime> {
    return this.prismaService.anime.update(args);
  }

  public async deleteAnimeWhereUnique(
    where: Prisma.AnimeWhereUniqueInput,
  ): Promise<void> {
    await this.prismaService.anime.delete({ where });
  }
}
