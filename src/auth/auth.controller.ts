import { Body, Controller, Get, Param, Post, Req, UseGuards, Version } from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ExtendedRequest } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Version('1')
  @Post('signup')
  public async signup(@Body() createUserDto: CreateUserDto) {
     return await this.authService.signUp(createUserDto);
  }

  @Version('1')
  @Post('signin')
  public async signin(@Body() data: AuthDto) {
    return await this.authService.signIn(data);
  }

  @Version('1')
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  public async logout(@Req() req: Request) {
    await this.authService.logout(req.user['sub']);
  }
 
  @Version('1')
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  public async refreshTokens(@Req() req: ExtendedRequest) {
    console.log(req.user);
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return await this.authService.refreshTokens(userId, refreshToken);
  }

  @Version('1')
  @UseGuards(AccessTokenGuard)
  @Get('getLogStatus/:nickname')
  public async getLogStatus(@Param('nickname') nickname: string) {
     const status = await this.authService.getLogStatus(nickname);
     return { status };
  }
}
