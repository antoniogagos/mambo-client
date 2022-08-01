import { AnimatePresence } from 'framer-motion'
import { Route, Switch, useLocation } from 'react-router-dom'
import { MountTransition } from './MountTransition'
import React from 'react';

export const RouteTransition = ({
  children,
  exact = false,
  path,
  slide = 0,
  slideUp = 0,
  ...rest
}) => (
  <Route exact={exact} {...rest}>
    <MountTransition slide={slide} slideUp={slideUp}>
      {children}
    </MountTransition>
  </Route>
)


export const AnimatedRoutes = ({
  children,
  exitBeforeEnter = false,
  initial = false,
}) => {
  const location = useLocation();
  const tourneyRoutes = ['settings', 'ranking', 'live'];
  const splitted = location.pathname.split('/');
  return (
    <AnimatePresence exitBeforeEnter={exitBeforeEnter} initial={initial}>
      <Switch location={location} key={tourneyRoutes.includes(splitted[splitted.length-1]) ? '/tournaments/tourneyId' : location.pathname}>
        {children}
      </Switch>
    </AnimatePresence>
  )
}
