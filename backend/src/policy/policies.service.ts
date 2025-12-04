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
import { PaginationDto } from 'src/common/dto/pagination.dto';

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

      // remove user_id from the dto copy before create (TS typing)
      const { user_id, ...rest } = dto;

      const policy = this.policyRepository.create({
        ...rest,
        user,
      });

      const saved = await this.policyRepository.save(policy);
      return {
        Details: {
          Message: 'Policy created!',
          Policy: saved,
        },
      };
    } catch (error) {
      this.handlerErrors(error);
    }
  }

  async findAll(pagination: PaginationDto) {
    try {
      const { limit, skip } = pagination;
      return await this.policyRepository.find({
        skip,
        take: limit,
        relations: ['user'],
      });
    } catch (error) {
      this.handlerErrors(error);
    }
  }

  async findOne(id: number) {
    const policy = await this.policyRepository.findOne({
      where: { id_policy: id },
      relations: ['user'],
    });
    if (!policy) throw new NotFoundException(`Policy with id ${id} not found`);
    return policy;
  }

  async findByUser(userId: number) {
    return await this.policyRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async update(id: number, dto: UpdatePolicyDto) {
    try {
      // preload expects the partial entity with typed fields
      const { user_id, ...rest } = dto as any;

      const policyToPreload: any = { id_policy: id, ...rest };
      const policy = await this.policyRepository.preload(policyToPreload);

      if (!policy)
        throw new NotFoundException(`Policy with id ${id} not found`);

      if (user_id) {
        const user = await this.userRepository.findOneBy({ id: +user_id });
        if (!user)
          throw new NotFoundException(`User with id ${user_id} not found`);
        policy.user = user;
      }

      await this.policyRepository.save(policy);
      return { Message: 'Policy updated!' };
    } catch (error) {
      this.handlerErrors(error);
    }
  }

  async remove(id: number) {
    try {
      const policy = await this.findOne(id);
      await this.policyRepository.delete(id);
      return `Policy with id ${id} was deleted`;
    } catch (error) {
      this.handlerErrors(error);
    }
  }

  private handlerErrors(error: any) {
    if (error && error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new BadRequestException(error?.message || 'Unexpected error');
  }
}
