import React, { useContext } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { AuthContext } from '../firebase/auth';
import styled, { keyframes } from 'styled-components';
import { ThemePreferenceContext } from "../App";
import PatternImage from '../images/shapes/pattern.png';
import Phone from '../components/Phone';
import Video from '../images/mambo.mp4';
import { ReactComponent as SemicircleLeft } from '../images/shapes/semicircle-left.svg';
import { ReactComponent as SemicircleRight } from '../images/shapes/semicircle-right.svg';
import { ReactComponent as Circle1 } from '../images/shapes/circle-1.svg';
import { ReactComponent as Circle2 } from '../images/shapes/circle-2.svg';

const LandingPage = () => {
  const { user } = useContext(AuthContext);
  const { setCurrentTheme } = useContext(ThemePreferenceContext);

  const mediaQuery = window.matchMedia('(max-width: 980px)');

  const onTimeUpdate = (evt) => {
    const currentTime = evt.target.currentTime;
    if (currentTime >= 20.3 && currentTime <= 38.7) {
      setCurrentTheme('darkTheme');
    } else {
      setCurrentTheme('lightTheme');
    }
  }

  if (user) {
    return (<Redirect to="/tournaments" />);
  }

  if (mediaQuery.matches) {
    return <Redirect to="/signin"/>
  }

  return (
    <Wrapper>
      <SemicircleLeftStyled />
      <SemicircleRightStyled />
      <PatternImageStyled src={PatternImage} alt="pattern" />
      <Circles>
        <Circle1Styled />
        <Circle2Styled />
      </Circles>
      <ContentWrapper>
        <Content>
          <Mambo>Mambo</Mambo>
          <div>
            <Title>Your Fantasy Football Game.</Title>
            <Subtitle>
              Draft your squad each matchday & challenge your friends in a season-long tournament.
            </Subtitle>
          </div>
          <Button>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <StyledLink to="/signin">Play now</StyledLink>
          </Button>
        </Content>
        <Phone isLandingPage={true}>
          <div>
            <VideoElement onTimeUpdate={onTimeUpdate} loop autoPlay src={Video} />
          </div>
        </Phone>
      </ContentWrapper>
      <Copyright>© Rankup - {new Date().getFullYear()} All Rights Reserved.</Copyright>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  position: relative;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  user-select: none;
`;

const Mambo = styled.div`
  font-size: 40px;
  font-weight: bold;
  position: absolute;
  top: -4px;
  left: 0;
  margin: 0 auto;
`;

const Copyright = styled.div`
  position: absolute;
  bottom: 7px;
  right: 20px;
  margin: 0 auto;
  font-size: 13px;
  text-align: right;
  z-index: 9;
  color: #116d24;
  left: 0;
`;

const Circles = styled.div`
  position: absolute;
  bottom: 21vh;
  left: -8vw;
  right: 0;
  margin: auto;
  text-align: center;
`;

const Circle1Styled = styled(Circle1)``;
const Circle2Styled = styled(Circle2)``;

const ContentWrapper = styled.div`
  max-width: 1250px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  box-sizing: border-box;
  position: relative;
  display: grid;
  grid-template-columns: 0.7fr 1fr;
  height: 100%;
`;

const VideoElement = styled.video`
  width: 229px;
  height: 481px;
  position: absolute;
  top: 178px;
  object-fit: fill;
  left: 105px;
`;

const scale = keyframes`
  0% {
    transform: translate3d(150px, 0, 0);
    opacity: 0;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
`;

const Content = styled.div`
  position: relative;
  animation: 350ms ${scale} ease-out;
  position: relative;
  text-align: left;
  height: 475px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  margin-left: 50px;
`;

const Title = styled.div`
  font-size: 62px;
  line-height: 65px;
  margin-top: 60px;
  text-align: left;
  color: ${props => props.theme.primaryColor};
  font-weight: bold;
  // -webkit-text-stroke: 1px ${props => props.theme.primaryColor};
  background: linear-gradient(90deg, ${props => props.theme.name === 'light' ? '#35bc54, #ffc85d' : '#92ff97, #ffc658'});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.div`
  max-width: 375px;
  line-height: 30px;
  font-size: 20px;
  margin-top: 20px;
`;

const SemicircleLeftStyled = styled(SemicircleLeft)`
  fill: ${props => props.theme.primaryColor};
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
`;

const SemicircleRightStyled = styled(SemicircleRight)`
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
`;

const PatternImageStyled = styled.img`
  position: absolute;
  width: 70vw;
  right: 0;
  height: 100vh;
  z-index: 1;
`;

const span1 = keyframes`
  0% {
    left: -200px;
  }
  100% {
    left: 200px;
  }
`;

const span2 = keyframes`
  0% {
    top: -70px;
  }
  100% {
    top: 70px;
  }
`;

const span3 = keyframes`
  0% {
    right: -200px;
  }
  100% {
    right: 200px;
  }
`;

const span4 = keyframes`
  0% {
    bottom: -70px;
  }
  100% {
    bottom: 70px;
  }
`;

const Button = styled.button`
  font-size: 1.5em;
  text-align: center;
  background: ${props => props.theme.primaryColor};
  color: ${props => props.theme.main};
  padding: 0;
  margin: 0;
  border: 2px solid ${props => props.theme.main};
  width: fit-content;
  z-index: 99999;
  background: linear-gradient(to left top,${props => props.theme.name === 'light' ? 'rgb(39 39 39)' : '#d6d6d6'},
    ${props => props.theme.name === 'light' ? 'rgb(99 99 99)' : '#dedede'});
  border-style: none;
  font-size: 23px;
  font-weight: 600;
  outline: none;
  letter-spacing: 1.5px;
  cursor: pointer;
  position: relative;
  padding: 0px 10px;
  overflow: hidden;
  transition: all .5s;
  box-shadow: -1px 2px 4px rgb(39 39 39), inset 2px -3px 1px 1px ${props => props.theme.name === 'light' ? 'rgb(39 39 39)' : 'rgb(195 195 195)'},
      inset -3px -3px 1px 1px ${props => props.theme.name === 'light' ? 'rgb(39 39 39)' : 'rgb(195 195 195)'};
  transform: rotate(0) scale(1);
  border-radius: 4px;
  &:hover {
    transition: all .5s;
    transform: rotate(-3deg) scale(1.1);
    box-shadow: 0px 3px 5px rgba(0,0,0,.4);
  }

  &:hover span {
    animation-play-state: paused;
  }

  & > span {
    position: absolute;
    display: block;
  }

  & span:nth-child(1) {
    height: 3px;
    width: 200px;
    top: 0px;
    left: -200px;
    background: linear-gradient(to right, rgba(0,0,0,0), #a4afb5);
    border-top-right-radius: 1px;
    border-bottom-right-radius: 1px;
    animation: ${span1} 4s linear infinite;
    animation-delay: 1s;
  }

  & span:nth-child(2) {
    height: 70px;
    width: 3px;
    top: -70px;
    right: 0px;
    background: linear-gradient(to bottom, rgba(0,0,0,0), #a4afb5);
    border-bottom-left-radius: 1px;
    border-bottom-right-radius: 1px;
    animation: ${span2} 4s linear infinite;
    animation-delay: 2s;
  }

  & span:nth-child(3){
    height:3px;
    width:200px;
    right:-200px;
    bottom: 0px;
    background: linear-gradient(to left, rgba(0,0,0,0), #a4afb5);
    border-top-left-radius: 1px;
    border-bottom-left-radius: 1px;
    animation: ${span3} 4s linear infinite;
    animation-delay: 3s;
  }

  span:nth-child(4){
    height:70px;
    width:3px;
    bottom:-70px;
    left:0px;
    background: linear-gradient(to top, rgba(0,0,0,0), #a4afb5);
    border-top-right-radius: 1px;
    border-top-left-radius: 1px;
    animation: ${span4} 4s linear infinite;
    animation-delay: 4s;
  }

`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  padding: 10px;
  width: inherit;
  height: inherit;
  display: block;
  font-weight: bold;
`;

export default LandingPage;