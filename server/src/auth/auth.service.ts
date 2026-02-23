import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserModel } from '../sequelize/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<Partial<UserModel> | null> {
    const user = (await this.usersService.findByUsername(
      username,
    )) as UserModel | null;
    if (user && (await bcrypt.compare(pass, (user as any).password))) {
      const { password, ...rest } = user as any;
      return rest as Partial<UserModel>;
    }
    return null;
  }

  async login(user: UserModel | { id: string; username: string }) {
    const payload = { username: (user as any).username, sub: (user as any).id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
