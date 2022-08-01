import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import Field from './Field';
import PlayerCard from '../draft/PlayerCard';
import * as Api from '../../firebase/api';
import { AuthContext } from '../../firebase/auth';
import { TourneyContext, OverlayContext } from '../../pages/TourneyPage';

function Lineup({ setTotalPoints }) {
  const { user } = useContext(AuthContext);
  const { tourney, playersInfo } = useContext(TourneyContext);
  const [draftError, setDraftError] = useState(false);
  const [draft, setDraft, loading] = useDraft({ tourney, uid: user.uid });
  const {
    setShowOverlay,
    setOverlayProps
  } = useContext(OverlayContext);

  useEffect(_ => {
    if (!draft) return;
    if (tourney.currentFixtureStatus === 'inprogress' && draft.selected) {
      Api.listenPlayersPoints({
        playersIds: draft.selected,
        cb: ({ points, playerId }) => {
          setDraft(prevState => {
            if (!prevState) return;
            const found = prevState.selected.find(f => f.playerId === playerId)
            found.points = points;
            return Object.assign({}, prevState);
          })
        }
      });
    }
  }, [draft, tourney.currentFixtureStatus]);

  useEffect(_ => {
    if (!draft || !draft.selected || tourney.currentFixtureStatus !== 'inprogress') return;
    let totalPoints = 0;
    draft.selected.forEach(p => {
      if (p.points) totalPoints += p.points;
    })
    setTotalPoints(totalPoints);
  }, [draft])

  return (
    <LineupWrapper>
      <Field/>
    </LineupWrapper>
  );
}

function useDraft({ tourney, uid }) {
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = { tourney, uid };
  if (tourney.currentFixtureStatus === 'inprogress') {
    Object.assign(params, { withDraft: true });
  }
  
  useEffect(_ => {
    Api.getPlayerDraft(params)
    .then((draft) => {
      setDraft(draft);
      setLoading(false);
    });
  }, [tourney.tourneyId, tourney.matchday, uid]);
  return [draft, setDraft, loading];
}

const LineupWrapper = styled.div`
  height: 100%;
  position: relative;
  perspective: 200px;
  background: #232323;
  display: flex;
  flex-direction: column;
`;

const RowsWrapper = styled.div`
  height: 86%;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-around;
  box-sizing: border-box;
  margin-top: auto;
  margin-bottom: 10px;
`;

const DraftError = styled.h1`
  position: absolute;
  color: #fbdd57;
  top: 0;
  bottom: 0;
  margin: auto;
  text-align: center;
  display: flex;
  align-items: flex-start;
  font-size: 1.5em;
  width: 100%;
  justify-content: center;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  padding: 0 10px;
  margin: 15px 0;
  box-sizing: border-box;
  &.gk {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }
  &.defenders {
    margin-bottom: -30px;
  }
  &.attackers {
    margin-top: 0;
  }
`;

const Button = styled.button`
  position: absolute;
  top: 0;
  z-index: 10;
`;

export default Lineup;