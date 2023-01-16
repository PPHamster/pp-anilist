import { AnimeService } from '@/services/AnimeService';
import { RequestUser } from '@/utils/decorators/AuthDecorator';
import { AnimeCreateDto, AnimeUpdateDto } from '@/utils/dtos/AnimeDto';
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
      .send({ message: `Update anime id ${updateId} successfully` });
  }

  // Delete anime by anime id
  @Delete(':id')
  @UseGuards(AuthGuard, RouteGuard, PermissionGuard)
  public async deleteAnime(@Param('id') id: number, @Res() res: Response) {
    const deleteId = await this.animeService.deleteAnimeById(id);
    return res
      .status(HttpStatus.OK)
      .send({ message: `Delete anime id ${deleteId} successfully` });
  }

  @Get(':id/waifu/image')
  public async getWaifuImageByAnimeId(
    @Param('id') id: number,
    @Res() res: Response,
  ) {
    const image = await this.animeService.getWaifuImageByAnimeIdOrThrow(id);
    return res.status(HttpStatus.OK).json(image);
  }
}
