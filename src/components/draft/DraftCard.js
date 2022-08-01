import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import BacksideCardImg from '../../images/backside.webp';

function DraftCard({ player, index }) {
  const [run, setRun] = useState(false);

  let gradEnd, borderColor, background;
  switch (player.stars) {
    case 1:
      gradEnd = '#fff';
      background = '#cecece';
      borderColor = '#e7e7e7';
      break;
    case 2:
      gradEnd = '#1b4201';
      background = '#54ca5d';
      borderColor = '#3db947';
      break;
    case 3:
      gradEnd = '#263238';
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

  return (
    <Card index={index} className={run ? 'running' : 'running'} onClick={_ => setRun(!run)}>
      <CardSide className={`front ${player.stars === 5 ? ' highlight' : ''}`}>
        <BacksideCard src={BacksideCardImg}/>
      </CardSide>
      <CardSide gradEnd={gradEnd} background={background} borderColor={borderColor} slug={player.slug} className="back">
        <Name>{player.name}</Name>
        <TeamShield
          alt={player.team.name}
          src={`${process.env.PUBLIC_URL}/teams/${player.team.slug}_96x96.png`}/>
      </CardSide>
    </Card>
  )
}

const fade = keyframes`
  0% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
  }
`;

const Name = styled.div`
  position: absolute;
  bottom: 0;
  font-size: 31px;
  text-shadow: 3px -2px rgba(0,0,0,0.34);
  text-align: center;
`;

const TeamShield = styled.img`
  position: absolute;
  top: -15px;
  right: -15px;
  opacity: 0.7;
`;

const Card = styled.div`
  transform: translate3d(${props => `${props.index *  - 110}%, 0, 0`});
  position: relative;
  width: 240px;
  height: 365px;
  transition: transform .4s;
  transform-style: preserve-3d;
  margin: 0 25px;
  &.running {
    transform: translateY(-25px) rotateY(180deg);
    cursor: auto;
  }
`;

const BacksideCard = styled.img``;

const CardSide = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 15px;
  backface-visibility: hidden;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
  &.front {
    pointer-events: all;
  }
  &.highlight::before {
    animation: 1.25 ${fade} infinite alternate;
    border-radius: 16px;
    bottom: 0;
    box-shadow: 0px 0px 20px 10px #daa300;
    content: ' ';
    left: 0;
    opacity: 0;
    position: absolute;
    right: 0;
    top: 2px;
  }

  &.highlight:active::before {
    opacity: 1;
  }
  &.back {
    overflow: hidden;
    background-color: ${props => props.background};
    background-size: contain;
    background-repeat: no-repeat;
    border: 5px solid ${props => props.borderColor};
    backface-visibility: hidden;
    transform: rotateY(180deg) translateZ(1px);
    background-image: url(${props => `${process.env.PUBLIC_URL}/players/${props.slug}.png`});
  }
`;


export default DraftCard;