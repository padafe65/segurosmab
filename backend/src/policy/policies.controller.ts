import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Post('create')
  create(@Body() dto: CreatePolicyDto) {
    return this.policiesService.create(dto);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.policiesService.findAll(pagination);
  }

  @Get('user/:id')
  findMany(@Param('id', ParseIntPipe) id: number) {
    return this.policiesService.findByUser(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.policiesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePolicyDto) {
    return this.policiesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.policiesService.remove(id);
  }
}
