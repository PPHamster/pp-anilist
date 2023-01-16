import { AnimeRepository } from '@/repositories/AnimeRepository';
import { SeasonRepository } from '@/repositories/SeasonRepository';
import { WaifuRepository } from '@/repositories/WaifuRepository';
import { AnimeCreateDto, AnimeUpdateDto } from '@/utils/dtos/AnimeDto';
import { BadRequestException, Injectable } from '@nestjs/common';
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

    if (data.seasons && Array.isArray(data.seasons)) {
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

    return newAnime.id;
  }

  public async getAllAnimePreviewInfoByUserId(userId: string) {
    const allAnime = await this.animeRepository.getAllAnimeWithSeasonsWhere({
      userId,
    });

    return allAnime.map((anime) => {
      const seasonCount = anime.seasons.length;
      const chapterCount = anime.seasons.reduce(
        (a, b) => a + b.chapterCount,
        0,
      );
      delete anime.seasons;
      return { ...anime, seasonCount, chapterCount };
    });
  }

  public getAnimeWithoutImageById(id: number) {
    return this.animeRepository.getAnimeWithoutImageWhereUnique({ id });
  }

  public async getAnimeImageByAnimeId(id: number) {
    const animeWithImage = await this.animeRepository.getAnimeImageWhereUnique({
      id,
    });
    return `data:image/png;base64,${Buffer.from(animeWithImage.image).toString(
      'base64',
    )}`;
  }

  public async getUserIdAndAnimeIdFromSeasonByIdOrThrow(id: number) {
    const userIdAndAnimeIdInSeason =
      await this.seasonRepository.getUserIdAndAnimeIdFromSeasonWhereUnique({
        id,
      });
    if (!userIdAndAnimeIdInSeason)
      throw new BadRequestException("Don't have season for this id");
    return userIdAndAnimeIdInSeason.anime;
  }

  public async updateAnimeById(id: number, data: AnimeUpdateDto) {
    const convertData = data.image
      ? { ...data, image: Buffer.from(data.image, 'base64') }
      : { ...data, image: undefined };
    const update = await this.animeRepository.updateAnimeWhereUnique({
      where: { id },
      data: convertData,
    });
    return update.id;
  }

  public async deleteAnimeById(id: number) {
    const anime = await this.animeRepository.deleteAnimeWhereUnique({ id });
    return anime.id;
  }

  public async getWaifuImageByAnimeIdOrThrow(animeId: number) {
    const waifuWithImage = await this.waifuRepository.getWaifuImageWhereUnique({
      animeId,
    });
    if (!waifuWithImage)
      throw new BadRequestException("Don't have waifu for this anime");
    return `data:image/png;base64,${Buffer.from(waifuWithImage.image).toString(
      'base64',
    )}`;
  }
}
