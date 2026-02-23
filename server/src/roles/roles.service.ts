import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RoleModel } from '../sequelize/models/role.model';
import { PermissionModel } from '../sequelize/models/permission.model';
import { AppModuleModel } from '../sequelize/models/app.module.model';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(RoleModel) private rolesRepo: typeof RoleModel,
    @InjectModel(PermissionModel) private permsRepo: typeof PermissionModel,
    @InjectModel(AppModuleModel) private modulesRepo: typeof AppModuleModel,
  ) {}

  listRoles() {
    return this.rolesRepo.findAll({
      include: [{ model: PermissionModel, include: [AppModuleModel] }],
    });
  }

  async findRoleById(id: string) {
    const role = await this.rolesRepo.findByPk(id, {
      include: [{ model: PermissionModel, include: [AppModuleModel] }],
    });
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async createRole(name: string, permissionIds: string[] = []) {
    const role = await this.rolesRepo.create({ name });
    if (permissionIds.length > 0) {
      const perms = await this.permsRepo.findAll({
        where: { id: permissionIds },
      });
      await role.$set('permissions', perms);
    }
    return this.findRoleById(role.id);
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

  async setRolePermissions(roleId: string, permissionIds: string[]) {
    const role = await this.rolesRepo.findByPk(roleId);
    if (!role) throw new NotFoundException('Role not found');
    const perms = await this.permsRepo.findAll({
      where: { id: permissionIds },
    });
    await role.$set('permissions', perms);
    return this.findRoleById(roleId);
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
}
