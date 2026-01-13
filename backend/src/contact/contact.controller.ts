import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { RespondMessageDto } from './dto/respond-message.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { GetUser } from 'src/auth/decorators/get-user/get-user.decorator';
import { GetUserOptional } from 'src/auth/decorators/get-user-optional/get-user-optional.decorator';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optional-jwt/optional-jwt.guard';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // Endpoint público para enviar mensajes (con autenticación opcional)
  @Post('send-message')
  @UseGuards(OptionalJwtAuthGuard)
  async sendMessage(
    @Body() createDto: CreateContactMessageDto,
    @GetUserOptional() user?: any,
  ) {
    // Si el usuario está logueado, usar su company_id
    const userCompanyId = user?.company?.id || user?.company_id || undefined;
    const userId = user?.id || createDto.user_id || undefined;
    return this.contactService.createMessage(createDto, userCompanyId, userId);
  }

  // Endpoint para que los usuarios vean sus propios mensajes
  @Get('my-messages')
  @UseGuards(OptionalJwtAuthGuard)
  async getMyMessages(@GetUserOptional() user?: any) {
    if (!user || !user.id) {
      throw new Error('Debes estar autenticado para ver tus mensajes');
    }
    return this.contactService.findByUserId(user.id);
  }

  // Endpoints protegidos para administradores
  @Get('messages')
  @Auth(ValidRoles.admin, ValidRoles.super_user)
  async getAllMessages(@GetUser() user: any) {
    // Super_user ve todos, admin solo ve su empresa
    const requesterCompanyId = user.roles?.includes('super_user')
      ? undefined
      : (user.company?.id || user.company_id);
    return this.contactService.findAll(requesterCompanyId);
  }

  @Get('messages/:id')
  @Auth(ValidRoles.admin, ValidRoles.super_user)
  async getMessage(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.findOne(id);
  }

  @Patch('messages/:id/read')
  @Auth(ValidRoles.admin, ValidRoles.super_user)
  async markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.markAsRead(id);
  }

  @Patch('messages/:id/respond')
  @Auth(ValidRoles.admin, ValidRoles.super_user)
  async respondToMessage(
    @Param('id', ParseIntPipe) id: number,
    @Body() respondDto: RespondMessageDto,
    @GetUser() user: any,
  ) {
    return this.contactService.respondToMessage(id, respondDto, user.id);
  }

  @Delete('messages/:id')
  @Auth(ValidRoles.admin, ValidRoles.super_user)
  async deleteMessage(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.deleteMessage(id);
  }
}
