import React from 'react';
import styled, { keyframes } from 'styled-components';

function MatchesList({ matches, matchday }) {
  return (
    <Wrapper>
      <FixtureText>Fixture matches</FixtureText>
      {matches.map(match => {
        let { matchId, teams, score, liveMinute, status } = match;
        const options = {
          hour: "2-digit",
          minute: '2-digit',
          weekday: "short"
        };
        const matchDate = new Intl.DateTimeFormat('en-GB', options).format(match.startDate);
        return (
          <Match key={matchId}>
            <Team className="home">
              <img
                alt={teams.name}
                src={`${process.env.PUBLIC_URL}/teams/${teams[0].slug}_24x24.png`}/>
              <Name>{teams[0].name}</Name>
            </Team>
            <MatchStatus>
              {score ? (
                <Score>
                  <span className={score.home > score.away ? 'winner' : ''}>{score.home}</span>
                  <span className={score.away > score.home ? 'winner' : ''}>{score.away}</span>
                </Score>
              ) : (
                <MatchDate>
                {match.status === 'finished' && <FinishedDate>FT<br/></FinishedDate>}
                {match.status === 'interrupted' && <FinishedDate className="interrupted">Suspended<br/></FinishedDate>}
                {matchDate}
                </MatchDate>
              )}
            </MatchStatus>
            <Team className="away">
              <Name>{teams[1].name}</Name>
              <img
                alt={teams.name}
                src={`${process.env.PUBLIC_URL}/teams/${teams[1].slug}_24x24.png`}/>
            </Team>
          </Match>
        )
      })}
    </Wrapper>
  )
}

const FixtureText = styled.div`
  text-shadow: 2px 2px rgb(0 0 0 / 0.10);
  font-weight: bold;
  color: #ffffffc2;
  margin: 0 0 10px 0;
`;

const blink = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Dot = styled.div`
  width: 4px;
  height: 4px;
  margin: 0 5px;
  background: #FF9800;
  animation: 1s ${blink} infinite alternate;
  border-radius: 100%;
`;

const Name = styled.span`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 98%;
`;

const Match = styled.div`
  border-radius: 6px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr max-content 1fr;
  font-size: 14px;
  height: 48px;
  justify-content: space-between;
  align-items: center;
`;

const FinishedDate = styled.div`
  font-weight: bold;
  color: #f7f7fa;
  &.interrupted {
    color: #F44336;
  }
`;

const LiveMinute = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 30px;
  color: #FF9800;
`;

const Wrapper = styled.div`
  color: #ffffffe0;
  padding-top: 10px;
  margin: 15px 30px;
  border-radius: 8px;
`;

const MatchDate = styled.div`
  align-items: center;
  color: #ffffff8c;
  display: grid;
  font-size: 13px;
  grid-auto-flow: row;
  grid-template-rows: max-content max-content;
  text-align: center;
  width: 60px;
  margin: auto 0;
`;

const MatchStatus = styled.div`
  padding: 0 25px;
`;

const Score = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin-left: 26px;
  padding-right: 10px;
  height: 68px;
  box-sizing: border-box;
  color: #b7b7b7;
  .winner {
    font-weight: bold;
    position: relative;
    color: #f7f7fa;
  }
  .winner::after {
    content: '<';
    position: absolute;
    right: -8px;
    font-size: 6px;
    -webkit-text-stroke: 2.5px;
    top: 4px;
  }
`;

const Team = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;
  &.away {
    text-align: right;
  }
  &.home img {
   margin-right: 8px; 
  }
  &.away img {
    margin-left: 8px;
  }
`;

export default MatchesList;