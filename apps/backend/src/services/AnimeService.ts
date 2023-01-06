import { AnimeRepository } from '@/repositories/AnimeRepository';
import { SeasonRepository } from '@/repositories/SeasonRepository';
import { WaifuRepository } from '@/repositories/WaifuRepository';
import { AnimeCreateDto } from '@/utils/dtos/AnimeDto';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Buffer } from 'buffer';

@Injectable()
export class AnimeService {
  public constructor(
    private readonly animeRepository: AnimeRepository,
    private readonly seasonRepository: SeasonRepository,
    private readonly waifuRepository: WaifuRepository,
  ) {}

  public async createAnime(data: AnimeCreateDto, user: User) {
    const newAnime = await this.animeRepository.createAnime({
      image: Buffer.from(data.image, 'base64'),
      isWatching: data.isWatching,
      rating: data.rating,
      titleEn: data.titleEn,
      titleJp: data.titleJp,
      titleTh: data.titleTh,
      userId: user.id,
    });

    if (data.seasons) {
      await this.seasonRepository.createManySeason(
        data.seasons.map((season) => {
          return { ...season, animeId: newAnime.id };
        }),
      );
    }

    if (data.waifu) {
      await this.waifuRepository.createWaifu({
        animeId: newAnime.id,
        description: data.waifu.description,
        image: Buffer.from(data.waifu.image, 'base64'),
        level: data.waifu.level,
        nameEn: data.waifu.nameEn,
        nameTh: data.waifu.nameTh,
      });
    }
  }

  public getAllAnimeWithoutImageByUserId(userId: string) {
    return this.animeRepository.getAllAnimeWithoutImageWhere({ userId });
  }

  public getAnimeWithoutImageById(id: number) {
    return this.animeRepository.getAnimeWithoutImageWhereUnique({ id });
  }

  public getAnimeImageByAnimeId(id: number) {
    return this.animeRepository.getAnimeImageWhereUnique({ id });
  }
}
