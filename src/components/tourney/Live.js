import React, { useEffect, useContext, useState } from 'react';
import styled from 'styled-components';
import Field from './Field';
import DraftLineup from '../draft/DraftLineup';
import { TourneyContext } from '../../pages/TourneyPage';
import { AuthContext } from '../../firebase/auth';
import MatchesList from '../MatchesList';
import MatchdaySelector from './MatchdaySelector';
import { ReactComponent as PointsIcon } from '../../images/statistics.svg';
import { ReactComponent as RightArrowIcon } from '../../images/right-chevron.svg';
import { ReactComponent as ClockIcon } from '../../images/clock.svg';
import * as Api from '../../firebase/api';

function Live({ visible, overlay }) {
  const { user } = useContext(AuthContext);
  const { tourney, setSelectedMatchday, selectedMatchday } = useContext(TourneyContext);
  const { setShowOverlay, setOverlayProps } = overlay;
  const [draft, loading] = useDraft({ tourney, selectedMatchday, uid: user.uid, overlay });
  const [playersPoints, setPlayersPoints] = useState([]);
  const [fixture, setFixture] = useState([]);
  const [totalPoints, setTotalPoints] = useState(null);

  const onClickDraftCard = (playerIdx, playersInfo) => {
    const player = draft.players[playerIdx];
    if (player) {
      const options = {
        close: _ => setShowOverlay(false),
        player: Object.assign(playersInfo[player.pId], { matchId: player.mId }),
        name: 'player'
      }
      setOverlayProps(options);
    } else {
      const options = {
        close: _ => setShowOverlay(false),
        selectPlayer: (player) => {
          draft.players[playerIdx] = player;
          Api.selectDraftPlayer({ uid: user.uid, tourney, player, playerIdx });
        },
        playersInfo,
        matchday: selectedMatchday,
        competitionId: tourney.competitions[0],
        selectedPlayerIdx: playerIdx,
        name: 'candidates'
      }
      if (!draft.candidates) {
        Object.assign(options, { loadingCandidates: true });
      } else {
        Object.assign(options, { candidates: draft.candidates, loadingCandidates: false });
      }
      setOverlayProps(options);
    }
    setShowOverlay(true);
  };

  useEffect(_ => {
    const { currentMatchday, currentFixtureStatus } = tourney;
    if (!(draft && draft.players)) return;
    if (selectedMatchday < currentMatchday) {
      Api.getPlayersPoints({ playersIds: draft.players }).then(pPoints => {
        setPlayersPoints(pPoints);
      });
    } else if (currentFixtureStatus === 'inprogress') {
      var listeners = Api.listenToPlayersPoints({
        playersIds: draft.players,
        cb: ({ points, playerId }) => {
          setPlayersPoints(prevState => {
            const found = prevState.find(f => f.playerId === playerId);
            if (found) {
              Object.assign(found, { points });
              return [...prevState];
            } else {
              return [...prevState, { playerId, points }];
            }
          })
        }
      });
    }
    return _ => {
      if (listeners) {
        listeners.forEach(listener => listener());
      }
    }
  }, [draft, tourney]);

  useEffect(_ => {
    if (!playersPoints.length) return;
    const points = playersPoints.map(({points}) => points);
    setTotalPoints(points.reduce((curr, total) => curr + total));
  }, [playersPoints]);

  useEffect(_ => {
    if (!selectedMatchday) return;
    Api.getFixtureMatches({ competitionId: tourney.competitions[0], matchday: selectedMatchday })
      .then(fixture => {
        setFixture(fixture);    
      });
  }, [selectedMatchday]);

  const fixtureStatuses = {
    'notstarted': 'Not started',
    'inprogress': 'In progress',
    'finished': 'Finished'
  }

  return (
    <Wrapper>
      <Hero>
        {totalPoints ? <Points><PointsIconStyled alt="points"/>{totalPoints}</Points>
          : <div style={{fontWeight: 'bold', marginTop: '20px'}}>{fixtureStatuses[tourney.currentFixtureStatus]}</div>}
        <MatchdaySelector selectedMatchday={selectedMatchday} changeMatchday={matchday => setSelectedMatchday(matchday)}/>
      </Hero>
      <Content>
        <DraftLineup
            draft={draft}
            loading={loading}
            playersPoints={playersPoints}
            onClickDraftCard={onClickDraftCard}/>
        <Field/>
      </Content>
      {/* <MatchesList matches={fixture} matchday={selectedMatchday}/> */}
    </Wrapper>
  )
}

function useDraft({ tourney, selectedMatchday, uid, overlay }) {
  const { setOverlayProps } = overlay;
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = { tourney, selectedMatchday, uid };
  if (tourney.currentFixtureStatus === 'inprogress') {
    Object.assign(params, { onlyDraft: true });
  }
  useEffect(_ => {
    if (!selectedMatchday || selectedMatchday === 0) return;
    getPlayerDraft();
    setLoading(false);
  }, [selectedMatchday]);

  const getPlayerDraft = async () => {
    const draft = await Api.getPlayerDraft(params);
    setDraft(draft);
    if (draft.type === 'generateDraft') {
      const draftGenerated = await Api.initDraft({ tourney, competitionId: tourney.competitions[0] });
      setDraft(prevState => Object.assign(prevState, draftGenerated.data));
      setOverlayProps(prevState => {
        return Object.assign({}, prevState, {
          candidates: draftGenerated.data.candidates }, { loadingCandidates: false });
      });
    }
  }

  return [draft, loading];
}

const Wrapper = styled.div`
  position: relative;
  overflow: hidden;
  height: 100%;
`;

const Content = styled.div`
  height: calc(100vh - 120px);
  position: relative;
  perspective: 200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  z-index: 4;
  @media (max-height: 750px) {
    height: calc(100vh - 114px);
  }
  @media (max-height: 718px) {
    height: calc(100vh - 114px);
  }
  @media (max-height: 685px) {
    height: calc(100vh - 108px);
  }
  @media (max-height: 640px) {
    height: calc(100vh - 103px);
  }
  @media (min-width: ${props => props.theme.mediaQueryWidth}) {
    padding-bottom: 68px;
    height: calc(100% - 116px);
    @media (max-height: 1000px) {
      padding-bottom: 100px;
    }
  }
`;

const PointsIconStyled = styled(PointsIcon)`
  fill: ${props => props.theme.primaryColor};
  width: 15px;
  height: 15px;
  margin-bottom: 22px;
  margin-right: 5px;
`;

const Hero = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  margin: 0 40px;
  z-index: 40;
  color: ${props => props.theme.primaryColor};
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;
  position: absolute;
  max-width: 275px;
  margin: 0 auto;
  left: 0;
  right: 0;
  @media (max-width: ${props => props.theme.mediaQueryWidth}) {
    width: 66%;
    margin: 0 auto;
    padding: 0;
    left: 0;
    right: 0;
  }
`;

const Points = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  font-size: 54px;
  align-items: flex-end;
  font-weight: bold;
`;

const MathdayStatus = styled.div``;

const Matchday = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  & .matchday-number {
    padding-left: 4px;
    padding-right: 12px;
  }
`;

export default Live;