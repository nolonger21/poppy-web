import { RouterProvider } from './context';
import { Router, RouterInstance } from './router';
import AsyncRoute from './AsyncRoute';
import { Route, Switch } from 'react-router-dom';

const renderRoutes = (router: RouterInstance, switchProps = {}) => {
  const { routes } = router;
  return routes && routes.length > 0 ? (
    <Switch {...switchProps}>
      {routes.map((route, i) => {
        const { component, render, children, ...restProps } = route;
        return (
          <Route
            {...restProps}
            key={route.key || i}
            render={(locationProps) => {
              let nextRouter = router;
              if (route.routes) {
                nextRouter = new Router({ routes: route.routes });
                nextRouter.hooks = router.hooks;
              }
              return (
                <RouterProvider value={nextRouter}>
                  <AsyncRoute route={route} {...locationProps} />
                </RouterProvider>
              );
            }}
          />
        );
      })}
    </Switch>
  ) : null;
};

export default renderRoutes;
