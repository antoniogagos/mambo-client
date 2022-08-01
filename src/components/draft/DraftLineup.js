import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import PlayerCard from './PlayerCard';
import * as Api from '../../firebase/api';
import { TourneyContext  } from '../../pages/TourneyPage';

function DraftLineup({ draft, loading, playersPoints, onClickDraftCard }) {
  const { playersInfo } = useContext(TourneyContext);
  if (loading || !draft) {
    return (
      <RowsWrapper>
        {[1, 4, 3, 3].map((rowPlayers, index) => {
          const rows = [];
          const positions = ['g', 'd', 'm', 'a'];
          const position = positions[index];
          {for (let y = 0; y < rowPlayers; y++) {
            rows.push(<PlayerCard key={y} loading={true}/>)
          }}
          return (<Row className={position} key={position}>{rows.map(r => r)}</Row>)
        })}
      </RowsWrapper>
    )
  }

  if (draft.type === 'noDraft') {
    return (
      <Error>You didn't participate on this matchday</Error>
    )
  }

  return (
    <RowsWrapper>
      {draft.formation.map((rowPlayers, index) => {
        const positions = ['g', 'd', 'm', 'a'];
        const position = positions[index];
        const rowCards = [];
        const formationNames = Api.getPlayerPosNames(draft.formation);
        for (let i = 0; i < rowPlayers; i++) {
          const totalIdx = draft.formation.slice(0, index + 1).reduce((curr, total) => curr + total);
          const currIdx = totalIdx - (rowPlayers - i);
          let player = draft.players[currIdx];
          if (!player) {
            player = formationNames[currIdx];
          } else {
            const playerPoints = playersPoints.find(p => p.playerId === player.pId);
            player = playersInfo[player.pId];
            if (Boolean(playerPoints)) {
              Object.assign(player, { points: playerPoints.points });
            }
          }
          rowCards.push(
            <PlayerCard
              onClickCard={_ => onClickDraftCard(currIdx, playersInfo)}
              key={player?.slug || currIdx}
              player={player}/>)
        }
        return (
          <Row key={position} className={position}>{rowCards.map(r => r)}</Row>
        )
      })}
    </RowsWrapper>
  )
}

const RowsWrapper = styled.div`
  height: 90%;
  padding-bottom: 60px;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-around;
  box-sizing: border-box;
  @media (min-width: ${props => props.theme.mediaQueryWidth}) {
    padding-bottom: 0;
    margin-bottom: -38px;
  }
`;

const Error = styled.h1`
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
  &.g {
    display: grid;
    align-items: flex-end;
  }
  &.d {
    margin-bottom: -42px;
  }
  &.a {
    margin-top: 0;
    grid-column-gap: 44px;
  }
  &.m {
    grid-column-gap: 44px;
  }
  display: grid;
  grid-auto-flow: column;
  grid-auto-rows: 100px;
  grid-auto-columns: 90px;
  &.d {
    grid-auto-columns: 85px;
  }
  grid-column-gap: 20px;
  justify-content: center;
  margin: 0 auto;
  align-items: center;
  @media (max-width: 466px) {
    grid-auto-columns: 78px;
    &.a {
      grid-column-gap: 34px;
    }
    &.m {
      grid-column-gap: 48px;
    }
    &.d {
      grid-column-gap: 25px;
      grid-auto-columns: 62px;
    }
  }
  @media (max-width: 436px) {
    grid-column-gap: 10px;
  }

  @media (max-width: 385px) {
    grid-auto-columns: 68px;
  }

  @media (max-width: 370px) {
    grid-auto-columns: 68px;
    &.a {
      grid-auto-column: 65px;
    }
    &.d {
      grid-auto-columns: 58px;
      grid-column-gap: 28px;
    }
  }

  @media (max-width: 345px) {
    &.d {
      grid-column-gap: 18px;
    }
  }

  @media (max-height: 1000px) {
    &.d {
      grid-column-gap: 0;
    }
    &.a {
      grid-column-gap: 24px;
    }
    &.m {
      grid-column-gap: 24px;
    }
  }
`;

export default DraftLineup;