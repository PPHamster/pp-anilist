import { AnimeService } from '@/services/AnimeService';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';

type AnimeParams = {
  id: number | undefined;
  seasonId: number | undefined;
};

@Injectable()
export class PermissionGuard implements CanActivate {
  public constructor(private readonly animeService: AnimeService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params } = context.switchToHttp().getRequest<Request>();
    const { id, seasonId } = params as unknown as AnimeParams;

    const anime = await this.animeService.getAnimeWithoutImageById(+id);

    if ((user as User).id !== anime.userId)
      throw new ForbiddenException(
        "This user don't have permission to manage this anime",
      );

    if (!!seasonId) {
      const animeInfo =
        await this.animeService.getUserIdAndAnimeIdFromSeasonByIdOrThrow(
          +seasonId,
        );

      if ((user as User).id !== animeInfo.userId)
        throw new ForbiddenException(
          "This user don't have permission to manage this season",
        );
    }

    return true;
  }
}
