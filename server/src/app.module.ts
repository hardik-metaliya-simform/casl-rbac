import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import sequelizeConfig from './config/sequelize.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { RoleModel } from './sequelize/models/role.model';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: sequelizeConfig.dialect,
      host: sequelizeConfig.host,
      port: sequelizeConfig.port,
      username: sequelizeConfig.username,
      password: sequelizeConfig.password,
      database: sequelizeConfig.database,
      logging: sequelizeConfig.logging,
      autoLoadModels: true,
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
