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
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Version('1')
  @UseGuards(AccessTokenGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Version('1')
  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Version('1')
  @Get('getUserByNickname/:nickname')
  async findByNickname(@Param('nickname') nickname: string) {
    return await this.usersService.findByNickName(nickname);
  }

  @Version('1')
  @Get('nicknameExistance/:nickname')
  async isNickNameExists(@Param('nickname') nickname: string) {
      const user = await this.usersService.findByNickName(nickname);
      return {
        status: user ? true : false
      }
  }

  @Version('1')
  @UseGuards(AccessTokenGuard)
  @Get('info')
  async getUserInfo(@Req() req: Request) {
      const userId = req.user['sub'];
      const user = await this.usersService.findById(userId);
      return user;
  }

  @Version('1')
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Version('1')
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
