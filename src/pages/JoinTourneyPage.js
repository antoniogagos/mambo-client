import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Redirect, useLocation, useParams } from 'react-router-dom';
import { ReactComponent as BgPattern } from '../images/fans-illustration.svg';
import HomeHeader from '../components/HomeHeader';
import { AuthContext } from '../firebase/auth';
import { joinTourney, isUserInTourney } from '../firebase/api';
import AccessPage from './AccessPage';

const Title = styled.h1`
  font-size: 30px;
  text-align: center;
  color: #FFEB3B;
  max-width: 370px;
  font-weight: lighter;
  margin: 2em auto;
  margin-top: 4em;
  padding: 0 20px;
`;

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0 auto;
  position: relative;
  background: #00897B;
`;

const StyledBgPattern = styled(BgPattern)`
  height: auto;
  width: 100%;
  margin: 0 auto;
  max-height: 75vh;
  box-sizing: border-box;
  opacity: 0.2;
  mix-blend-mode: luminosity;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
`;

const Button = styled.button`
  max-width: 350px;
  margin: 0 auto;
  padding: 10px;
  font-size: 20px;
  background: #fceb3c;
  width: 90vw;
  border-radius: 7px;
  font-family: inherit;
  border: none;
  font-weight: 500;
  z-index: 2;
  color: #000000eb;
  box-shadow: inset 0px -4px 2px 0px rgba(0,0,0,0.14);
`;

const JoinTourneyPage = () => {
  const { tourneyId } = useParams();
  const { search } = useLocation();
  const name = new URLSearchParams(search).get('name');
  const { user } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [userAlreadyRegistered, setUserAlreadyRegistered] = useState(false);
  const [redirectTournaments, setRedirectTournaments] = useState(false);
  const [redirectSignUp, setRedirectSignUp] = useState(false);
   
  const checkIsUserInTourney = async ({ tourneyId, uid }) => {
    setUserAlreadyRegistered(await isUserInTourney({ tourneyId, uid }));
  }

  useEffect(_ => {
    if (user) {
      checkIsUserInTourney({ tourneyId, uid: user.uid });
    }
  }, [user]);

  const onClickJoin = async () => {
    if (user === null) {
      setRedirectSignUp(true);
    } else if (user && !userAlreadyRegistered) {
      try {
        await joinTourney({tourneyId});
        setRedirectTournaments(true);
      } catch(err) {
        setError(err.message);
      }
    } else if (user && userAlreadyRegistered) {
      setRedirectTournaments(true);
    }
  }

  if (redirectTournaments) {
    return <Redirect to={`/tournaments/${tourneyId}/live`}/>
  }

  if (redirectSignUp) {
    return (
      <Redirect to={{
        pathname: "/signup",
        state: {from: 'invitation', tourneyId}
      }}/>
    )
  }

  return (
    <Wrapper>
      <HomeHeader/>
      <StyledBgPattern/>
      <Title>You've been invited to play {name} 🥳</Title>
      <Button disabled={user === undefined} onClick={onClickJoin}>Start playing</Button>
      {error && <p>{error}</p>}
    </Wrapper>
  )
}

export default JoinTourneyPage;