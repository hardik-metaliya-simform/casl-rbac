import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostsModel } from 'src/sequelize/models/posts.model';
import { AppModuleModel } from 'src/sequelize/models/app.module.model';
import { CaslAbilityFactory } from 'src/rbac/casl-ability.factory';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { UserModel } from 'src/sequelize/models/user.model';
import { RoleModel } from 'src/sequelize/models/role.model';
import { UserRole } from 'src/sequelize/models/user-role.model';
import { PermissionModel } from 'src/sequelize/models/permission.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      PostsModel,
      AppModuleModel,
      UserModel,
      RoleModel,
      UserModel,
      UserRole,
      PermissionModel,
    ]),
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, CaslAbilityFactory, UsersService],
})
export class PostsModule {}
