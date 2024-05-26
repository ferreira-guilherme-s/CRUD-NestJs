import * as joi from 'joi';

export class CreateUserDTO {
  id: string;
  name: string;
  email: string;
  password: string;
  userType: string;

  static validationSchema = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
    userType: joi.string().required(),
  });
}
