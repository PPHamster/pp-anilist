import { Module } from '@nestjs/common';
import { AuthModule } from '@/modules/AuthModule';
import { PrismaModule } from '@/modules/PrismaModule';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './UserModule';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    PrismaModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
