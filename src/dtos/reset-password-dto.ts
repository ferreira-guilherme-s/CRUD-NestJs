import * as joi from 'joi';

export class ResetPasswordDto {
  id: string;
  email: string;
  newPassword: string;
  oldPassword: string;

  static validationSchema = joi.object({
    id: joi.string(),
    email: joi.string().email(),
    password: joi.string().min(6),
    oldPassword: joi.string(),
  });
}
