import { RouterProvider } from './context';
import { Router, RouterInstance, Dictionary } from './router';
import AsyncRoute from './AsyncRoute';
import { Route, Switch } from 'react-router-dom';
import { parseQuery, stringifyQuery, getFullPath } from './utils'


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
              const { hooks } = router
          
              let nextEntry = false
              let nextParams = null
              const next = (_nextParams: unknown) => {
                nextEntry = true
                nextParams = _nextParams
              }
              
              let queryStr = window.location.href.split('?').pop()
              queryStr = queryStr?.search('=') !== -1 ? queryStr : ''
              const to = {
                path: route.path || '/',
                hash: window.location.hash,
                query: parseQuery(queryStr) as Dictionary<string>,
                params: {},
                fullPath: getFullPath(window.location, stringifyQuery),
                matched: [],
                redirectedFrom: '',
                meta: route.meta || {}
              }

              const from = {
                path: route.path || '/',
                hash: window.location.hash,
                query: parseQuery(queryStr) as Dictionary<string>,
                params: {},
                fullPath: getFullPath(window.location, stringifyQuery),
                matched: [],
                redirectedFrom: '',
                meta: route.meta || {}
              }
              
              // if (window.location.pathname !== route.path) {
                for(let i = 0; i < hooks.beforeEach.length; i++) {
                  const beforeEach = hooks.beforeEach[i]
                  if (typeof beforeEach === 'function') {
                    beforeEach(to, from, next)
                  }
                }
              // } else {
              //   nextEntry = true
              // }

              if (!nextEntry || nextParams === false) return null
   
              const onRenderCompelete = () => {
                for(let i = 0; i < hooks.afterEach.length; i++) {
                  const afterEach = hooks.afterEach[i]
                  if (typeof afterEach === 'function') {
                    afterEach(to, from)
                  }
                }
              }
              
              return (
                <RouterProvider value={nextRouter}>
                  <AsyncRoute route={route} router={nextRouter} {...locationProps} onRenderCompelete={onRenderCompelete}  />
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
