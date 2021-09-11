import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}
function isPlainObject(obj) {
  let prototype;

  // eslint-disable-next-line no-sequences
  return Object.prototype.toString.call(obj) === '[object Object]' && ((prototype = Object.getPrototypeOf(obj)), prototype === null || prototype === Object.getPrototypeOf({}));
}

export default class AsyncRoute extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      Component: null,
      error: null,
      completed: false,
    };
  }
  componentDidMount() {
    const { route, ...props } = this.props;
    const { beforeEnter } = route;
    if (typeof beforeEnter !== 'function') {
      this.afterEnter(true);
      return;
    }
    const enter = beforeEnter({ ...props });
    if (!isPromise(enter)) {
      this.afterEnter(enter);
      return;
    }
    enter
      .then((next) => {
        this.afterEnter(next);
      })
      .catch((error) => {
        console.error(error);
        this.setState({ error });
      });
  }
  afterEnter(next) {
    const { route = {}, ...props } = this.props;
    if (next === null || next === undefined || next === true) {
      this.completed(route.component, route.render);
      return;
    }
    if (next === false) {
      this.completed(null);
      return;
    }
    if (typeof next === 'string') {
      this.completed(null, () => <Redirect to={next} from={props.location.pathname} />);
      return;
    }
    if (typeof next === 'function' || React.isValidElement(next)) {
      this.completed(null, () => next);
      return;
    }
    if (isPlainObject(next)) {
      const { redirect, ...nextProps } = next;
      if (redirect === true) {
        this.completed(null, () => <Redirect {...nextProps} {...{ from: props.location.pathname }} />);
        return;
      }
      this.completed(() => <Route {...nextProps} />);
      return;
    }
    this.completed(null);
  }
  completed(component, render) {
    if (!component && typeof render === 'function') {
      const renderComponent = render(this.getExtraProps());
      if (isPromise(renderComponent)) {
        this.asyncLoad(renderComponent);
        return;
      }
    }
    this.setState({ Component: component, completed: true, error: null });
  }
  asyncLoad(promise) {
    promise.then((target) => {
      const component = target.default || target;
      this.setState({ Component: component, completed: true, error: null });
    });
  }
  getExtraProps() {
    const { loading, beforeEnter, ...props } = this.props;
    return { ...props };
  }
  render() {
    const { loading: Loading } = this.props.route;
    const { Component, completed } = this.state;
    if (!completed) {
      if (typeof Loading === 'function') {
        return Loading(this.getExtraProps());
      }
      return Loading ? <Loading {...this.getExtraProps()} /> : null;
    }
    return Component ? <Component {...this.getExtraProps()} /> : null;
  }
}
