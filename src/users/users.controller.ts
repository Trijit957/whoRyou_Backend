import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Version,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Version('1')
  @UseGuards(AccessTokenGuard)
  @Post('createUser')
  public async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Version('1')
  @UseGuards(AccessTokenGuard)
  @Get('getAllUsers')
  public async findAll() {
    return await this.usersService.findAll();
  }

  @Version('1')
  @UseGuards(AccessTokenGuard)
  @Get('getUserById/:id')
  public async findById(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }

  @Version('1')
  @Get('getUserByNickname/:nickname')
  public async findByNickname(@Param('nickname') nickname: string) {
    return await this.usersService.findByNickName(nickname);
  }

  @Version('1')
  @Get('nicknameExistance/:nickname')
  public async isNickNameExists(@Param('nickname') nickname: string) {
      const user = await this.usersService.findByNickName(nickname);
      return {
        status: user ? true : false
      }
  }

  @Version('1')
  @UseGuards(AccessTokenGuard)
  @Get('getUserInfo')
  public async getUserInfo(@Req() req: Request) {
      const userId = req.user['sub'];
      const user = await this.usersService.findById(userId);
      const { firstname, lastname, nickname, gender, age, isLoggedIn, lastLogggedInAt, lastLogggedOutAt } = user;
      return {
        firstname,
        lastname,
        nickname,
        gender,
        age,
        isLoggedIn,
        lastLogggedInAt,
        lastLogggedOutAt
      }
  }

  @Version('1')
  @UseGuards(AccessTokenGuard)
  @Patch('updateUserById/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Version('1')
  @UseGuards(AccessTokenGuard)
  @Delete('deleteUserById/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
