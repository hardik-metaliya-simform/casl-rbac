import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { PoliciesGuard } from '../rbac/guards/policies.guard';
import { CheckPermission } from '../rbac/decorators/check-permission.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CaslAbilityFactory } from '../rbac/casl-ability.factory';
import { UpdateUserDto } from './dto/update-user.dto';
import { redactFieldsByAbility } from '../rbac/redact-fields.util';

@Controller('users')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  @Get('me')
  async me(@Req() req: any) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) return null;
    const ability = await this.abilityFactory.createForUserId(req.user.userId);
    const plainUser = user.get ? user.get({ plain: true }) : user;
    return redactFieldsByAbility(plainUser, ability, 'users');
  }

  @Get('abilities')
  async abilities(@Req() req: any) {
    const ability = await this.abilityFactory.createForUserId(req.user.userId);
    const allowed: Record<string, string[]> = {};
    (ability.rules || []).forEach((r) => {
      const subject = r.subject;
      if (typeof subject !== 'string') return;
      allowed[subject] = allowed[subject] || [];
      const action = String(r.action ?? '');
      if (action && !allowed[subject].includes(action))
        allowed[subject].push(action);
    });
    return { abilities: allowed };
  }

  @Get()
  @CheckPermission('users', 'read')
  async listUsers(@Req() req: any) {
    const users = await this.usersService.listUsers();
    const ability = await this.abilityFactory.createForUserId(req.user.userId);
    return redactFieldsByAbility(
      users.map((user: any) => (user.get ? user.get({ plain: true }) : user)),
      ability,
      'users',
    );
  }

  @Get(':id')
  @CheckPermission('users', 'read')
  async getUserById(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    const user = await this.usersService.findById(id);
    if (!user) return null;
    const ability = await this.abilityFactory.createForUserId(req.user.userId);
    const plainUser = user.get ? user.get({ plain: true }) : user;
    return redactFieldsByAbility(plainUser, ability, 'users');
  }

  @Post()
  @CheckPermission('users', 'create')
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(
      body.username,
      body.password,
      body.roles || [],
      body.salary,
    );
  }

  @Put(':id')
  @CheckPermission('users', 'update')
  updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() body: any) {
    return this.usersService.updateUser(id, body);
  }

  @Delete(':id')
  @CheckPermission('users', 'delete')
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }

  @Put(':id/roles')
  @CheckPermission('users', 'update')
  assignRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: AssignRolesDto,
  ) {
    return this.usersService.assignRolesToUser(id, body.roleIds || []);
  }
}
