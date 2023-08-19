import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  nickname: string;

  @IsDefined()
  @IsNumber()
  age: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;

  @IsString()
  @IsOptional()
  lastLogggedInAt?: string;

  @IsString()
  @IsOptional()
  lastLogggedOutAt?: string;
}
