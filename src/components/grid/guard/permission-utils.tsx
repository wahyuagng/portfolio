// permissionUtils.ts
import type { ReactElement } from 'react';

import { isPermittedByPermissionGuard } from '@components/grid/helpers';
import { PermissionBasedGuard } from '@components/grid/guard/permission-based-guard';

export const canRenderAction = (
  element: ReactElement<any>,
  permissions: string[],
  checkConditions: boolean
): boolean => {
  if (!element) return false;
  if (!checkConditions) return false;

  if (element.type === PermissionBasedGuard) {
    const alloweds = element.props.alloweds as string[];
    const isAllowed = alloweds.some((perm) => permissions.includes(perm));
    if (!isAllowed) return false;
  }

  if (!isPermittedByPermissionGuard(element, permissions)) {
    return false;
  }

  return true;
};
