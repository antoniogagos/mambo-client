import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useRouteMatch, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Overlay from '../components/Overlay';
import TourneyHeader from '../components/tourney/TourneyHeader';
import TourneyNavigation from '../components/tourney/TourneyNavigation';
import Ranking from '../components/tourney/Ranking';
import Live from '../components/tourney/Live';
import Settings from '../components/tourney/Settings';
import SwipeableViews from 'react-swipeable-views';
import ShareTourneyModal from '../components/ShareTourneyModal';
import DraftCandidatesOverlay from '../components/draft/DraftCandidatesOverlay';
import PlayerOverlay from '../components/draft/PlayerOverlay';
import LightPattern from '../images/light-pattern.png';

export const TourneyContext = React.createContext();

const TABS_INDEX = { 'ranking': 0, 'live': 1, 'settings': 2 };

function TourneyPage({ playersInfo, tourneys }) {
  const { url } = useRouteMatch();
  const { pathname, state } = useLocation();
  const { tourneyId } = useParams();
  const history = useHistory();
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(1);
  const [tourney, setTourney] = useState(null);
  const [selectedMatchday, setSelectedMatchday] = useState(null);

  // Tourney overlay states: 
  const [showModal, setShowModal] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayProps, setOverlayProps] = useState(null);

  useEffect(_ => {
    const view = state?.view || pathname.split('/')[pathname.split('/').length-1];
    setSelectedRouteIdx(TABS_INDEX[view]);
  }, [state]);

  function handleChangeIndex(idx) {
    const key = Object.keys(TABS_INDEX).find(key => TABS_INDEX[key] === idx);
    setSelectedRouteIdx(idx);
    history.push(`${url}/${key}`);
  }

  useEffect(_ => {
    if (!tourney) return;
    setSelectedMatchday(tourney.currentMatchday);
  }, [tourney]);

  useEffect(_ => {
    if (!tourneyId && !tourneys) return;
    const tourney = tourneys.find(t => t.tourneyId === tourneyId);
    setTourney(tourney);
  }, [tourneyId, tourneys]);

  const overlayComponents = {
    candidates: DraftCandidatesOverlay,
    player: PlayerOverlay
  }
  if (showOverlay) {
    var OverlayComponent = overlayComponents[overlayProps.name];
  }
  
  return (
    <Wrapper selectedRouteIdx={selectedRouteIdx} modalActive={showModal}>
      <TourneyHeader modalActive={showModal} setShowModal={setShowModal} title={tourney?.name}/>
      {tourney && (
      <TourneyContext.Provider value={{tourney, playersInfo, setSelectedMatchday, selectedMatchday}}>
        {showModal && <Overlay><ShareTourneyModal setShowModal={setShowModal}/></Overlay>}
        {showOverlay && (
          <Overlay>
            <OverlayComponent {...overlayProps}/>
          </Overlay>
        )}
        <SwipeableViewsStyled
            resistance={true}
            index={selectedRouteIdx}
            onChangeIndex={handleChangeIndex}
            enableMouseEvents>
          <Ranking visible={selectedRouteIdx === 0} redirecToLive={_ => handleChangeIndex(2)}/>
          <Live visible={selectedRouteIdx === 1} overlay={{setOverlayProps, setShowOverlay}}/>
          <Settings setShowModal={setShowModal} visible={selectedRouteIdx === 2}/>
        </SwipeableViewsStyled>
      </TourneyContext.Provider>)}
      <TourneyNavigation/>
    </Wrapper>
  )
}

const SwipeableViewsStyled = styled(SwipeableViews)`
  .react-swipeable-view-container {
    height: 100%;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: inset 0px 4px 2px 0px rgb(0 0 0 / 4%);
  height: 100vh;
  display: grid;
  grid-template-rows: max-content 1fr max-content;
  &.lightTheme {
    background-image: url(${LightPattern});
  }
  &.darkTheme {
    background-image: none;
    background-color: ${props => props.theme.main};
  }
  // height: ${props => props.modalActive || props.selectedRouteIdx === 2 ? '100vh' : 'auto'};
  @media (min-width: ${props => props.theme.mediaQueryWidth}) {
    height: 100%;
    min-height: unset;
    display: grid;
    grid-template-rows: max-content 1fr max-content;
    box-shadow: none;
    background-color: ${props => props.theme.main};
  }
`;

export default TourneyPage;