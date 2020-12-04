import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { paramsTree } from '@helper/route.helper';
import { get, isEmpty } from 'lodash';
import has = Reflect.has;

export interface INavRoute extends Route {
  type?: 'link';
  name?: any;
  title?: any;
  icon?: any;
  link?: string;
  nameFromRoot?: string;
  titleFromRoot?: string;
  children?: INavRoute[];
  hideMainNav?: boolean;
  hideSubNav?: boolean;
  hideTabs?: boolean;
  hideBreadcrumb?: any;
  titleBreadcrumb?: string;
  maps?: any;
  _loadedConfig?: {
    routes: INavRoute[];
  };
}

export type INavRoutes = Array<INavRoute>;

@Injectable({ providedIn: 'root' })
export class NavigationService {
  configs: INavRoute[] = [];

  constructor(private router: Router, private title: Title) {}

  register(routes: INavRoute[]) {
    this.configs = routes;
    const rootPaths = generateRootPath(this.router.config as INavRoute[]);
    assignRootPath(rootPaths, this.configs);
  }

  buildNav(route: ActivatedRoute) {
    const params = paramsTree(route.snapshot);
    const buildMenu = (configs: INavRoute[], parentPath = ''): INavRoute[] => {
      const results: INavRoute[] = [];
      const filters = configs.filter((item) => !item.hideMainNav);
      for (const config of filters) {
        let kids: INavRoute[] = [];
        const { name, title, icon, path, children = [] } = config;
        const cleanPath = buildPath([parentPath, path]);
        if (children.length) {
          kids = buildMenu(children, cleanPath);
        }

        const item: INavRoute = {
          name,
          icon,
          title: `nav.${title}`,
          path: cleanPath,
          link: assignParams(cleanPath, params),
          children: kids,
        };

        results.push(item);
      }

      return results;
    };

    return buildMenu(this.configs);
  }

  buildSideNavs(route: ActivatedRoute, menuOf = '') {
    const nav = this.buildNav(route);
    const menus = menuOf ? findMenu(menuOf, nav) : nav;

    const iterate = (data: INavRoute[]) => {
      const results = [];
      for (const menu of data) {
        let kids = [];
        if (menu.children) {
          kids = iterate(menu.children);
        }

        results.push({
          type: kids.length ? 'dropdown' : 'link',
          label: menu.title,
          route: menu.link,
          icon: menu.icon,
          children: kids,
        });
      }

      return results;
    };

    return iterate(menus.children || []);
  }

  buildTopNavs(route: ActivatedRoute) {
    const name = this.getRootName(route);
    const { children = [] } = this.buildNav(route).find((item) => item.name === name) || {};
    return children;
  }

  getRootName(route: ActivatedRoute) {
    const { routeConfig } = getLastChildRoute(route);
    if (routeConfig && has(routeConfig, 'name')) {
      const name = (routeConfig as INavRoute).name;
      const activeMenu: INavRoute = findMenu(name, this.configs);
      if (activeMenu && activeMenu.nameFromRoot) {
        const names = activeMenu.nameFromRoot.split('/').filter(Boolean);
        return names[0];
      }
    }

    return '';
  }

  reset() {
    this.configs = [];
  }
}

function getLastChildRoute(route: ActivatedRoute): ActivatedRoute {
  let lastChild = route;
  while (lastChild.firstChild !== null) {
    lastChild = lastChild.firstChild;
  }

  return lastChild;
}

function generateRootPath(routes: INavRoute[], path?: string) {
  let results = [];

  for (const route of routes) {
    if (route.redirectTo) {
      continue;
    }

    if (route.children && !isEmpty(route.children)) {
      const temp = generateRootPath(route.children, route.path);
      results = [...results, ...temp];
      continue;
    }

    results.push({
      path: buildPath([path, route.path]),
      title: route.title,
      name: route.name,
    });
  }

  return results;
}

function assignRootPath(rootPaths, routes: INavRoute[], currentRoute: INavRoute = {}) {
  for (const route of routes) {
    const findPath = rootPaths.find((item) => item.name === route.name);
    if (findPath) {
      Object.assign(route, { path: findPath.path });
    }

    const { nameFromRoot = '', titleFromRoot = '' } = currentRoute;
    Object.assign(route, {
      nameFromRoot: [nameFromRoot, route.name].join('/'),
      titleFromRoot: [titleFromRoot, route.title].join('/'),
    });
    if (route.children && !isEmpty(route.children)) {
      assignRootPath(rootPaths, route.children, route);
    }
  }
}

function buildPath(paths: any[]) {
  const path = paths
    .join('/')
    .split('/')
    .filter((x) => x)
    .join('/');

  return `/${path}`;
}

function assignParams(path: string, params: any) {
  const split = path.split('/');

  split.forEach((item, idx) => {
    if (item.startsWith(':')) {
      split[idx] = get(params, item.replace(':', ''), item);
    }
  });

  return split.join('/');
}

function findMenu(name, items) {
  for (const item of items) {
    if (item.name === name) {
      return item;
    } else if (item.children && Array.isArray(item.children)) {
      const found = findMenu(name, item.children);
      if (found) {
        return found;
      }
    }
  }

  return null;
}
