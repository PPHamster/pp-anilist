import { PrismaService } from '@/services/PrismaService';
import { Injectable } from '@nestjs/common';
import { Waifu, Prisma } from '@prisma/client';

@Injectable()
export class WaifuRepository {
  public constructor(private readonly prismaService: PrismaService) {}

  public createWaifu(data: Prisma.WaifuCreateManyInput): Promise<Waifu> {
    return this.prismaService.waifu.create({ data });
  }

  public getWaifuWhereUnique(
    where: Prisma.WaifuWhereUniqueInput,
  ): Promise<Waifu | null> {
    return this.prismaService.waifu.findUnique({ where });
  }

  public updateWaifuWhereUnique(args: Prisma.WaifuUpdateArgs): Promise<Waifu> {
    return this.prismaService.waifu.update(args);
  }

  public async deleteWaifuWhereUnique(where: Prisma.WaifuWhereUniqueInput) {
    await this.prismaService.waifu.delete({ where });
  }
}
