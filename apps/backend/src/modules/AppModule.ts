import { Module } from '@nestjs/common';
import { AuthModule } from '@/modules/AuthModule';
import { PrismaModule } from '@/modules/PrismaModule';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './UserModule';
import { AnimeModule } from './AnimeModule';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    AnimeModule,
  ],
})
export class AppModule {}
