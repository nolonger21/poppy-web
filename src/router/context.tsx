import React from 'react';
import renderRoutes from './renderRoutes';
import { Router, RouterInstance } from './router';

const defaultRouter = new Router({ routes: [] });
const RouterContext = React.createContext<RouterInstance>(defaultRouter);
RouterContext.displayName = 'RouterContext';

export const RouterProvider = RouterContext.Provider;
export const RouterConsumer = RouterContext.Consumer;

export const RouterView = (props: any) => {
  return <RouterConsumer>{(router) => renderRoutes(router, props)}</RouterConsumer>;
};
