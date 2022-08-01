import React from 'react';
import Phone from '../components/Phone';
import LoadingApp from '../components/LoadingApp';
import { Route, Switch } from 'react-router-dom';

const HomePage = React.lazy(() => import('../pages/HomePage'));
const AccessPage = React.lazy(() => import('../pages/AccessPage'));
const JoinTourneyPage = React.lazy(() => import('../pages/JoinTourneyPage'));
const PrivateRoute = React.lazy(() => import('../components/PrivateRoute'));

const RouteMiddleware = () => {
  return (
    <Phone>
      <React.Suspense fallback={<LoadingApp landing={true}/>}>
      <Switch>
        <PrivateRoute path="/tournaments">
          <HomePage />
        </PrivateRoute>
        <Route path={["/signin", "/signup"]}>
          <AccessPage />
        </Route>
        <Route path="/invite/:tourneyId">
          <JoinTourneyPage />
        </Route>
      </Switch>
      </React.Suspense>
    </Phone>
  )
}

export default RouteMiddleware;