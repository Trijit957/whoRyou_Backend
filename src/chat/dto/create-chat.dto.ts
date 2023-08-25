import { IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreateChatDto {
   
   @IsDefined()
   @IsNotEmpty()
   @IsString()
   @IsOptional()
   senderId?: string;

   @IsDefined()
   @IsNotEmpty()
   @IsString()
   receiverId: string;

   @IsDefined()
   @IsNotEmpty()
   @IsString()
   message: string;

   @IsDefined()
   @IsNotEmpty()
   @IsString()
   @IsOptional()
   time?: string;

   @IsDefined()
   @IsNotEmpty()
   @IsString()
   status: string;
}