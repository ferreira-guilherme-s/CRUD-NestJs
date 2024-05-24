import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/models/entitites/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getUsers() {
    return 'Get all users';
  }

  getUser(id: string) {
    return `Get user with id ${id}`;
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

  updateUser(id: string) {
    return `Update user with id ${id}`;
  }

  deleteUser(id: string) {
    return `Delete user with id ${id}`;
  }

  //Função de login
  async login(email: string, password: string): Promise<string | null> {
    const user = await this.findOneByEmail(email);
    if (!user) {
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

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async comparePasswords(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
