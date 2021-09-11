import { RouteProps, RouteComponentProps } from 'react-router-dom';

export interface RouterOptions {
  routes: RouteConfig[];
}

export interface RouteConfig extends RouteProps {
  key?: string;
  loading?: (props: RouteComponentProps & { route: RouteConfig }) => React.ReactNode;
  beforeEnter?: (props: RouteComponentProps & { route: RouteConfig }) => boolean | string | React.ReactNode;
  component?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any> | undefined;
  render?: ((props: RouteComponentProps<any>) => React.ReactNode) | undefined;
  meta?: any;
  routes?: RouteConfig[];
}

export interface RouterHooks {
  beforeEach: NavigationGuard[];
  afterEach: NavigationAfterGuard[];
}
export interface RouterInstance {
  routes: RouteConfig[];
  hooks: RouterHooks;
  beforeEach(guard: NavigationGuard): void;
  afterEach(hook: NavigationAfterGuard): void;
}

type Dictionary<T> = { [key: string]: T };

export interface Route {
  path: string;
  name?: string;
  hash: string;
  query: Dictionary<string>;
  params: Dictionary<string>;
  fullPath: string;
  meta?: any;
}

export type NavigationGuard = (to: Route, from: Route, next: () => void) => any;

export type NavigationAfterGuard = (to: Route, from: Route) => any;

export class Router implements RouterInstance {
  constructor(options: RouterOptions) {
    this.routes = options.routes;
  }
  routes: RouteConfig[] = [];
  hooks: RouterHooks = {
    beforeEach: [],
    afterEach: [],
  };

  beforeEach(guard: NavigationGuard) {
    this.hooks.beforeEach.push(guard);
  }
  afterEach(hook: NavigationAfterGuard) {
    this.hooks.afterEach.push(hook);
  }
}
