import { AbilityBuilder, AbilityClass, Ability } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Action } from './enums/action.enum';
import { RoleModel } from '../sequelize/models/role.model';
import { PermissionModel } from '../sequelize/models/permission.model';
import { InjectModel } from '@nestjs/sequelize';
import { AppModuleModel } from 'src/sequelize/models/app.module.model';

type Subjects = string;
export type AppAbility = Ability<[Action | string, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(
    private usersService: UsersService,
    @InjectModel(AppModuleModel) private modulesRepo: typeof AppModuleModel,
  ) {}

  async createForUserId(userId: string) {
    const { can, cannot, build } = new AbilityBuilder<Ability>(
      Ability as AbilityClass<AppAbility>,
    );

    const user = await this.usersService.findById(userId);
    if (!user) return build() as AppAbility;

    // Super admin case: grants all permissions for all modules
    if (user.username === 'hardik') {
      const modules = await this.modulesRepo.findAll({
        include: [{ model: PermissionModel, as: 'permissions' }],
      });

      modules.forEach((module) => {
        module.permissions?.forEach((perm) => {
          can(perm.action, module.name);
        });
      });

      return build() as AppAbility;
    }

    // Non-admin case: grants permissions based on roles
    (user.roles || []).forEach((r: RoleModel) => {
      (r.permissions || []).forEach((perm: PermissionModel) => {
        const moduleName = perm.module?.name ?? perm.moduleId;
        if (!moduleName) {
          console.error(`Module name not found for permission: ${perm.id}`);
          return;
        }
        can(perm.action, moduleName);
      });
    });

    // Check if user has TM role for salary access
    const roles = user.roles || [];
    const isTM = roles.some((role: any) => role.name === 'TM');

    // Only TM role can read salary field
    if (isTM) {
      can('read', 'users', ['salary']);
    } else {
      cannot('read', 'users', ['salary']);
    }

    return build() as AppAbility;
  }
}
