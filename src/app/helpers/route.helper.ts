import { ActivatedRouteSnapshot } from '@angular/router';
import compact from 'lodash/compact';

export function paramsTree(active: ActivatedRouteSnapshot, fromParams: any = {}) {
  const params: any = {};

  if (active.params) {
    Object.assign(params, active.params, fromParams);
  }

  if (active.parent) {
    return paramsTree(active.parent, params);
  }

  return params;
}

export function currentFeature(url?: string) {
  const path = url || window.location.pathname;
  const params = compact(path.split('/'));

  if (params.length > 2) {
    return params[2]; // Return current service from url path
  }
  return null;
}

export function assignResolveData(data) {
  for (const [key, value] of Object.entries(data)) {
    this[key] = value;
  }
}
