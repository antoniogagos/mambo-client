import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import * as Api from '../../firebase/api';
import { AuthContext } from '../../firebase/auth';
import { TourneyContext } from '../../pages/TourneyPage';
import { ThemePreferenceContext } from "../../App";
import { Redirect } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ReactComponent as SunIcon } from '../../images/sun.svg';
import { ReactComponent as MoonIcon } from '../../images/moon.svg';
import { ReactComponent as NotificationIcon } from '../../images/notification.svg';
import { ReactComponent as SignOutIcon } from '../../images/sign-out.svg';
import { ReactComponent as LeaveTourneyIcon } from '../../images/leave-tourney.svg';

function Settings({ visible }) {
  const { user } = useContext(AuthContext);
  const { tourney } = useContext(TourneyContext);
  const { currentTheme, setCurrentTheme } = useContext(ThemePreferenceContext);
  const [redirectHome, setRedirectHome] = useState(false);
  const [redirectLandingPage, setRedirectLandingPage] = useState(false);

  useEffect(_ => {
    if (visible) {}
  }, [visible]);

  const onClickDeleteTourney = async () => {
    try {
      setRedirectHome(true);
      await Api.deleteTourney({ tourney });
    } catch(err) {
      console.log(err);
    }
  }

  const onClickSignOut = async () => {
    setRedirectLandingPage(true);
    await Api.onSignOut();
  }

  const onClickTheme = () => {
    setCurrentTheme(currentTheme === 'lightTheme' ? 'darkTheme' : 'lightTheme');
  }

  if (redirectLandingPage) {
    return <Redirect to="/"/>;
  }

  if (redirectHome) {
    return <Redirect to ="/tournaments"/>;
  }

  return (
    <Wrapper>
      <Hero>
        <AvatarWrapper>
          <Avatar width="100" height="100" src={`${process.env.PUBLIC_URL}/avatars/${user.avatar}`}/>
          <AvatarGlow></AvatarGlow>
        </AvatarWrapper>
        <Name>{user.name}</Name>
      </Hero>
      {/* {tourney.ownerId === user.uid && <button
      onClick={onClickDeleteTourney}>Delete tournament</button>} */}
      <Content>
        <Item whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.05 }}>
          <ItemRow>
            <NotificationIcon fill="#3F51B5" width="20" height="20"/>
            <Title>Notifications</Title>
          </ItemRow>
        </Item>
        <Item onClick={onClickTheme} whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.05 }}>
          <ItemRow>
            {currentTheme === 'lightTheme' ? <SunIcon width="20" height="20"/> : <MoonIcon width="20" height="20"/>}
            <Title>Switch to {currentTheme === 'lightTheme' ? 'Dark Theme' : 'Light Theme'}</Title>
          </ItemRow>
        </Item>
        <Item whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.05 }}>
          <ItemRow>
            <LeaveTourneyIcon fill="#F44336" width="20" height="20"/>
            <Title>Leave tourney</Title>
          </ItemRow>
        </Item>
        <Item onClick={onClickSignOut} whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.05 }}>
          <ItemRow>
            <SignOutIcon style={{ paddingLeft: '4px'}} fill="#9E9E9E" width="20" height="20"/>
            <Title >Sign out</Title>
          </ItemRow>
        </Item>

      </Content>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  color: ${props => props.theme.primaryColor};
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const IconWrapper = styled.div`
  background: ${props => props.bg};
  border-radius: 9px;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  padding: 24px 12px;
  height: 100%;
  border-top-right-radius: 25px;
  border-top-left-radius: 25px;
`;

const Title = styled.div`
  margin-left: 20px;
`;

const Item = styled(motion.div)`
  align-items: center;
  background: ${props => props.theme.noContrast};
  color: ${props => props.theme.primaryColor};
  border-radius: 6px;
  box-shadow: inset 0px -4px 1px rgb(0 0 0 / 6%);
  display: flex;
  font-weight: bold;
  margin: 10px 0;
  padding: 16px;
`;

const Button = styled.button`
  text-transform: uppercase;
  margin: 16px;
  background: linear-gradient(to right, #2196F3 68%, #3f51b5f2);
  border: none;
  padding: 9px 24px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  border: 2px solid #2196f3;
  letter-spacing: 0.4px;
  font-weight: bold;
  text-shadow: 1px 1px #23232361;
  box-shadow: inset 2px -2px 0px rgb(0 0 0 / 20%);
  border-radius: 5px;
`;

const Name = styled.div`
  background: ${props => props.theme.noContrast};
  padding: 12px;
  font-size: 18px;
  text-transform: capitalize;
  font-weight: bold;
  width: 100%;
  text-align: center;
  margin: 10px 0;
  margin-bottom: 0;
  box-shadow: 0px 2px 2px rgb(0 0 0 / 5%);
  box-sizing: border-box;
`;

const AvatarWrapper = styled.div`
  position: relative;
`;

const InviteFriendsBanner = styled.div`
  background: #0178ff;
  width: 80%;
`;

const AvatarGlow  = styled.div`
  height: 5px;
  width: 16px;
  position: absolute;
  top: 13px;
  right: 25px;
  transform: rotate(36deg);
  border-radius: 15px;
  background: linear-gradient(to top,#e4e5e6 25%,#ffffff);
`;

const Hero = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const Avatar = styled.img`
  border-radius: 100%;
  padding: 6px;
  box-sizing: border-box;
  box-shadow: inset 3px 3px 2px 1px rgb(255 255 255 / 50%), inset -3px -3px 2px 1px rgb(23 37 57 / 32%);
  background-position: top;
  width: 125px;
  height: 125px;
  background: linear-gradient(0deg,#707782 0%,rgb(245 245 245) 100%);
`;

export default Settings;