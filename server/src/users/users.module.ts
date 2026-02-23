import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CaslAbilityFactory } from '../rbac/casl-ability.factory';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from '../sequelize/models/user.model';
import { RoleModel } from '../sequelize/models/role.model';
import { PermissionModel } from '../sequelize/models/permission.model';
import { AppModuleModel } from '../sequelize/models/app.module.model';
import { UserRole } from '../sequelize/models/user-role.model';
import { RolePermission } from '../sequelize/models/role-permission.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      UserModel,
      RoleModel,
      PermissionModel,
      AppModuleModel,
      // join models
      UserRole,
      RolePermission,
    ]),
  ],
  providers: [UsersService, CaslAbilityFactory],
  controllers: [UsersController],
  exports: [UsersService, CaslAbilityFactory],
})
export class UsersModule {}
