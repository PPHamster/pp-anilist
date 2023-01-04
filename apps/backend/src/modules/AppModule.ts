import { Module } from '@nestjs/common';
import { AuthModule } from '@/modules/AuthModule';
import { PrismaModule } from '@/modules/PrismaModule';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    AuthModule,
    PrismaModule,
  ],
})
export class AppModule {}
