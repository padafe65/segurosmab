// src/policy/policies.service.ts
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PolicyEntity } from './entities/policy.entity';
import { Repository } from 'typeorm';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { UsersEntity } from 'src/auth/entities/users.entity';

@Injectable()
export class PoliciesService {
  private readonly logger = new Logger('PoliciesService');

  constructor(
    @InjectRepository(PolicyEntity)
    private readonly policyRepository: Repository<PolicyEntity>,

    @InjectRepository(UsersEntity)
    private readonly userRepository: Repository<UsersEntity>,
  ) {}

  async create(dto: CreatePolicyDto) {
    try {
      const user = await this.userRepository.findOneBy({ id: +dto.user_id });
      if (!user)
        throw new NotFoundException(`User with id ${dto.user_id} not found`);

      const { user_id, ...rest } = dto;

      const policy = this.policyRepository.create({
        ...rest,
        user,
      });

      const saved = await this.policyRepository.save(policy);
      return {
        message: 'Policy created!',
        policy: saved,
      };
    } catch (error) {
      this.handlerErrors(error);
    }
  }

  async findAllWithFilters(params: {
    userId?: string;
    policyNumber?: string;
    placa?: string;
    limit?: number;
    skip?: number;
  }) {
    try {
      const { userId, policyNumber, placa, limit, skip } = params;

      const query = this.policyRepository
        .createQueryBuilder('policy')
        .leftJoinAndSelect('policy.user', 'user')
        .skip(skip || 0)
        .take(limit || 100);

      if (userId) {
        query.andWhere('user.id = :uid', { uid: Number(userId) });
      }

      if (policyNumber) {
        query.andWhere('policy.policy_number ILIKE :pn', {
          pn: `%${policyNumber}%`,
        });
      }

      if (placa) {
        query.andWhere('policy.placa ILIKE :pl', { pl: `%${placa}%` });
      }

      return await query.getMany();
    } catch (error) {
      this.handlerErrors(error);
    }
  }

  async findOne(id_policy: number) {
    const policy = await this.policyRepository.findOne({
      where: { id_policy },
      relations: ['user'],
    });

    if (!policy)
      throw new NotFoundException(`Policy with id ${id_policy} not found`);

    return policy;
  }

  async findByUser(userId: number) {
    return await this.policyRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async update(id_policy: number, dto: UpdatePolicyDto) {
    try {
      const { user_id, ...rest } = dto as any;

      // 🔥 preload usando id_policy
      const policy = await this.policyRepository.preload({
        id_policy,
        ...rest,
      });

      if (!policy)
        throw new NotFoundException(`Policy with id ${id_policy} not found`);

      if (user_id) {
        const user = await this.userRepository.findOneBy({ id: +user_id });
        if (!user)
          throw new NotFoundException(`User with id ${user_id} not found`);
        policy.user = user;
      }

      const saved = await this.policyRepository.save(policy);
      return { message: 'Policy updated!', policy: saved };
    } catch (error) {
      this.handlerErrors(error);
    }
  }

  async remove(id_policy: number) {
    try {
      const policy = await this.findOne(id_policy);
      await this.policyRepository.delete({ id_policy });
      return `Policy with id ${id_policy} was deleted`;
    } catch (error) {
      this.handlerErrors(error);
    }
  }

  private handlerErrors(error: any) {
    this.logger.error(error);
    throw new BadRequestException(error?.message || 'Unexpected error');
  }
}
