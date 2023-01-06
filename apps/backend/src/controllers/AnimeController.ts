import { AnimeService } from '@/services/AnimeService';
import { RequestUser } from '@/utils/decorators/AuthDecorator';
import { AnimeCreateDto, AnimeUpdateDto } from '@/utils/dtos/AnimeDto';
import { AnimeGuard } from '@/utils/guards/AnimeGuard';
import { AuthGuard } from '@/utils/guards/AuthGuard';
import {
  BadRequestException,
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
    const allAnime = await this.animeService.getAllAnimeWithoutImageByUserId(
      user.id,
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
    await this.animeService.createAnime(body, user);
    return res.status(HttpStatus.OK).send({ message: 'Created successfully' });
  }

  @Get('all/:userId')
  public async getAllAnimeByUserId(
    @Param('userId') userId: string,
    @Res() res: Response,
  ) {
    const allAnime = await this.animeService.getAllAnimeWithoutImageByUserId(
      userId,
    );
    return res.status(HttpStatus.OK).json(allAnime);
  }

  @Get(':id')
  public async getAnimeById(@Param('id') id: number, @Res() res: Response) {
    const anime = await this.animeService.getAnimeWithoutImageById(id);
    if (!anime) throw new BadRequestException();
    return res.status(HttpStatus.OK).json(anime);
  }

  @Put(':id')
  @UseGuards(AuthGuard, AnimeGuard)
  public async updateAnime(
    @Param('id') id: number,
    @Body() dto: AnimeUpdateDto,
    @Res() res: Response,
  ) {
    return res.status(HttpStatus.OK).json({ id, dto });
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AnimeGuard)
  public async deleteAnime(@Param('id') id: number, @Res() res: Response) {
    return res.status(HttpStatus.OK).json(id);
  }
}
