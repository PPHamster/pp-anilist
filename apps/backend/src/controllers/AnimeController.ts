import { AnimeService } from '@/services/AnimeService';
import { RequestUser } from '@/utils/decorators/AuthDecorator';
import { AnimeCreateDto, AnimeUpdateDto } from '@/utils/dtos/AnimeDto';
import { SeasonCreateDto, SeasonUpdateDto } from '@/utils/dtos/SeasonDto';
import { WaifuCreateDto, WaifuUpdateDto } from '@/utils/dtos/WaifuDto';
import { AuthGuard } from '@/utils/guards/AuthGuard';
import { PermissionGuard } from '@/utils/guards/PermissionGuard';
import { RouteGuard } from '@/utils/guards/RouteGuard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';

@Controller('anime')
export class AnimeController {
  public constructor(private readonly animeService: AnimeService) {}

  // Get preview information anime by userId from request
  @Get('/')
  @UseGuards(AuthGuard)
  public async getAllAnimeByRequestUserId(
    @RequestUser() user: User,
    @Res() res: Response,
  ) {
    const allAnime = await this.animeService.getAllAnimePreviewInfoByUserId(
      user.id,
    );
    return res.status(HttpStatus.OK).json(allAnime);
  }

  // Get all anime information by user id
  @Get('all/:userId')
  public async getAllAnimeByUserId(
    @Param('userId') userId: string,
    @Res() res: Response,
  ) {
    const allAnime = await this.animeService.getAllAnimePreviewInfoByUserId(
      userId,
    );
    return res.status(HttpStatus.OK).json(allAnime);
  }

  // Create all information for one anime
  @Post('/')
  @UseGuards(AuthGuard)
  public async createAnime(
    @RequestUser() user: User,
    @Body() body: AnimeCreateDto,
    @Res() res: Response,
  ) {
    const animeId = await this.animeService.createAnime(body, user);
    return res
      .status(HttpStatus.OK)
      .send({ message: `Created anime id ${animeId} successfully` });
  }

  // Get anime information without image by anime id
  @Get(':id')
  @UseGuards(RouteGuard)
  public async getAnimeById(@Param('id') id: number, @Res() res: Response) {
    const anime = await this.animeService.getAnimeWithoutImageById(id);
    return res.status(HttpStatus.OK).json(anime);
  }

  // Get anime image by anime id
  @Get(':id/image')
  @UseGuards(RouteGuard)
  public async getAnimeImageByAnimeId(
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const image = await this.animeService.getAnimeImageByAnimeId(id);
    return res.status(HttpStatus.OK).json(image);
  }

  // Update anime information by anime id
  @Put(':id')
  @UseGuards(AuthGuard, RouteGuard, PermissionGuard)
  public async updateAnime(
    @Param('id') id: number,
    @Body() dto: AnimeUpdateDto,
    @Res() res: Response,
  ) {
    const updateId = await this.animeService.updateAnimeById(id, dto);
    return res
      .status(HttpStatus.OK)
      .send({ message: `Updated anime id ${updateId} successfully` });
  }

  // Delete anime by anime id
  @Delete(':id')
  @UseGuards(AuthGuard, RouteGuard, PermissionGuard)
  public async deleteAnime(@Param('id') id: number, @Res() res: Response) {
    const deleteId = await this.animeService.deleteAnimeById(id);
    return res
      .status(HttpStatus.OK)
      .send({ message: `Deleted anime id ${deleteId} successfully` });
  }

  // Create new season
  @Post(':id/seasons')
  @UseGuards(AuthGuard, RouteGuard, PermissionGuard)
  public async createSeason(
    @Param('id') id: number,
    @Body() body: SeasonCreateDto,
    @Res() res: Response,
  ) {
    const newSeason = await this.animeService.createSeason(body, id);
    return res
      .status(HttpStatus.OK)
      .send({ message: `Created ${newSeason.title} successfully` });
  }

  // Get all season that exist in this anime id
  @Get(':id/seasons')
  @UseGuards(RouteGuard)
  public async getAllSeasonByAnimeId(
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const seasons = await this.animeService.getAllSeasonByAnimeId(id);
    return res.status(HttpStatus.OK).json(seasons);
  }

  // Update season by id
  @Put(':id/seasons/:seasonId')
  @UseGuards(AuthGuard, RouteGuard, PermissionGuard)
  public async updateSeasonById(
    @Param('seasonId') seasonId: number,
    @Body() body: SeasonUpdateDto,
    @Res() res: Response,
  ) {
    const updateSeason = await this.animeService.updateSeasonById(
      body,
      seasonId,
    );
    return res
      .status(HttpStatus.OK)
      .send({ message: `Updated season id ${updateSeason.id} successfully` });
  }

  // Delete season by id
  @Delete(':id/seasons/:seasonId')
  @UseGuards(AuthGuard, RouteGuard, PermissionGuard)
  public async deleteSeasonById(
    @Param('seasonId') seasonId: number,
    @Res() res: Response,
  ) {
    const deleteSeason = await this.animeService.deleteSeasonById(seasonId);
    return res
      .status(HttpStatus.OK)
      .send({ message: `Deleted ${deleteSeason.title} successfully` });
  }

  // Create waifu by anime id
  @Post(':id/waifu')
  @UseGuards(AuthGuard, RouteGuard, PermissionGuard)
  public async createWaifu(
    @Param('id') id: number,
    @Body() body: WaifuCreateDto,
    @Res() res: Response,
  ) {
    const waifuId = await this.animeService.createWaifuOrThrow(body, id);
    return res
      .status(HttpStatus.OK)
      .send({ message: `Created waifu id ${waifuId} successfully` });
  }

  // Get waifu information without image by anime id
  @Get(':id/waifu')
  @UseGuards(RouteGuard)
  public async getWaifuWithoutImageByAnimeId(
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const waifu = await this.animeService.getWaifuWithoutImageByAnimeIdOrThrow(
      id,
    );
    return res.status(HttpStatus.OK).json(waifu);
  }

  // Get waifu image by anime id
  @Get(':id/waifu/image')
  @UseGuards(RouteGuard)
  public async getWaifuImageByAnimeId(
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const image = await this.animeService.getWaifuImageByAnimeIdOrThrow(id);
    return res.status(HttpStatus.OK).json(image);
  }

  // Update waifu by anime id
  @Put(':id/waifu')
  @UseGuards(AuthGuard, RouteGuard, PermissionGuard)
  public async updateWaifuByAnimeId(
    @Param('id') id: number,
    @Body() body: WaifuUpdateDto,
    @Res() res: Response,
  ) {
    const waifuId = await this.animeService.updateWaifuByAnimeIdOrThrow(
      body,
      id,
    );
    return res
      .status(HttpStatus.OK)
      .send({ message: `Updated waifu id ${waifuId} successfully` });
  }

  @Delete(':id/waifu')
  @UseGuards(AuthGuard, RouteGuard, PermissionGuard)
  public async deleteWaifuByAnimeId(
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const waifuId = await this.animeService.deleteWaifuByAnimeIdOrThrow(id);
    return res
      .status(HttpStatus.OK)
      .send({ message: `Deleted waifu id ${waifuId} successfully` });
  }
}
