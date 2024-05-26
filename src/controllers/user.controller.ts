import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  ValidationPipe,
  Res,
  Param,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDTO } from 'src/dtos/create-user-dto';
import { LoginDTO } from 'src/dtos/login-dto';
import { Response } from 'express';
import { User } from 'src/models/entities/user.entity';
import { ResetPasswordDto } from 'src/dtos/reset-password-dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(
    @Body(new ValidationPipe()) loginDTO: LoginDTO,
    @Res() res: Response,
  ) {
    try {
      const { email, password } = loginDTO;
      console.log(email, password);
      const result = await this.userService.login(email, password);
      if (!result || result === null) {
        return res.status(401).json({
          statusCode: 401,
          success: false,
          message: 'Invalid email or password',
        });
      }
      const { token, user } = result;
      return res.status(200).json({
        statusCode: 200,
        success: true,
        token,
        user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        statusCode: 500,
        success: false,
        message: 'Internal Server Error',
      });
    }
  }

  //Realizar a busca de todos os usuários
  @Get('getAllUsers')
  async getUsers(@Res() res: Response) {
    try {
      const users = await this.userService.getUsers();
      return res.status(200).json({
        statusCode: 200,
        success: true,
        data: {
          users,
        },
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        success: false,
        message: 'Internal Server Error',
      });
    }
  }

  @Get('getUser/:id')
  async getUser(@Param('id') id: string, @Res() res: Response) {
    const user = await this.userService.getUserByName(id);
    console.log(user);
    return res.status(200).json(user);
  }
  //inserção de usuário
  @Post('insertUser')
  async addUser(
    @Body(
      new ValidationPipe({
        transform: true,
        validationError: { target: false },
      }),
    )
    user: CreateUserDTO,
    @Res() res: Response,
  ) {
    const { name, email, password, userType } = user;
    try {
      await this.userService.addUser(name, email, password, userType);
      return res.status(201).json({
        statusCode: 201,
        success: true,
        message: 'User created successfully',
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        statusCode: 400,
        success: false,
        error: 'User not created',
      });
    }
  }

  @Put('updateUser/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() user: User,
    @Res() res: Response,
  ) {
    try {
      await this.userService.updateUser(id, user);
      return res.json({
        statusCode: 200,
        success: true,
        message: 'User updated successfully',
      });
    } catch (error) {
      return res.json({
        statusCode: 400,
        success: false,
        error: 'User not updated',
      });
    }
  }

  @Delete('deleteUser/:id')
  async deleteUser(@Param('id') id: string, @Res() res: Response) {
    console.log(id);
    await this.userService.deleteUser(id);
    return res.json({
      statusCode: 200,
      success: true,
      message: 'User deleted successfully',
    });
  }

  @Put('resetPassword')
  async resetPassword(@Body() body: ResetPasswordDto, @Res() res: Response) {
    const { id, newPassword } = body;
    console.log(id);
    console.log(newPassword);
    //Caso de reset de senha via página do usuário
    if (id !== undefined && newPassword !== undefined) {
      try {
        const reset = await this.userService.resetPassword(body);
        if (reset !== null) {
          return res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Password updated successfully',
          });
        } else {
          return res.status(400).json({
            statusCode: 400,
            success: false,
            error: 'Password not updated',
          });
        }
      } catch (error) {
        return res.json({
          statusCode: 400,
          success: false,
          error: 'Password not updated',
        });
      }
    }
  }

  @Post('getUserByEmail')
  async getUserByEmail(@Body() body: { email: string }, @Res() res: Response) {
    try {
      const user = await this.userService.findOneByEmail(body.email);
      console.log(user);
      if (user !== null) {
        return res.status(200).json({
          statusCode: 200,
          success: true,
          data: {
            user,
          },
        });
      } else {
        return res.status(404).json({
          statusCode: 404,
          success: false,
          message: 'User not found',
        });
      }
    } catch (error) {
      return res.json({
        statusCode: 500,
        success: false,
        message: 'Internal Server Error',
      });
    }
  }
}
