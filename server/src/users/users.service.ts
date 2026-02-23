import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../sequelize/models/user.model';
import { RoleModel } from '../sequelize/models/role.model';
import { PermissionModel } from '../sequelize/models/permission.model';
import { AppModuleModel } from '../sequelize/models/app.module.model';
import bcrypt from 'bcrypt';
import { UserRole } from 'src/sequelize/models/user-role.model';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(UserModel) private usersRepo: typeof UserModel,
    @InjectModel(RoleModel) private rolesRepo: typeof RoleModel,
    @InjectModel(UserRole) private userRolesRepo: typeof UserRole,
    @InjectModel(PermissionModel) private permsRepo: typeof PermissionModel,
    @InjectModel(AppModuleModel) private modulesRepo: typeof AppModuleModel,
  ) {}

  // Ideally we will have a seeder file to do the below task to save some time i have done this way
  async onModuleInit() {
    // seed demo data idempotently: modules, permissions, one role, and one user
    const moduleNames = ['posts', 'users', 'roles'];
    const actionNames = ['create', 'read', 'update', 'delete'];

    // ensure modules exist
    const modulesMap: Record<string, AppModuleModel> = {};
    for (const mName of moduleNames) {
      let m = await this.modulesRepo.findOne({ where: { name: mName } });
      if (!m) {
        m = await this.modulesRepo.create({ name: mName });
        await m.save();
      }
      modulesMap[mName] = m;
    }

    // ensure permissions for each module
    const permsMap: Record<string, PermissionModel[]> = {};
    for (const mName of moduleNames) {
      permsMap[mName] = [];
      for (const a of actionNames) {
        let p = await this.permsRepo.findOne({
          where: { moduleId: modulesMap[mName].id, action: a },
        });
        if (!p) {
          p = await this.permsRepo.create({
            moduleId: modulesMap[mName].id,
            action: a,
          });
        }
        permsMap[mName].push(p);
      }
    }

    // ensure a single role: admin
    let admin = await this.rolesRepo.findOne({ where: { name: 'admin' } });
    if (!admin) admin = await this.rolesRepo.create({ name: 'admin' });

    // assign all permissions to admin
    const allPerms = Object.values(permsMap).flat();
    await admin.$set('permissions', allPerms);

    // ensure a single user: alice
    let alice = await this.usersRepo.findOne({ where: { username: 'alice' } });
    if (!alice) {
      const salt = await bcrypt.genSalt(10);
      alice = await this.usersRepo.create({
        username: 'alice',
        password: await bcrypt.hash('pass', salt),
      });
      await alice.$set('roles', [admin]);
    }
  }

  findByUsername(username: string) {
    return this.usersRepo.findOne({
      where: { username },
      include: [
        {
          model: RoleModel,
          include: [{ model: PermissionModel, include: [AppModuleModel] }],
        },
      ],
    });
  }

  async findById(id: string) {
    const user = await this.usersRepo.findOne({
      where: { id },
      include: [
        {
          model: RoleModel,
          include: [{ model: PermissionModel, include: [AppModuleModel] }],
        },
      ],
    });
    return user;
  }

  listRoles() {
    return this.rolesRepo.findAll({
      include: [{ model: PermissionModel, include: [AppModuleModel] }],
    });
  }

  // modules & permissions
  listModules() {
    return this.modulesRepo.findAll({ include: [PermissionModel] });
  }

  createModule(name: string) {
    return this.modulesRepo.create({ name });
  }

  listPermissions() {
    return this.permsRepo.findAll({ include: [AppModuleModel] });
  }

  createPermission(moduleId: string, action: string) {
    return this.permsRepo.create({ moduleId, action });
  }

  listUsers() {
    return this.usersRepo.findAll({
      include: [
        {
          model: RoleModel,
          include: [{ model: PermissionModel, include: [AppModuleModel] }],
        },
      ],
    });
  }

  async createRole(name: string, permissionIds: string[] = []) {
    const role = await this.rolesRepo.create({ name });

    if (permissionIds && permissionIds.length > 0) {
      const perms = await this.permsRepo.findAll({
        where: { id: permissionIds },
      });

      await role.$set('permissions', perms);
    }

    return this.rolesRepo.findByPk(role.id, {
      include: [{ model: PermissionModel, include: [AppModuleModel] }],
    });
  }

  async setRolePermissions(roleId: string, permissionIds: string[]) {
    const role = await this.rolesRepo.findByPk(roleId);
    if (!role) throw new NotFoundException('Role not found');
    const perms = await this.permsRepo.findAll({
      where: { id: permissionIds },
    });
    await role.$set('permissions', perms);
    return this.rolesRepo.findByPk(roleId, {
      include: [{ model: PermissionModel, include: [AppModuleModel] }],
    });
  }

  async assignRolesToUser(userId: string, roleIds: string[]) {
    const user = await this.usersRepo.findByPk(userId);
    if (!user) throw new NotFoundException('User not found');
    const roles = await this.rolesRepo.findAll({ where: { id: roleIds } });
    await user.$set('roles', roles);
    return this.usersRepo.findByPk(userId, {
      include: [
        {
          model: RoleModel,
          include: [{ model: PermissionModel, include: [AppModuleModel] }],
        },
      ],
    });
  }

  async createUser(
    username: string,
    password: string,
    roles: string[],
    salary?: number,
  ) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.usersRepo.create({
      username,
      password: hashedPassword,
      ...(salary !== undefined ? { salary } : {}),
    } as any);

    if (roles.length > 0) {
      const roleEntities = await this.rolesRepo.findAll({
        where: { id: roles },
      });
      await user.$set('roles', roleEntities);
    }

    return user;
  }

  // Return user with roles included

  async updateUser(id: string, updateUserDto: any) {
    const user = await this.usersRepo.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.roles) {
      const roleEntities = await this.rolesRepo.findAll({
        where: { id: updateUserDto.roles },
      });
      // Remove existing user-role associations
      await this.userRolesRepo.destroy({ where: { userId: user.id } });
      // Create new associations
      const userRoleEntries = roleEntities.map((role) => ({
        userId: user.id,
        roleId: role.id,
      }));
      await this.userRolesRepo.bulkCreate(userRoleEntries as any);
    }

    // Only update salary if present
    if (updateUserDto.salary !== undefined) {
      user.salary = updateUserDto.salary;
    }

    return user.update(updateUserDto);
  }

  async deleteUser(id: string) {
    const user = await this.usersRepo.findByPk(id);
    if (!user) throw new NotFoundException('User not found');
    await user.destroy();
    return { success: true };
  }

  async findRoleById(id: string) {
    const role = await this.rolesRepo.findByPk(id, {
      include: [{ model: PermissionModel, include: [AppModuleModel] }],
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async updateRole(id: string, name: string) {
    const role = await this.rolesRepo.findByPk(id);
    if (!role) throw new NotFoundException('Role not found');
    role.name = name;
    await role.save();
    return this.findRoleById(id);
  }

  async deleteRole(id: string) {
    const role = await this.rolesRepo.findByPk(id);
    if (!role) throw new NotFoundException('Role not found');
    await role.destroy();
    return { success: true };
  }
}
