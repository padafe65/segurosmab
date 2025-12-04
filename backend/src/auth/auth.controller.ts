import { Body, Controller, Get, Post, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user/get-user.decorator';
import { ValidRoles } from './interfaces/valid-roles';
import { UserRolesGuard } from './guards/user-roles/user-roles.guard';
import { RoleProtected } from './decorators/role-protected/role-protected.decorator';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDTO){
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDTO){
    return this.authService.loginUser(loginUserDto);
  }

  @Get('getUserExpress')
  @UseGuards(AuthGuard('jwt'))
  getUserExpress(
    @Req() req: Express.Request,
  ){
    return req.user;
  }

  @SetMetadata('ROLES', [ValidRoles.admin, ValidRoles.super_user, ValidRoles.user])
  @Get('getUserWithDecorator')
  @UseGuards(AuthGuard('jwt'))
  getUserWithDecorator(
    @GetUser() user
  ){
    return user;
  }

  @Get('private1')
  @RoleProtected()
  @UseGuards(AuthGuard('jwt'), UserRolesGuard)
  private1(){
    return "Acceso permitido";
  }
  

  @Get('private2')
  @Auth(ValidRoles.user)
  private2(){
    return this.private2();
  }

}
