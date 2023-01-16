import { AnimeService } from '@/services/AnimeService';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';

type AnimeParams = {
  id: number | undefined;
  seasonId: number | undefined;
};

@Injectable()
export class RouteGuard implements CanActivate {
  public constructor(private readonly animeService: AnimeService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const { params } = context.switchToHttp().getRequest<Request>();
    const { id, seasonId } = params as unknown as AnimeParams;

    if (!id) throw new BadRequestException("Don't have id in params");

    const anime = await this.animeService.getAnimeWithoutImageById(+id);

    if (!anime) throw new BadRequestException("Don't have anime for this id");

    if (!!seasonId) {
      const animeInfo =
        await this.animeService.getUserIdAndAnimeIdFromSeasonByIdOrThrow(
          +seasonId,
        );

      if (anime.id !== animeInfo.id)
        throw new BadRequestException("This id don't exist in this anime");
    }

    return true;
  }
}
