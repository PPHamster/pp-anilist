import { AnimeService } from '@/services/AnimeService';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';

type AnimeParams = {
  id: number | undefined;
};

@Injectable()
export class AnimeGuard implements CanActivate {
  public constructor(private readonly animeService: AnimeService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params } = context.switchToHttp().getRequest<Request>();
    const { id } = params as unknown as AnimeParams;

    if (!id) throw new BadRequestException();

    const anime = await this.animeService.getAnimeWithoutImageById(+id);

    if ((user as User).id !== anime.userId) throw new ForbiddenException();

    return true;
  }
}
