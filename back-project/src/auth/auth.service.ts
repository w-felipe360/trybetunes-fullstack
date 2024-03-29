import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async login(user: any) {
    const payload = { username: user.username, sub: user.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }
  async validateUser(username: string, password: string) {
    let user: User;
    try {
      user = await this.usersService.findByUsername(username);
    } catch (error) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }
}
