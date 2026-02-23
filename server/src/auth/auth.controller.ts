import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto/login.dto';
import { CaslAbilityFactory } from '../rbac/casl-ability.factory';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.usersService.findByUsername(dto.username);
    if (!user) throw new UnauthorizedException();
    // password check via AuthService validateUser
    const valid = await this.authService.validateUser(
      dto.username,
      dto.password,
    );
    if (!valid) throw new UnauthorizedException();
    const token = await this.authService.login(user);
    const ability = await this.abilityFactory.createForUserId(user.id);
    const allowed: Record<string, string[]> = {};
    console.log('User abilities:', ability.rules);
    (ability.rules || []).forEach(
      (r: { subject: string; action: string; inverted?: boolean }) => {
        const subject = r.subject;
        if (typeof subject !== 'string') return;
        // Only include non-inverted (allowed) actions
        if (r.inverted) return;
        allowed[subject] = allowed[subject] || [];
        const action = String(r.action || '');
        if (action && !allowed[subject].includes(action)) {
          allowed[subject].push(action);
        }
      },
    );
    // Remove empty arrays (no allowed actions)
    Object.keys(allowed).forEach((subject) => {
      if (!allowed[subject] || allowed[subject].length === 0) {
        delete allowed[subject];
      }
    });

    return {
      ...token,
      abilities: allowed,
      user: { id: user.id, username: user.username },
    };
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const existing = await this.usersService.findByUsername(dto.username);
    if (existing) throw new UnauthorizedException('User exists');

    // Assign default role 'reader'
    const user = await this.usersService.createUser(
      dto.username,
      dto.password,
      dto.roles || [],
    );

    return { id: user.id, username: user.username, roles: user.roles };
  }
}
