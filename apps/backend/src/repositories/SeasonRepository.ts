import { PrismaService } from '@/services/PrismaService';
import { Injectable } from '@nestjs/common';
import { Season, Prisma } from '@prisma/client';

@Injectable()
export class SeasonRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public createSeason(data: Prisma.SeasonCreateInput): Promise<Season> {
    return this.prismaService.season.create({ data });
  }

  public createManySeason(data: Prisma.SeasonCreateManyInput[]) {
    return this.prismaService.season.createMany({ data });
  }

  public getManySeasonWhere(where: Prisma.SeasonWhereInput): Promise<Season[]> {
    return this.prismaService.season.findMany({ where });
  }

  public updateSeasonWhereUnique(
    args: Prisma.SeasonUpdateArgs,
  ): Promise<Season> {
    return this.prismaService.season.update(args);
  }

  public async deleteSeasonWhereUnique(where: Prisma.SeasonWhereUniqueInput) {
    await this.prismaService.season.delete({ where });
  }
}
