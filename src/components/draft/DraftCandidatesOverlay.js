import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import PlayerCard from './PlayerCard.js';
import DraftCard from './DraftCard.js';
import CardFrame from '../../images/card-frame.svg';
import { ReactComponent as PlaneIcon } from '../../images/plane.svg';
import { ReactComponent as HomeIcon } from '../../images/home.svg';
import * as Api from '../../firebase/api';

function DraftCandidatesOverlay(props) {
  const [players, setPlayers] = useState(null);

  let {
    playersInfo, close, candidates, matchday, competitionId,
    selectPlayer, loadingCandidates, selectedPlayerIdx
  } = props;

  const onClickPick = (pick) => {
    selectPlayer(pick);
    close();
  }

  const getPlayers = async (cardCandidates) => {
    const playersWithStats = await Promise.all(
      cardCandidates.map(async candidate => {
      const player = Object.assign(playersInfo[candidate], { pId: candidate });
      const stats = await Api.getPlayerSeasonStats({ playerId: player.playerId, season: 2020 });
      const { teamId } = player;
      const nextMatch = await Api.getTeamNextMatch({ teamId, competitionId, matchday });
      return Object.assign(player, { stats, nextMatch });
    }));
    setPlayers(playersWithStats);
  }

  useEffect(_ => {
    if (!candidates) return;
    const cardCandidates = candidates.slice(selectedPlayerIdx*4, (selectedPlayerIdx*4) + 4);
    getPlayers(cardCandidates);
  }, [candidates]);

  return (
    <Wrapper>
      {loadingCandidates && (
        <CardsWrapper>
          <PlayerCard loading={true} size="big"/>
          <PlayerCard loading={true} size="big"/>
          <PlayerCard loading={true} size="big"/>
          <PlayerCard loading={true} size="big"/>
        </CardsWrapper>
      )}
      {!loadingCandidates && players && (
      <CardsWrapper>
        {players.map((player, index) => {
          if (player.nextMatch) {
            var isHome = player.teamId === player.nextMatch.teams[0];
            const rivalTeamId = isHome ? player.nextMatch.teams[1] : player.nextMatch.teams[0];
            var playerTeam = Api.getTeamInfo({ teamId: rivalTeamId });
          }
          const starsStyles = {
            1: {
              gradEnd: '#fff',
              background: '#cecece',
              borderColor: '#e7e7e7'},
            2: {
              gradEnd: '#1b4201',
              background: '#54ca5d',
              borderColor: '#3db947'},
            3: {
              gradEnd: '#263238',
              background: '#1565C0',
              borderColor: '#1a59a1'},
            4: {
              gradEnd: '#A00047',
              background: '#b91020',
              borderColor: '#a74952'},
            5: {
              gradEnd: '#BF360C',
              background: '#FFC107',
              borderColor: '#d8aa68'
            }
          }

          return (
            // <DraftCard index={index} key={player.playerId} player={player}/>
            <Card onClick={_ => onClickPick(player)} key={player.slug}>
              <CardTopSide>
                <CardLevel background={starsStyles[player.stars].background}/>
                <CardSideInfo>
                  <ClubImage width="68" height="68" src={`${process.env.PUBLIC_URL}/teams/${player.team.slug}_96x96.png`}/>
                </CardSideInfo>
                <PlayerImage width="160" height="160" src={`${process.env.PUBLIC_URL}/players/${player.slug}.png`}/>
              </CardTopSide>
              <CardName>{player.shortName}</CardName>
              <CardBottomSide>
                {player.stats && (
                <PlayerStats>
                  <StatsRow>
                    <StatCount>{player.stats.points}</StatCount>
                    <StatText>Total <br/>points</StatText>
                  </StatsRow>
                  <StatsRow>
                    <StatCount>{Math.ceil(player.stats.mins/player.stats.matches)}'</StatCount>  
                    <StatText>Minutes <br/>per game</StatText>
                  </StatsRow>
                  <StatsRow>
                    <StatCount>{player.stats.matches}</StatCount>
                    <StatText>Matches <br/>played</StatText>
                  </StatsRow>
                  <StatsRow>
                    <StatCount>{Math.ceil(player.stats.points * 90/player.stats.mins)}</StatCount>
                    <StatText>Points <br/>per 90'</StatText>
                  </StatsRow>
                </PlayerStats>)}
                {!player.stats && <PlayerStats>No stats registered.</PlayerStats>}
                {player.nextMatch && (
                  <CardFooter>
                    <FooterText>Next match</FooterText>
                    {isHome ? <HomeIconStyled title="home"/> : <PlaneIcon title="plane" fill="#F44336" width="22" height="22"/> }
                    <PlayerTeam alt={playerTeam.name} src={`${process.env.PUBLIC_URL}/teams/${playerTeam.slug}_48x48.png`}/>
                  </CardFooter>
                )}
              </CardBottomSide>
            </Card>
          )
        })}
      </CardsWrapper>)}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: #263238;
  align-items: center;
  justify-content: center;
  display: flex;
  z-index: 10;
  bottom: 0;
  position: relative;
  height: 100vh;
  width: 100vw;
  @media (min-width: ${props => props.theme.mediaQueryWidth}) {
    height: 100%;
    width: 100%;
  }
`;

const CardLevel = styled.div`
  border-radius: 100%;
  padding: 6px;
  box-sizing: border-box;
  box-shadow: inset 0px 0px 0px 1px rgb(0 0 0 / 12%), inset 11px -10px 2px 1px rgb(0 0 0 / 30%);
  background-position: top;
  width: 15px;
  height: 15px;
  background: linear-gradient(47deg,${props => props.background} 61%,rgb(255 255 255) 81%);
  position: absolute;
  bottom: -6px;
`;

const PlayerTeam = styled.img`
  width: 32px;
  height: 32px;
  opacity: 0.9;
`;

const FooterText = styled.div`
  margin-right: 12px;
`;

const HomeIconStyled = styled(HomeIcon)`
  width: 24px;
  height: 24px;
  margin-right: 5px;
  margin-bottom: 2px;
  fill: #37474F;
`;

const Card = styled.div`
  background-image: url(${CardFrame});
  background-size: contain;
  background-repeat: no-repeat;
  padding: 20px 0;
  box-sizing: border-box;
  min-width: 265px;
  position: relative;
  min-height: 435px;
`;

const ClubImage = styled.img``;
const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  color: #6f4113;
`;
const CardSideInfo = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: absolute;
  left: 15px;
  top: 20px;
`;

const PlayerImage = styled.img``;

const CardTopSide = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
`;

const CardBottomSide = styled.div`
  padding: 20px;
`;

const CardName = styled.div`
  align-items: center;
  background: linear-gradient(180deg, #F9C663 25%, #FFDA6A 113.64%);
  box-sizing: border-box;
  border-top: 1px solid #f1bc58;
  color: #6F4113;
  display: flex;
  font-size: 24px;
  text-transform: uppercase;
  font-weight: bold;
  justify-content: center;
  margin: 0 auto;
  padding: 5px 0;
  width: 93%;
`;

const PlayerStats = styled.div`
  color: #6f4113;
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-size: 14px;
  justify-content: space-between;
  flex: 1 1 0px;
  grid-row-gap: 10px;
  padding-bottom: 18px;
`;

const StatText = styled.div`
  font-size: 11px;
  width: 60px;
`;

const StatCount = styled.div`
  font-size: 21px;
  font-weight: bold;
  margin-right: 6px;
  width: 49px;
  text-align: right;
  overflow: hidden;
`;

const StatsRow = styled.div`
  display: flex;
  flex: 1 1 0;
  align-items: flex-start;
`;

const slide = keyframes`
  0% {
    transform: translate3d(-100%, 0, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
`;

const CardsWrapper = styled.div`
  padding: 0px 20px;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  display: grid;
  grid-auto-flow: column;
  overflow-y: hidden;
  animation: 500ms ${slide};
  height: 100%;
  grid-gap: 20px;
`;



export default DraftCandidatesOverlay;