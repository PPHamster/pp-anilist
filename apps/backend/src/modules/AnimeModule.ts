import { AnimeController } from '@/controllers/AnimeController';
import { AnimeRepository } from '@/repositories/AnimeRepository';
import { SeasonRepository } from '@/repositories/SeasonRepository';
import { WaifuRepository } from '@/repositories/WaifuRepository';
import { AnimeService } from '@/services/AnimeService';
import { Module } from '@nestjs/common';

@Module({
  controllers: [AnimeController],
  providers: [AnimeRepository, SeasonRepository, WaifuRepository, AnimeService],
  exports: [AnimeService],
})
export class AnimeModule {}
