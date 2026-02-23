import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RoleModel } from '../sequelize/models/role.model';
import { PermissionModel } from '../sequelize/models/permission.model';
import { AppModuleModel } from '../sequelize/models/app.module.model';
import { CaslAbilityFactory } from 'src/rbac/casl-ability.factory';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    SequelizeModule.forFeature([RoleModel, PermissionModel, AppModuleModel]),
    UsersModule,
  ],
  controllers: [RolesController],
  providers: [RolesService, CaslAbilityFactory],
  exports: [RolesService],
})
export class RolesModule {}
