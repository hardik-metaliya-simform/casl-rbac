export const getLocalAbilities = (): Record<string, string[]> => {
  const raw = localStorage.getItem("abilities");
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const getModulePermissions = (moduleName: string): string[] => {
  const abilities = getLocalAbilities();
  return (abilities[moduleName] || []) as string[];
};

export const can = (action: string, moduleName: string): boolean => {
  const perms = getModulePermissions(moduleName);
  return perms.includes(action);
};

export default { getLocalAbilities, getModulePermissions, can };
