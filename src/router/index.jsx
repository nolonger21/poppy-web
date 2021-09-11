/* eslint-disable no-unused-vars */
import { Router, RouteConfig } from './router';
import Login from 'src/pages/Login';
import Layout from 'src/layouts/Layout';

import Home from 'src/pages/Home';

const routes = [
  {
    path: '/login',
    render: () => import('src/pages/Login'),
    // component: Login,
    loading: () => <div style={{ padding: '25%', textAlign: 'center' }}>loading</div>,
    beforeEnter(props) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
    },
  },
  {
    path: '/',
    // render: () => import(/* webpackChunkName: "Layout" */'src/layouts/Layout'),
    component: Layout,
    loading: () => <div style={{ padding: '25%', textAlign: 'center' }}>loading</div>,
    beforeEnter(props) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
    },
    routes: [
      {
        path: '/admin/sub-page1',
        render: () => import('src/pages/Home'),
        // component: Home,
        loading: () => <div style={{ padding: '25%', textAlign: 'center' }}>loading</div>,
      },
    ],
  },
];

const router = new Router({ routes });

router.beforeEach((to, from, next) => {
  console.log('beforeEach', to, from, next);
});

router.afterEach((to, from) => {
  console.log('after', to, from);
});

export default router;
