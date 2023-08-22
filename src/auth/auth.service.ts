import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto/auth.dto';
import mongoose, { Types } from 'mongoose';

@Injectable()
export class AuthService {


  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}


  async signUp(createUserDto: CreateUserDto): Promise<any> {
    // Check if user exists
    const userExists = await this.usersService.findByNickName(
      createUserDto.nickname,
    );
    if (userExists) {
      throw new BadRequestException('User already exists!');
    }

    // Hash password
    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    const tokens = await this.getTokens(newUser._id, newUser.nickname);
    await this.updateUserLogInStatus(newUser.id);
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);

    const { firstname, lastname, nickname, gender, age, isLoggedIn, lastLogggedInAt, lastLogggedOutAt } = newUser;

    return {
      userInfo: {
        firstname, 
        lastname, 
        nickname,
        gender, 
        age, 
        isLoggedIn, 
        lastLogggedInAt,
        lastLogggedOutAt,
        tokens
      }
    };
  }

  async signIn(data: AuthDto) {
    // Check if user exists
    const user = await this.usersService.findByNickName(data.nickname);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user._id, user.nickname);
    await this.updateUserLogInStatus(user.id);
    await this.updateRefreshToken(user._id, tokens.refreshToken);

    const { firstname, lastname, nickname, gender, age, isLoggedIn, lastLogggedInAt, lastLogggedOutAt } = user;
    return {
      userInfo: {
        firstname, 
        lastname,
        nickname, 
        gender, 
        age, 
        isLoggedIn, 
        lastLogggedInAt,
        lastLogggedOutAt,
        tokens
      }
    };
  }

  async getLogStatus(nickname: string) {
     const user = await this.usersService.findByNickName(nickname);
     if (!user) {
      throw new BadRequestException('User doesn\'t exist!');
     }
     return user?.isLoggedIn;
  }

  async logout(userId: string) {
    this.usersService.update(userId, { refreshToken: null });
    await this.updateUserLogoutStatus(userId);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.nickname);
    await this.updateUserLogInStatus(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateUserLogInStatus(userId: string) {
    await this.usersService.update(userId, {
      isLoggedIn: true,
      lastLogggedInAt: new Date().toISOString()
    })
  }

  async updateUserLogoutStatus(userId: string) {
    await this.usersService.update(userId, {
      isLoggedIn: false,
      lastLogggedOutAt: new Date().toISOString()
    })
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get('tokenInfo').access.key,
          expiresIn: this.configService.get('tokenInfo').access.expiresIn
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get('tokenInfo').refresh.key,
          expiresIn: this.configService.get('tokenInfo').refresh.expiresIn
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
