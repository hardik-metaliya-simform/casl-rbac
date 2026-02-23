import { subject } from '@casl/ability';
import { AppAbility } from '../rbac/casl-ability.factory';

export function redactFieldsByAbility(
  obj: any,
  ability: AppAbility,
  resource: string,
): any {
  if (Array.isArray(obj)) {
    return obj.map((item) => redactFieldsByAbility(item, ability, resource));
  }

  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {};

    for (const key of Object.keys(obj)) {
      const value = obj[key];

      // 🔥 Always check only by key against same resource
      const canRead = ability.can('read', subject(resource, obj), key);

      if (!canRead) {
        result[key] = '<Redacted>';
        continue;
      }

      // Just recurse normally (no resource switching)
      if (Array.isArray(value)) {
        result[key] = value.map((item) =>
          redactFieldsByAbility(item, ability, resource),
        );
      } else if (value && typeof value === 'object') {
        result[key] = redactFieldsByAbility(value, ability, resource);
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  return obj;
}
