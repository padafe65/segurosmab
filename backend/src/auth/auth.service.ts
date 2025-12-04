import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entities/users.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LoginUserDTO } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Payload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UsersEntity)
    private readonly UsersRepository: Repository<UsersEntity>,

    private readonly configService: ConfigService,

    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDTO) {
    const { user_password, ...userData } = createUserDto;

    try {
      const user = await this.UsersRepository.create({
        ...userData,
        user_password: bcrypt.hashSync(
          user_password,
          Number(this.configService.get('SALT_ROUNDS_DEV')),
        ), //Bloquear el hilo principal de ejecucion
      });

      await this.UsersRepository.save(user);
      return {
        user: {
          ...userData,
        },
        Message: 'User created!!',
      };
    } catch (error) {
      this.handlerErrors(error);
    }
  }

  async loginUser(loginUserDto: LoginUserDTO) {
    const { email, user_password } = loginUserDto;

    const user = await this.UsersRepository.findOne({
      select: {
        id: true,
        user_name: true,
        user_password: true,
        isactive: true,
        email: true,
        direccion: true,
        ciudad: true,
        roles: true,
      },
      where: { email },
    });

    if (!user)
      throw new NotFoundException(`User with email: ${email} not found`);

    const passOrNotPass = bcrypt.compareSync(user_password, user.user_password);

    if (!passOrNotPass) throw new UnauthorizedException(`Password not valid`);

    const payload: Payload = {
      email: email,
      id_user: user.id,
      roles: user.roles,
    };
    return {
      Details: {
        Mesagge: 'Inicio de sesion exitoso!!',
        UserDetails: {
          name: user.user_name,
          email,
        },
      },
      token: this.jwtService.sign(payload),
    };
  }

  private handlerErrors(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new BadRequestException(error.message);
  }

  private2() {
    return { ok: true };
  }
}
