import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/models/entitites/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ResetPasswordDto } from 'src/dtos/reset-password-dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getUsers() {
    return this.userRepository.find({
      select: ['id', 'name', 'email'],
    });
  }

  getUserByName(id: string): Promise<User | undefined> {
    console.log('Id recebido: ', id);
    const idReplace = id.replace(`:`, '');
    return this.userRepository.findOne({
      where: { id: idReplace },
      select: ['id', 'name', 'email'],
    });
  }

  //Função de inserção de usuário
  async addUser(name: string, email: string, password: string): Promise<User> {
    const passwordHash = bcrypt.hashSync(password, 10);
    const user = new User();
    user.name = name;
    user.email = email;
    user.password = passwordHash;

    return await this.userRepository.save(user);
  }

  updateUser(id: string, user: User) {
    const userId = id.replace(`:`, '');
    const { name, email } = user;
    if (name !== undefined && email !== undefined) {
      return this.userRepository.update(
        { id: userId },
        { name: name, email: email },
      );
    } else if (name !== undefined && email === undefined) {
      return this.userRepository.update({ id: userId }, { name: name });
    } else if (name === undefined && email !== undefined) {
      return this.userRepository.update({ id: userId }, { email: email });
    }
  }

  async deleteUser(id: string) {
    const userId = id.replace(`:`, '');
    await this.userRepository.delete({ id: userId });
  }

  //Função de login
  async login(email: string, password: string): Promise<string | null> {
    const user = await this.findOneByEmail(email);
    if (user === undefined) {
      return null;
    }

    const validPassword = await this.comparePasswords(password, user.password);
    if (!validPassword) {
      return null;
    }

    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
      expiresIn: '1h',
    });

    return token;
  }

  async resetPassword(user: ResetPasswordDto) {
    const { id, newPassword, oldPassword } = user;
    console.log(user);
    if (id !== undefined) {
      if (oldPassword !== undefined) {
        const user = await this.userRepository.findOne({ where: { id } });
        const validPassword = await this.comparePasswords(
          oldPassword,
          user.password,
        );
        if (!validPassword) {
          return null;
        }
      }
      const passwordHash = bcrypt.hashSync(newPassword, 10);
      await this.userRepository.update({ id }, { password: passwordHash });
      console.log('Password updated');
    }
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async comparePasswords(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
