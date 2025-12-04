import { Module } from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { PoliciesController } from './policies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PolicyEntity } from './entities/policy.entity';
import { UsersEntity } from 'src/auth/entities/users.entity';

@Module({
  controllers: [PoliciesController],
  providers: [PoliciesService],
  imports: [TypeOrmModule.forFeature([PolicyEntity, UsersEntity])],
  exports: [TypeOrmModule, PoliciesService],
})
export class PoliciesModule {}
