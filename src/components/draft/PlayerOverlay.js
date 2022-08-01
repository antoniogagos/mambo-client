import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import * as Api from '../../firebase/api';
import { ReactComponent as CloseIcon } from '../../images/close-bold.svg';
import { ReactComponent as PointsShapeIcon } from '../../images/points-shape.svg';

const pointsMap = {
  "onTargetScoringAttempt": 3,
  "goals": 7,
  "wasFouled": 1, // cada 2
  "fouls": -1, // cada 2
  "interceptionWon": 1,
  "hitWoodwork": 2,
  "totalTackle": 1,
  "accurateCross": 1,
  "keyPass": 1,
  "goalAssist": 4,
  "blockedScoringAttempt": 2,
  "errorLeadToAGoal": -4,
  "goalsAgainst": -2,
  "saves": 2,
  "won": 4,
  "draw": 1,
  "lose": -2,
  "cleanSheet": 7
}

const statsMap = {
  "onTargetScoringAttempt": "Shots on target",
  "goals": 'Goal',
  "wasFouled": 'Fouled', // cada 2
  "fouls": "Fouls", // cada 2
  "interceptionWon": "Interceptions",
  "hitWoodwork": "Hit woodwork",
  "totalTackle": "Total tackles",
  "accurateCross": "Accurate cross",
  "keyPass": "Key passes",
  "goalAssist": "Assist",
  "blockedScoringAttempt": "Blocked shot",
  "errorLeadToAGoal": "Error leading to a goal",
  "goalsAgainst": "Goals against",
  "saves": "Save",
  "won": "Won match",
  "draw": "Draw match",
  "lose": "Lose match",
  "cleanSheet": "Clean sheet"
}

function DraftCandidatesOverlay(props) {
  const [entryAnimFinished, setEntryAnimFinished] = useState(false);
  const [minsPlayed, setMinsPlayed] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [stats, setStats] = useState(null);
  const { close, player } = props;
  const ref = useRef();

  useEffect(_ => {
    if (!player) return;
    const { playerId, matchId } = player;
    Api.getPlayerMatchStats({ playerId, matchId }).then(stats => {
      const played = stats["minutesPlayed"];
      delete stats.minutesPlayed;
      setMinsPlayed(played);
      setStats(stats);
    });
  }, [player.playerId]);

  useEffect(_ => {
    if (entryAnimFinished) {
      setShowContent(true);
    }
  }, [entryAnimFinished]);

  const onClickClose = () => {
    const animation = ref.current.animate([
      { transform: 'translate3d(0, 0, 0)', opacity: 1},
      { transform: 'translate3d(0, 15%, 0)', opacity: 0},
    ], {
      duration: 150,
    })
    animation.onfinish = () => close();
  }

  const calculateStatPoints = (stat, count) => {
    const value = pointsMap[stat];
    let points;
    if (stat === 'wasFouled' || stat === 'fouls') {
      points = count % 2 === 0
        ? pointsMap[stat] * (count / 2)
        : pointsMap[stat] * (count - 1) / 2;
    } else if (stat === 'result') {
      points = pointsMap[count];
    } else {
      points = value * count;
    }
    let bgColor = '';
    if (points < 0) {
      bgColor = "#f44336"; 
    } else if (points === 0) {
      bgColor = "#909090";
    } else if (points > 0 && points <= 10) {
      bgColor = "#1979c5";
    } else if (points > 10) {
      bgColor = "#ff9c00";
    }
    return { points, count, stat: statsMap[stat], bgColor };
  }

  const splittedName = player.shortName.split(' ')[player.shortName.split(' ').length - 1];

  return (
    <Wrapper ref={ref} onAnimationEnd={_ => setEntryAnimFinished(true)}>
      <Header>
        <CloseIconStyled width="20" height="20" onClick={onClickClose}/>
        <Title>{splittedName} {minsPlayed && <span>({minsPlayed}')</span>}</Title>
        <Subtitle>{player.team.shortName}</Subtitle>
      </Header>
      <Content>
        {stats && showContent && (
          <ContentWrapper>
            <Ul>
              {Object.keys(stats).map(key => {
                let { points, count, stat, bgColor } = calculateStatPoints(key, stats[key]);
                points = points > 0 ? `+${points}` : points;
                return (
                  <Stat key={key}>
                    <Points>
                      <PointsShapeIconStyled bg-color={bgColor} width="50" height="50"/>
                      <PointsText>{points}</PointsText>
                    </Points>
                    <StatKey>{count} {stat}</StatKey>
                  </Stat>
                )
              })}
            </Ul>
            <TotalPoints><span>{player.points}</span><span>points</span></TotalPoints>
          </ContentWrapper>
        )}
      </Content>
    </Wrapper>
  )
}

const slideUp = keyframes`
  0% {
    transform: translate3d(0, 70%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
`;

const scale = keyframes`
  0% {
    opacity: 0;
    transform: translate3d(20px, 0, 0);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

const ContentWrapper = styled.div`
  animation: 250ms ${scale};
`;

const Wrapper = styled.div`
  box-sizing: border-box;
  text-align: center;
  color: #f7f7fa;
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: 10;
  background: #2961d3;
  animation: 250ms ${slideUp} ease-out;
`;

const TotalPoints = styled.div`
  width: 250px;
  margin: 10px auto;
  text-align: left;
  margin-top: 30px;
  display: flex;
  padding-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 36px;
  border-top: 4px solid #eaedef;
  border-top-style: dashed;
  color: #37474f;
  font-weight: bold;
`;

const Header = styled.header`
  align-items: center;
  background: #2961d3;
  display: flex;
  height: 125px;
  justify-content: flex-start;
  position: relative;
  padding: 0 25px;
`;

const Points = styled.div`
  width: 50px;
  height: 50px;
  color: #fffffff0;
  font-weight: bold;
  color: #fffffff0;
  font-weight: bold;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PointsText = styled.span`
  z-index: 2;
`;

const PointsShapeIconStyled = styled(PointsShapeIcon)`
  fill: ${props => props["bg-color"]};
  position: absolute;
  left: 0;
`;

const Content = styled.div`
  color: #232323;
  border-top-right-radius: 35px;
  border-top-left-radius: 35px;
  background: #f9f9f9;
  height: calc(100% - 100px);
  border-top: 2px solid #385faf;
  box-sizing: border-box;
  box-shadow: inset 0px 1px 1px rgb(0 0 0 / 7%);
  overflow-y: hidden;
`;

const Title = styled.div`
  font-size: 28px;
`;

const Subtitle = styled.div`
  font-size: 28px;
  position: absolute;
  bottom: 0px;
  color: #ffffff66;
`;

const Ul = styled.ul`
  padding: 0;
  margin: 0;
  list-style-type: none;
  padding-top: 26px;
`;

const CloseIconStyled = styled(CloseIcon)`
  position: absolute;
  right: 25px;
  background: #2557bd;
  padding: 10px;
  border-radius: 100%;
  box-shadow: inset -2px -3px 1px 1px rgb(0 0 0 / 11%);
  fill: #ffffffdb;
  border: 2px solid #ffffff3d;
`;

const Stat = styled.li`
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 250px;
  margin: 6px auto;
`;

const StatKey = styled.span``;

export default DraftCandidatesOverlay;