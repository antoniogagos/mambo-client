import React, { useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import BlueBg from '../../images/blue-bg.png';
import RedBg from '../../images/red-bg.png';
import GoldMedal from '../../images/gold-medal.svg';
import SilverMedal from '../../images/silver-medal.svg';
import BronzeMedal from '../../images/bronze-medal.svg';
import HomeHeader from '../HomeHeader.js';
import { motion } from 'framer-motion';
import '../../css/App.css';


const COMPS_DATA = {
  "football_spain_league_1": {
    main: '#307dfa',
    bg: BlueBg
  },
  "football_england_league_1": {
    main: '#f67578',
    bg: RedBg
  },
  "football_champions_league": {
    main: '#f67578',
    bg: RedBg
  }
}

function TourneyList({ tourneys, animation }) {
  return (
    <Wrapper>
      <HomeHeader />
      {tourneys.map(tourney => <Tourney animation={animation} key={tourney.tourneyId}
        idx={{total: tourneys.length, curr:tourneys.indexOf(tourney)}} tourney={tourney}/>)}
    </Wrapper>
  );
}


function Tourney({ tourney }) {
  const { url } = useRouteMatch();

  const computeUserMedal = (position) => {
    if (position === 1) return GoldMedal;
    if (position === 2) return SilverMedal;
    if (position === 3) return BronzeMedal;
  }

  const status = tourney.currentFixtureStatus === 'inprogress' ? 'Live' : 'Draft open';

  return (
    <Link style={{textDecoration: 'none'}} to={{
      pathname: `${url}/${tourney.tourneyId}/live`,
      state: {title: tourney.name}}}>
     <TourneyCard
        initial={{
          opacity: 0,
        }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="tourney"
        competitionid={tourney.competitions[0]} key={tourney.tourneyId}>
      <CardHeader>
        <CompetitionLogo
          competitionId={tourney.competitions[0]}
          width={tourney.competitions[0] === 'football_champions_league' ? "60" : "65"}
          alt={tourney.competitions[0]} src={require(`../../images/competitions/${tourney.competitions[0]}${'.svg'}`)}/>
        <TourneyName>{tourney.name}</TourneyName>
      </CardHeader>
      {tourney.totalUserPoints ? tourney.userPosition <= 3
          ? <Medal src={computeUserMedal(tourney.userPosition)}/> : <UserPosition>{tourney.userPosition}º</UserPosition> : null}
      <TourneyInfo>
        {tourney.totalUserPoints ? (
        <Points>
          <PointsNumber>{tourney.totalUserPoints}</PointsNumber>
          <SmallText>points</SmallText>
        </Points>
        ) : null}
        <Status status={tourney.currentFixtureStatus}>
          {tourney.currentFixtureStatus === 'inprogress' && <Dot/>}
          <span>{status}</span>
        </Status>
      </TourneyInfo>
      <ShadowOverflow/>
    </TourneyCard>
    </Link>
  )
}

const Wrapper = styled.div`
  display: grid;
  grid-gap: 60px;
  padding-bottom: 60px;
`;

const UserPosition = styled.div`
  position: absolute;
  right: 28px;
  font-size: 20px;
  text-shadow: 1px 2px rgb(0 0 0 / 59%);
  top: 6px;
  color: #ffffffd1;
`;

const CompetitionLogo = styled.img`
  filter: ${props => props.competitionId === 'football_champions_league'  && props.theme.name === 'dark' ? 'invert(1)' : ''};
`;

const TourneyCard = styled(motion.div)`
  display: block;
  margin: 0 auto;
  padding: 0 10px;
  position: relative;
  width: 94%;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0px -1px 3px 0px rgb(0 0 0 / 27%);
  background-color: ${props => `${COMPS_DATA[props.competitionid].main}`};
  background-image: ${props => `url(${COMPS_DATA[props.competitionid].bg})`};
  height: 188px;
  background-repeat: no-repeat;
  background-size: cover;
  color: #ffffffeb;
  text-decoration: none;
  max-width: 375px;
  box-sizing: border-box;
`;

const ShadowOverflow = styled.div`
  height: 6px;
  width: 80%;
  position: absolute;
  bottom: -6px;
  right: 0;
  left: 0;
  background-color: inherit;
  margin: 0 auto;
  box-shadow: 0 0 11px 6px rgba(0,0,0,0.35);
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  opacity: 0.25;
`;

const CardHeader = styled.div`
  position: absolute;
  margin: 0 auto;
  right: 0;
  left: 0;
  height: 116px;
  top: -42px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const TourneyName = styled.div`
  font-size: 22px;
  font-weight: bold;
  text-shadow: 2px 3px rgba(0,0,0,0.16);
`;

const Medal = styled.img`
  position: absolute;
  right: 5px;
  top: 0;
`;

const TourneyInfo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
  padding-top: 60px;
  box-sizing: border-box;
`;

const Points = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 40px;
  flex: 1;
  position: relative;
  padding-bottom: 40px;
`;

const PointsNumber = styled.div`
  flex-direction: row;
  position: relative;
`;

const SmallText = styled.span`
  font-size: 14px;
  position: absolute;
  bottom: 48px;
  color: #ffffffc9;
  font-weight: bold;
`;

const Status = styled.div`
  text-shadow: ${props => props.status === 'inprogress' ? '1px 1px #7b7b7bb8' : '1px 1px #00000021'};
  margin-bottom: 8px;
  color: #fffc;
  font-size: 16px;
  display: flex;
  align-items: center;
  font-weight: bold;
  position: absolute;
  font-size: 14px;
  bottom: 0;
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
  position: absolute;
  left: -15px;
  width: 5px;
  height: 5px;
  margin: 0 5px;
  background: #00ff0a;
  animation: .65s ${blink} infinite alternate;
  border-radius: 100%;
`;

export default TourneyList;