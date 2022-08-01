import React from 'react'
import styled, { keyframes } from 'styled-components';
import MamboLogo from '../images/mambo.png';
import './loading.css';

export default function LoadingApp({ landing }) {
  console.log({landing});
  return (
    <Wrapper className={landing ? 'landing' : ''}>
      <Content>
        <Logo>
          <img alt="Mambo Logo" src={MamboLogo}/>
          <Circle></Circle>
        </Logo>
      </Content>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: ${props => props.theme.main};
  &.landing {
    z-index: 99999;
    height: 100vh;
    position: absolute;
    width: 100vw;
  }
`;

const Content = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  height: 100vh;
  @media (min-width: ${props => props.theme.mediaQueryWidth}) {
    height: 100%;
  }
`;

const Logo = styled.div`
  background: #fff;
  width: 100%;
  height: 60%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Circle = styled.div`
  position: absolute;
  bottom: -49px;
  width: 100%;
  height: 50px;
  background: white;
  border-bottom-right-radius: 50%;
  border-bottom-left-radius: 50%;
`;