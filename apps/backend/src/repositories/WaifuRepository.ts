import { PrismaService } from '@/services/PrismaService';
import { Injectable } from '@nestjs/common';
import { Waifu, Prisma } from '@prisma/client';

@Injectable()
export class WaifuRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public createWaifu(data: Prisma.WaifuCreateManyInput): Promise<Waifu> {
    return this.prismaService.waifu.create({ data });
  }

  public getWaifuWithoutImageWhereUnique(where: Prisma.WaifuWhereUniqueInput) {
    return this.prismaService.waifu.findUnique({
      where,
      select: {
        description: true,
        id: true,
        level: true,
        nameEn: true,
        nameTh: true,
      },
    });
  }

  public getWaifuImageWhereUnique(where: Prisma.WaifuWhereUniqueInput) {
    return this.prismaService.waifu.findUnique({
      where,
      select: { image: true },
    });
  }

  public updateWaifuWhereUnique(args: Prisma.WaifuUpdateArgs): Promise<Waifu> {
    return this.prismaService.waifu.update(args);
  }

  public deleteWaifuWhereUnique(where: Prisma.WaifuWhereUniqueInput) {
    return this.prismaService.waifu.delete({ where });
  }
}
