import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../firebase/auth';
import { useRouteMatch } from 'react-router-dom';
import { AnimatedRoutes, RouteTransition } from '../transitions/RouteTransition';
import TourneyList from '../components/tourney/TourneyList';
import TourneyPage from './TourneyPage';
import CreateTourney from '../components/CreateTourney';
import * as Api from '../firebase/api';
import '../css/App.css';

function HomePage() {
  const { user } = useContext(AuthContext);
  const { path } = useRouteMatch();
  const [playersInfo, setPlayersInfo] = useState(null);
  const tourneys = useFetchUserTourneys({ uid: user.uid });

  useEffect(() => {
    import('../statics/players.json').then((players) => {
      setPlayersInfo(players.default)
    })
  }, []);

  return (
    <AnimatedRoutes exitBeforeEnter initial={false}>
      <RouteTransition exact path="/tournaments" slide={15}>
        <TourneyList tourneys={tourneys}/>
      </RouteTransition>
      <RouteTransition path={`${path}/create`} slide={15}>
        <CreateTourney />
      </RouteTransition>
      <RouteTransition path={`${path}/:tourneyId`} slide={15}>
        <TourneyPage playersInfo={playersInfo} tourneys={tourneys}/>
      </RouteTransition>
    </AnimatedRoutes>
  );
}

function useFetchUserTourneys({ uid }) {
  const [tourneys, setTourneys] = useState([]);
  const [observers, setObservers] = useState([]);
  const [removedTourneys, setRemovedTourneys] = useState([]);
  useEffect(_ => {
    if (uid) {
      var observer = Api.getUserTourneys({ uid, cb: onUserTourneyChanges });
      return _ => {
        observer();
        for (let tObs of observers) tObs();
      };
    }
  }, []);

  useEffect(_ => {
    setTourneys(tourneys.filter(t => !removedTourneys.includes(t.tourneyId)));
  }, [removedTourneys]);

  const onUserTourneyChanges = ({ type, tourney }) => {
    if (type === 'removed') {
      setRemovedTourneys((prevState => [...prevState, tourney.tourneyId]));
    }
    if (type === 'added') {
      const observer = Api.getTourney({
        tourneyId: tourney.tourneyId,
        cb: onTourneyChange,
        uid,
      });
      setObservers(observer);
    }
  }

  const onTourneyChange = (tourney) => {
    setTourneys((prevState) => {
      const tourneyAddedIdx = prevState.indexOf(prevState.find(t => t.tourneyId === tourney.tourneyId));
      if (tourneyAddedIdx > 1) {
        prevState[tourneyAddedIdx] = tourney;
        return prevState;
      } else {
        return [...prevState, tourney];
      }
    });
  };

  return tourneys;
}

export default HomePage;