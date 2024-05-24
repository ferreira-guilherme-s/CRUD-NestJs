import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDTO } from 'src/dtos/create-user-dto';
import { LoginDTO } from 'src/dtos/login-dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  login(@Body(new ValidationPipe()) loginDTO: LoginDTO) {
    const { email, password } = loginDTO;
    return this.userService.login(email, password);
  }

  @Get('getUsers')
  getUsers() {
    return this.userService.getUsers();
  }

  @Get('getUsers/:id')
  getUser(id: string) {
    return this.userService.getUser(id);
  }
  //inserção de usuário
  @Post('insertUser')
  addUser(
    @Body(
      new ValidationPipe({
        transform: true,
        validationError: { target: false },
      }),
    )
    user: CreateUserDTO,
  ) {
    const { name, email, password } = user;
    try {
      const user = this.userService.addUser(name, email, password);
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Put('updateUser/:id')
  updateUser(id: string) {
    return this.userService.updateUser(id);
  }

  @Delete('deleteUser/:id')
  deleteUser(id: string) {
    return this.userService.deleteUser(id);
  }
}
