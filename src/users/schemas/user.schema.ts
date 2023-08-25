import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  versionKey: false
})
export class User {
  @Prop({ type: String, required: true })
  firstname: string;

  @Prop({ type: String, required: true })
  lastname: string;

  @Prop({ type: String, required: true, unique: true, minlength: 5, maxlength: 20 })
  nickname: string;

  @Prop({ type: Number, required: true })
  age: number;

  @Prop({ type: String, required: true })
  gender: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Date })
  lastLogggedInAt: Date;

  @Prop({ type: Date })
  lastLogggedOutAt: Date;

  @Prop({ type: String })
  refreshToken: string;

  @Prop({ type: Boolean })
  isLoggedIn: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
