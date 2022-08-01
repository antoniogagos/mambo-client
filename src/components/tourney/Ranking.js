import React, { useEffect, useContext, useState } from 'react';
import * as Api from '../../firebase/api';
import { TourneyContext } from '../../pages/TourneyPage';
import { AuthContext } from '../../firebase/auth';
import styled from 'styled-components';
import MatchdaySelector from './MatchdaySelector';
import { ReactComponent as GoldMedal } from '../../images/gold-medal-sm.svg';
import { ReactComponent as SilverMedal } from '../../images/silver-medal-sm.svg';
import { ReactComponent as BronzeMedal } from '../../images/bronze-medal-sm.svg';

function Ranking({ visible, redirecToLive }) {
  const { user } = useContext(AuthContext);
  const [ranking, setRanking] = useState([]);
  const { tourney, setSelectedMatchday, selectedMatchday } = useContext(TourneyContext);

  const getRanking = () => {
    const { tourneyId } = tourney;
    Api.getRanking({ tourneyId, matchday: selectedMatchday })
      .then((nranking) => setRanking(nranking));
  }

  const onClickPlayer = (uid) => {
    if (uid === user.uid) {
      if (selectedMatchday === 0) {
        setSelectedMatchday(tourney.currentMatchday);
      }
      redirecToLive();
    } else {
    }
  }

  useEffect(_ => {
    if (visible && !ranking.length) {
      let { currentFixtureStatus, currentMatchday } = tourney;
      if (currentFixtureStatus === 'notstarted') {
        setSelectedMatchday(0);
      } else {
        setSelectedMatchday(currentMatchday);
      }
    }
  }, [visible]);

  useEffect(_ => {
    // const testRanking = [
    //   {
    //     "avatar": "ironman.svg",
    //     "matchday": 0,
    //     "points": 188,
    //     "uid": "TFJq79KQ2GPjPsuDt83Ly3HFXLM2",
    //     "name": "Antonio García",
    //     "tourneyId": "nJL5FSd2vJM9nB5MnsZy"
    //   },
    //   {
    //     "points": 181,
    //     "uid": "gBbCiTcI9jQhP2kJgXjJe2uO4Uj1",
    //     "tourneyId": "nJL5FSd2vJM9nB5MnsZy",
    //     "matchday": 0,
    //     "name": "Koker",
    //     "avatar": "deadpool.svg"
    //   },
    //   {
    //     "matchday": 0,
    //     "avatar": "captain-america.svg",
    //     "points": 133,
    //     "uid": "JED3SwIEgAMtnIaLZmaAznexAoy2",
    //     "tourneyId": "nJL5FSd2vJM9nB5MnsZy",
    //     "name": "Nacho"
    //   },
    //   {
    //     "avatar": "003-superhero-2.svg",
    //     "matchday": 0,
    //     "points": 132,
    //     "uid": "TFJq79KQ2GPjPsuDt83Lz",
    //     "name": "Maxacapakete",
    //     "tourneyId": "nJL5FSd2vJM9nB5MnsZy"
    //   },
    //   {
    //     "points": 125,
    //     "uid": "gBbCiTcI9jQhP2kJgXjJe2u1",
    //     "tourneyId": "nJL5FSd2vJM9nB5MnsZy",
    //     "matchday": 0,
    //     "name": "Pipe88",
    //     "avatar": "001-superhero.svg"
    //   },
    //   {
    //     "matchday": 0,
    //     "avatar": "021-superhero-20.svg",
    //     "points": 110,
    //     "uid": "JED3SwIEgAMtnIaLZmaAzn5",
    //     "tourneyId": "nJL5FSd2vJM9nB5MnsZy",
    //     "name": "Eres Mualisimo"
    //   },
    //   {
    //     "points": 95,
    //     "uid": "gBbCiTcI9jQhP2kJgXjJe2uO4U4",
    //     "tourneyId": "nJL5FSd2vJM9nB5MnsZy",
    //     "matchday": 0,
    //     "name": "Ch0rly",
    //     "avatar": "008-superhero-7.svg"
    //   },
    //   {
    //     "matchday": 0,
    //     "avatar": "017-superhero-16.svg",
    //     "points": 72,
    //     "uid": "JED3SdtnIaLZmaAznexAoy22",
    //     "tourneyId": "nJL5FSd2vJM9nB5MnsZy",
    //     "name": "Blue Triton"
    //   },


    //   {
    //     "matchday": 0,
    //     "avatar": "020-superhero-19.svg",
    //     "points": 71,
    //     "uid": "JED3SwIEgAMtnIaLZmaAzn5fdd",
    //     "tourneyId": "nJL5FSd2vJM9nB5MnsZy",
    //     "name": "Pdgago"
    //   },
    //   {
    //     "points": 66,
    //     "uid": "gBbCiTcI9jQhP2fgXjJe2uO4U4",
    //     "tourneyId": "nJL5FSd2vJM9nB5MnsZy",
    //     "matchday": 0,
    //     "name": "Davidpunta",
    //     "avatar": "013-superhero-12.svg"
    //   },
    //   {
    //     "matchday": 0,
    //     "avatar": "027-superhero-26.svg",
    //     "points": 32,
    //     "uid": "JED3SwIaaLZmaAznexAoy22",
    //     "tourneyId": "nJL5FSd2vJM9nB5MnsZy",
    //     "name": "Er nando"
    //   },
    // ];
    // setRanking(testRanking);
    if (typeof selectedMatchday !== 'number') return;
    if (tourney.generalRanking && selectedMatchday === 0) {
      setRanking(tourney.generalRanking);
    } else {
      getRanking();
    }
  }, [selectedMatchday]);

  return (
    <Wrapper>
      <Podium>
        {ranking.slice(0, 3).map((user, index) => {
          const pos = index + 1;
          if (pos <= 3) {
            const medals = [GoldMedal, SilverMedal, BronzeMedal];
            const classNames = ['first', 'second', 'third'];
            var Medal = medals[index];
            var classes = classNames[index];
          }
          return (
            <PodiumRow key={user.uid} className={`podium-row ${classes}`} onClick={_ => onClickPlayer(user.uid)}>
              <Position>{pos}</Position>
              {pos <= 3 ? <Medal style={{
                position: "absolute",
                top: "0",
                width: "93px",
                height: "100%",
                right: "-50px",
                opacity: 0.1,
              }} /> : pos}
              <Avatar className={classes} src={`${process.env.PUBLIC_URL}/avatars/${user.avatar}`} />
              <Name>{user.name}</Name>
              <Points>{user.points}</Points>
            </PodiumRow>)
        })}
      </Podium>
      <Leaderboard>
        {ranking.slice(3, ranking.length).map((user, index) => {
          const pos = index + 4;
          return (
            <Row key={user.uid} onClick={_ => onClickPlayer(user.uid)}>
              <Position>{pos}</Position>
              <Avatar small={true} src={`${process.env.PUBLIC_URL}/avatars/${user.avatar}`} />
              <Name small={true}>{user.name}</Name>
              <Points>{user.points}</Points>
            </Row>)
        })}
      </Leaderboard>
      {/* <Tabs>
        <Button onClick={_ => setSelectedMatchday(0)}>General</Button>
        <Selector>
          <MatchdaySelector changeMatchday={setSelectedMatchday} matchday={selectedMatchday}/>
        </Selector>
      </Tabs> */}
    </Wrapper>
  )
}

const Position = styled.span``;
const Podium = styled.div``;
const Name = styled.span`
  font-size: ${props => props.small ? '14px' : '16px'};
`;

const Leaderboard = styled.div``;

const Row = styled.li`
  padding: 5px 15px;
  display: flex;
  align-items: center;
  margin: 5px 0;
  position: relative;
  font-weight: bold;
  font-size: 18px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 25px max-content 0.9fr max-content;
`;
const PodiumRow = styled.li`
  border-radius: 10px;
  box-shadow: inset 0px -4px 1px rgba(0,0,0,0.14);
  font-size: 22px;
  padding: 15px;
  display: flex;
  align-items: center;
  color: #151e31;
  margin: 4px 0;
  position: relative;
  font-weight: bold;
  overflow: hidden;
  display: grid;
  grid-template-columns: 25px max-content 0.9fr max-content;
  &.first {
    background: #ffe177;
    margin-top: 0;
  }
  &.second {
    background: #cacaca;
  }
  &.third {
    background: #bf8a6c;
  }
`;

const Avatar = styled.img`
  width: ${props => props.small ? '40px' : '50px'};
  height: ${props => props.small ? '40px' : '50px'};
  margin-right: 10px;
  border-radius: 100%;
  background: ${props => props.theme.name === 'light' ? '#ffffff6b' : '#29354e' };
  padding: 5px;
  box-sizing: border-box;
  box-shadow: ${props => props.small ? 'none' : 'inset 2px 2px 1px rgb(0 0 0 / 16%), inset -2px -2px 1px rgb(0 0 0 / 16%)'};
  border: 1px solid ${props => props.theme.lowContrast};
  &.first {
    background: #ffe177;
    border: 2px solid #ffeeb2;
  }
  &.second {
    background: #cacaca;
    border: 2px solid #f3f2f2;
  }
  &.third {
    background: #bf8a6c;
    border: 2px solid #daa78b;
  }
`;

const Wrapper = styled.div`
  padding: 0 20px;
  color: ${props => props.theme.primaryColor};
  max-height: calc(100% - 68px);
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 2px;
  }
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.lowContrast};
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.lowContrast};
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #888;
  }  
`;

const Points = styled.span`
  margin-left: auto;
  font-weight: bold;
`;


export default Ranking;