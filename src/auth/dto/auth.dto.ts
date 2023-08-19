import { IsDefined, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class AuthDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  nickname: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  password: string;
}
