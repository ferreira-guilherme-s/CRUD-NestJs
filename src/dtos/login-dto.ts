import * as joi from 'joi';

export class LoginDTO {
  email: string;
  password: string;

  static validationSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });
}
