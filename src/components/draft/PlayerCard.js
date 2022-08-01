import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

function PlayerCard(props) {
  if (props.loading) {
    return (
      <LoadingCard size={props.size}><LoadingBg size={props.size} /></LoadingCard>
    )
  }
  if (typeof props.player === 'string') {
    return <Default onClickCard={props.onClickCard} position={props.player} />;
  } else {
    return <Player onClickCard={props.onClickCard} size={props.size || 'default'} player={props.player} />;
  }
}

function Default(props) {
  return (
    <PlayerCardAnon whileHover={{ scale: 1.15, transition: { duration: 0.325 } }} whileTap={{ scale: 0.95 }} onClick={props.onClickCard}>
      <PositionTitle>
        <span>{props.position.toUpperCase()}</span>
      </PositionTitle>
      <QuestionMark>?</QuestionMark>
      <BrightnessMark></BrightnessMark>
    </PlayerCardAnon>
  )
}

function Player(props) {
  let gradStart, gradEnd, borderColor, background;
  const { player, size } = props;
  const splittedName = player.shortName.split(' ')[player.shortName.split(' ').length - 1];
  switch (player.stars) {
    case 1:
      gradEnd = '#5aa760';
      background = '#cecece';
      borderColor = '#e7e7e7';
      break;
    case 2:
      gradEnd = '#45a945';
      background = '#54ca5d';
      borderColor = '#3db947';
      break;
    case 3:
      gradEnd = '#11529c';
      background = '#1565C0';
      borderColor = '#1a59a1';
      break;
    case 4:
      gradEnd = '#A00047';
      background = '#b91020';
      borderColor = '#a74952';
      break;
    case 5:
      gradEnd = '#BF360C';
      background = '#FFC107';
      borderColor = '#d8aa68';
      break;
  }
  if (!player.team.slug) {
    player.team.slug = 'default';
  }

  let pointsBgColor = '';
  const points = player.points;
  if (points < 0) {
    pointsBgColor = "#f44336"; 
  } else if (points === 0) {
    pointsBgColor = "#909090";
  } else if (points > 0 && points <= 10) {
    pointsBgColor = "#1979c5";
  } else if (points > 10) {
    pointsBgColor = "#ff9c00";
  }

  return (
    <LiveCardWrapper onClick={props.onClickCard}>
      {size !== 'big' && <PlayerImage size={size} slug={player.slug} />}
      <TeamShield
          background={background}
          size={size}
          alt={player.team.name}
          src={`${process.env.PUBLIC_URL}/teams/${player.team.slug}_48x48.png`} />
      {typeof player.points === 'number' && <PlayerPoints pointsBgColor={pointsBgColor}>{player.points}</PlayerPoints>}
      <LiveCardFooter pointsBgColor={pointsBgColor} hasPoints={typeof player.points === 'number'} background={background} gradEnd={gradEnd}>
        <PlayerCardName hasPoints={typeof player.points === 'number'} size={size}>{size === 'big' ? player.name : splittedName}</PlayerCardName>
      </LiveCardFooter>
    </LiveCardWrapper>
  )
}

const LiveCardFooter = styled.div`
  align-items: center;
  border-radius: 10px;
  display: flex;
  overflow: hidden;
  position: relative;
  width: 100%;
  background: #2e2f35;
  min-width: 90px;
  font-size: 14px;
  padding-left: ${props => props.hasPoints ? '0' : '0'};
  box-sizing: border-box;
  justify-content: ${props => props.hasPoints ? 'flex-start' : 'center'};
  font-size: 14px;
  box-sizing: border-box;
  justify-content: center;
  text-align: center;
  @media (max-width: 466px) {
    min-width: 80px;
  }
  
`;

const LiveCardWrapper = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BrightnessMark = styled.div`
  width: 6px;
  position: absolute;
  height: 3px;
  transform: rotate(32deg);
  top: 6px;
  right: 4px;
  background: linear-gradient(to top, #ffcc30, #fff6da);
  border-radius: 30%;
`;


const PlayerImage = styled.div`
  background-image: url(${props => `${process.env.PUBLIC_URL}/players/${props.slug}.png`});
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: cover;
  height: 60px;
  width: 60px;
  @media (max-width: 466px) {
    width: 50px;
    height: 50px;
  }
`;

const PlayerPoints = styled.div`
  align-items: center;
  background: ${props => props.pointsBgColor};
  border-radius: 16px;
  box-sizing: border-box;
  color: #fffffffc;
  display: flex;
  font-weight: bold;
  height: 100%;
  justify-content: center;
  overflow: hidden;
  right: 0;
  text-align: center;
  width: 24px;
  height: 24px;
  position: absolute;
  left: -12px;
  font-size: 15px;
  bottom: -2px;
  z-index: 4;
  justify-content: center;
  text-align: center;
  box-shadow: inset -1px -1px 1px 0px rgb(0 0 0 / 62%);
  @media (max-width: 466px) {
    width: 20px;
    height: 20px;
    bottom: -1px;
    left: -11px;
    font-size: 14px;
  }
  @media (max-width: 385px) {
    left: -13px;
  }
`;

const PositionTitle = styled.div`
  align-items: center;
  color: #484848db;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  position: absolute;
  font-weight: bold;
  display: none;
`;

const QuestionMark = styled.span`
  position: absolute;
  font-size: 36px;
  opacity: 0.05;
  font-family: sans-serif;
  color: #000;
`;

const TeamShield = styled.img`
  width: ${props => props.size === 'big' ? '96px' : '48px'};
  height: ${props => props.size === 'big' ? '96px' : '48px'};
  top: ${props => props.size === 'big' ? '-22px' : '29px'};
  left: ${props => props.size === 'big' ? 'auto' : '41px'};
  right: ${props => props.size === 'big' ? '-35px' : '0'};
  position: absolute;
  opacity: 0.5;
  z-index: -1;
  @media (max-width: 466px) {
    top: 18px;
    left: 24px;
  }
`;

const PlayerCardAnon = styled(motion.div)`
  align-items: center;
  display: flex;
  justify-content: center;
  overflow: hidden;
  pointer-events: all;
  position: relative;
  width: 51.2px;
  height: 64px;
  border-radius: 8px;
  background: #ffcd30;
  box-sizing: border-box;
  box-shadow: rgb(187 146 19) 2px -2px 2px 0px inset, rgb(253 215 101) -2px 2px 1px 0px inset, rgb(0 0 0 / 28%) 0px 1px 2px 0px;
  background: linear-gradient(-290deg,rgb(199,159,36) 0%,rgb(255,205,48) 22%);
  margin: 0 auto;
  z-index: 1;
`;

const LiveCard = styled.div`
  position: relative;
  height: ${props => props.size === 'big' ? '250px' : '64px'};
  width: ${props => props.size === 'big' ? '172px' : '51.2px'};
  box-shadow: 1px -1px 1px 0px rgba(0,0,0,.05);
  border-radius: 8px;
  background: ${props => props.background};
  z-index: 4;
  overflow: hidden;
  box-sizing: border-box;
  border: 2px solid ${props => props.borderColor};
`;

const PlayerCardName = styled.span`
  color: ${props => props.size === 'big' ? '#fffffff7' : '#fffffffc'};
  font-size: ${props => props.size === 'big' ? '18px' : '12px'};
  font-weight: 600;
  text-shadow: ${props => props.size === 'big' ? '1px -4px rgba(0,0,0,0.44);' : 'none'};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  width: 100%;
  padding: 0 14px;
  @media (max-width: 385px) {
    font-size: 11px;
  }
`;

const LoadingCard = styled.div`
  height: ${props => props.size === 'big' ? '365px' : '64px'};
  width: ${props => props.size === 'big' ? '240px' : '51.2px'};
  margin-right: ${props => props.size === 'big' ? '25px' : ''};
  background: #70F570;
  margin: 0 auto;
  z-index: 1;
  box-shadow: 1px -1px 1px 0px rgba(0,0,0,.05);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
`;

const loadingSm = keyframes`
  0% {
    transform: translate3d(0, -40px, 0);
  }
  100% {
    transform: translate3d(0, 40px, 0)
  }
`;

const loading = keyframes`
  0% {
    transform: translate3d(0, -120px, 0);
  }
  100% {
    transform: translate3d(0, 120px, 0)
  }
`;

const LoadingBg = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  will-change: transform;
  animation: 1s ${props => props.size === 'big' ? loading : loadingSm} infinite alternate;
  background: linear-gradient(180deg, transparent, ${props => props.size === 'big' ? '#4e4e4e40' : '#02981b40'} 50%, transparent);
`;

export default PlayerCard;