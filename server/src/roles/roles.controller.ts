import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PoliciesGuard } from '../rbac/guards/policies.guard';
import { CheckPermission } from '../rbac/decorators/check-permission.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CreateRoleDto } from 'src/users/dto/create-role.dto';
import { SetRolePermissionsDto } from 'src/users/dto/set-role-perms.dto';
import { RolesService } from './roles.service';

@Controller('roles')
@UseGuards(AuthGuard('jwt'), PoliciesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // modules & permissions
  @Get('modules')
  listModules() {
    return this.rolesService.listModules();
  }

  @Post('modules')
  createModule(@Body() body: { name: string }) {
    return this.rolesService.createModule(body.name);
  }

  @Get('permissions')
  listPermissions() {
    return this.rolesService.listPermissions();
  }

  @Post('permissions')
  createPermission(@Body() body: { moduleId: string; action: string }) {
    return this.rolesService.createPermission(body.moduleId, body.action);
  }

  @Get()
  @CheckPermission('roles', 'read')
  listRoles() {
    return this.rolesService.listRoles();
  }

  @Get(':id')
  @CheckPermission('roles', 'read')
  getRoleById(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.findRoleById(id);
  }

  @Post()
  @CheckPermission('roles', 'create')
  createRole(@Body() body: CreateRoleDto) {
    console.log(body);
    return this.rolesService.createRole(body.name, body.permissionIds || []);
  }

  @Put(':id')
  @CheckPermission('roles', 'update')
  updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreateRoleDto,
  ) {
    return this.rolesService.updateRole(id, body.name);
  }

  @Delete(':id')
  @CheckPermission('roles', 'delete')
  deleteRole(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.deleteRole(id);
  }

  @Put(':id/permissions')
  @CheckPermission('roles', 'update')
  setRolePermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: SetRolePermissionsDto,
  ) {
    return this.rolesService.setRolePermissions(id, body.permissionIds || []);
  }
}
