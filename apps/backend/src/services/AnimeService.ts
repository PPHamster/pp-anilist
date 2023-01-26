import { AnimeRepository } from '@/repositories/AnimeRepository';
import { SeasonRepository } from '@/repositories/SeasonRepository';
import { WaifuRepository } from '@/repositories/WaifuRepository';
import { AnimeCreateDto, AnimeUpdateDto } from '@/utils/dtos/AnimeDto';
import { SeasonCreateDto, SeasonUpdateDto } from '@/utils/dtos/SeasonDto';
import { WaifuCreateDto, WaifuUpdateDto } from '@/utils/dtos/WaifuDto';
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
    const convertData = {
      ...data,
      image: data.image ? Buffer.from(data.image, 'base64') : undefined,
    };

    const updatedAnime = await this.animeRepository.updateAnimeWhereUnique({
      where: { id },
      data: convertData,
    });

    return updatedAnime.id;
  }

  public async deleteAnimeById(id: number) {
    const anime = await this.animeRepository.deleteAnimeWhereUnique({ id });
    return anime.id;
  }

  public async createSeason(data: SeasonCreateDto, animeId: number) {
    const newSeason = await this.seasonRepository.createSeason({
      ...data,
      animeId,
    });

    await this.updateAnimeTime(animeId);

    return newSeason;
  }

  public async getAllSeasonByAnimeId(animeId: number) {
    const seasons = await this.seasonRepository.getManySeasonWhere({ animeId });
    return seasons;
  }

  public async updateSeasonById(data: SeasonUpdateDto, id: number) {
    const updatedSeason = await this.seasonRepository.updateSeasonWhereUnique({
      data,
      where: { id },
    });

    await this.updateAnimeTime(updatedSeason.animeId);

    return updatedSeason;
  }

  public async deleteSeasonById(id: number) {
    const deletedSeason = await this.seasonRepository.deleteSeasonWhereUnique({
      id,
    });

    await this.updateAnimeTime(deletedSeason.animeId);

    return deletedSeason;
  }

  public async createWaifuOrThrow(data: WaifuCreateDto, animeId: number) {
    if (await this.isWaifuExist(animeId))
      throw new BadRequestException('This anime already has waifu');

    const newWaifu = await this.waifuRepository.createWaifu({
      ...data,
      image: Buffer.from(data.image, 'base64'),
      animeId,
    });

    await this.updateAnimeTime(animeId);

    return newWaifu.id;
  }

  public async getWaifuWithoutImageByAnimeIdOrThrow(animeId: number) {
    const waifu = await this.waifuRepository.getWaifuWithoutImageWhereUnique({
      animeId,
    });

    if (!waifu)
      throw new BadRequestException("Don't have waifu for this anime");

    return waifu;
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

  public async updateWaifuByAnimeIdOrThrow(
    data: WaifuUpdateDto,
    animeId: number,
  ) {
    if (!(await this.isWaifuExist(animeId)))
      throw new BadRequestException("Don't have waifu for this anime");

    const convertData = {
      ...data,
      image: data.image ? Buffer.from(data.image, 'base64') : undefined,
    };

    const updatedWaifu = await this.waifuRepository.updateWaifuWhereUnique({
      data: convertData,
      where: { animeId },
    });

    await this.updateAnimeTime(animeId);

    return updatedWaifu.id;
  }

  public async deleteWaifuByAnimeIdOrThrow(animeId: number) {
    if (!(await this.isWaifuExist(animeId)))
      throw new BadRequestException("Don't have waifu for this anime");

    const deletedWaifu = await this.waifuRepository.deleteWaifuWhereUnique({
      animeId,
    });

    await this.updateAnimeTime(animeId);

    return deletedWaifu.id;
  }

  private async updateAnimeTime(id: number): Promise<void> {
    await this.animeRepository.updateAnimeWhereUnique({
      data: { lastUpdate: new Date() },
      where: { id },
    });
  }

  private async isWaifuExist(animeId: number): Promise<boolean> {
    const waifu = await this.waifuRepository.getWaifuWithoutImageWhereUnique({
      animeId,
    });

    return !!waifu;
  }
}
