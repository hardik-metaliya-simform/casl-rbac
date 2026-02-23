import { SetMetadata } from '@nestjs/common';

export const CHECK_PERMISSION = 'check_permission';
export const CheckPermission = (moduleName: string, action: string) =>
  SetMetadata(CHECK_PERMISSION, { moduleName, action });
