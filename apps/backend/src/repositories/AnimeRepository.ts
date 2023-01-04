import { PrismaService } from '@/services/PrismaService';
import { Injectable } from '@nestjs/common';
import { Anime, Prisma } from '@prisma/client';

@Injectable()
export class AnimeRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public createAnime(data: Prisma.AnimeCreateInput): Promise<Anime> {
    return this.prismaService.anime.create({ data });
  }

  public getAllAnime(): Promise<Anime[]> {
    return this.prismaService.anime.findMany();
  }

  public getAnimeWhereUnique(
    where: Prisma.AnimeWhereUniqueInput,
  ): Promise<Anime | null> {
    return this.prismaService.anime.findUnique({ where });
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
