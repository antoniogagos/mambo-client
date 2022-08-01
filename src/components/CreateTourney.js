import React, { useState, useEffect } from 'react';
import '../css/waves.css'
import { getCompetitions, addTourney } from '../firebase/api';
import { ReactComponent as Waves }  from '../images/waves.svg';
import { ReactComponent as PlayButton }  from '../images/play.svg';
import { Redirect, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Slider from './Slider';
import Loading from './loading.js';

function CreateTourney() {
  const [competitions, setCompetitions] = useState([]);
  const [name, setName] = useState('');
  const [compSelected, setCompSelected] = useState(null);
  const [addedTourney, setAddedTourney] = useState(null);
  const [reqError, setReqError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(_ => {
    fetchComps();
  }, []);

  const fetchComps = async () => {
    try {
      const competitions = await getCompetitions();
      setCompetitions(await getCompetitions());
      setCompSelected(competitions.find(c => c.competitionId === 'football_champions_league'));
    } catch(err) {
      setReqError(err.message);
    }
  }

  const handleCreateTourney = async (evt) => {
    evt.preventDefault();
    const { competitionId, season } = compSelected;
    const competitions = [competitionId];
    try {
      setLoading(true);
      const addedTourney = await addTourney({
        name, competitions, season, sport: "football"
      });
      setLoading(false);
      setAddedTourney(addedTourney);
    } catch(err) {
      setLoading(false);
      console.log(err);
    }
  }

  if (addedTourney) {
    return <Redirect to={`/tournaments/${addedTourney.tourneyId}/live`}/>
  }

  return (
    <>
    {loading && <Loading style={{
      position: "absolute",
      top: "0",
      bottom: "0",
      margin: "auto",
      left: "0",
      right: "0",
      opacity: "1",
    }} color="#1b7fce"/>}

    <Wrapper className={loading ? 'loading' : ''} onSubmit={handleCreateTourney}>
      <Header>
        <HeaderTitle>Select your <br/>favorite competition</HeaderTitle>
        <Input
            placeholder="Tournament name"
            type="text" id="name" value={name}
            onChange={evt => setName(evt.currentTarget.value)}
            autoCapitalize="on" tabIndex="0" required/>
        <WavesStyled/>
      </Header>
      {reqError && <div>{reqError}</div>}
      <LinkStyled to="/tournaments">Skip</LinkStyled>
      <CompetitionsCards>
        <Slider selectedCompetition={setCompSelected} competitions={competitions}/>
      </CompetitionsCards>
      <Button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>Start playing <PlayButtonStyled /></Button>
    </Wrapper>
    </>
  )
}

const HeaderTitle = styled.div`
  font-size: 24px;
`;

const Header = styled.div`
  background: #4CAF50;
  display: flex;
  flex-direction: column;
  line-height: 30px;
  padding: 35px 20px;
  height: 225px;
  box-sizing: border-box;
  position: relative;
`;

const Wrapper = styled.form`
  position: relative;
  color: #fff;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: linear-gradient(0deg,#fdecdf 0%,rgba(255,255,255,1) 70%);
  &.loading {
    opacity: 0.3;
    pointer-events: none;
  }
  @media (min-width: ${props => props.theme.mediaQueryWidth}) {
    min-height: 100%;
  }
`;

const WavesStyled = styled(Waves)`
  position: absolute;
  z-index: 50;
  bottom: -1px;
  left: 0;
`;

const CompetitionsCards = styled.div`
  position: relative;
  color: #232323;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: row;
  height: 265px;
  padding-top: 30px;
  box-sizing: border-box;
  background: transparent;
`;

const Input = styled.input`
  margin: 15px 0;
  padding: 10px;
  border-radius: 6px;
  border: none;
  background: #81c785;
  box-sizing: border-box;
  border: 2px solid #469a4ba6;
  color: #ffffffeb;
  text-shadow: 1px 2px rgba(0,0,0,0.14);
  font-weight: bold;
  font-size: 16px;
  position: relative;
  &::placeholder {
    font-family: inherit;
    color: inherit;
    opacity: 0.8;
  }
`;

const LinkStyled = styled(Link)`
  position: absolute;
  top: 40px;
  right: 20px;
  text-decoration: none;
  color: #ffffffc7;
  font-weight: bold;
  border: 1px solid #ffffff54;
  border-radius: 3px;
  padding: 2px 6px;
`;

const Button = styled(motion.button)`
  border-radius: 6px;
  border: none;
  bottom: 25px;
  color: #040404ad;
  display: flex;
  font-family: inherit;
  font-size: 18px;
  font-weight: bold;
  justify-content: center;
  left: 0;
  letter-spacing: 0.5px;
  margin: 0 auto;
  padding: 10px 0;
  position: absolute;
  right: 0;
  width: 235px;
  box-shadow: inset 1px -1px 0px 1px rgb(0 0 0 / 10%);
  background: #ffecdf;
  &:focus {
    outline: none;
  }
`;

const PlayButtonStyled = styled(PlayButton)`
  fill: #607D8B;
  margin-left: auto;
  width: 20px;
  height: 20px;
  position: absolute;
  right: 26px;
  bottom: 13px;
`;

export default CreateTourney;