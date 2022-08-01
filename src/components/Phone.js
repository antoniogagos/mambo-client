import React, { useContext } from 'react';
import { ThemePreferenceContext } from "../App";
import styled from 'styled-components';
import LandingPhoneWhite from '../images/white-mockup-landing.png';
import LandingPhoneBlack from '../images/black-mockup-landing.png';
import PhoneWhiteMockupImage from '../images/iphone-white-mockup.png';
import PhoneBlackMockupImage from '../images/iphone-black-mockup.png';
import PhoneWhiteMockupImageSmall from '../images/iphone-white-mockup-sm.png';
import PhoneBlackMockupImageSmall from '../images/iphone-black-mockup-sm.png';
import PhoneWhiteMockupImageExtraSmall from '../images/iphone-white-mockup-xs.png';
import PointerIcon from '../images/circle.svg';
import LightPattern from '../images/light-pattern.png';
import DarkPattern from '../images/dark-pattern.png';

const Phone = ({ children, isLandingPage }) => {
  const { currentTheme } = useContext(ThemePreferenceContext);

  return (
    <Wrapper className={`${currentTheme} ${isLandingPage ? 'landing' : ''}`}>
      <Content className={`${currentTheme} ${isLandingPage ? 'landing' : ''}`}>
        { children }
      </Content>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${props => props.theme.main};
  &.lightTheme {
    background-image: url(${LightPattern});
  }
  &.darkTheme {
    background-image: none;
    background-color: ${props => props.theme.main};
  }
  &.lightTheme > .home-button {
    background: #f7f7f7;
    border: 2px solid #ececec;
  }
  &.darkTheme > .home-button {
    border: 2px solid #373750;
    background: #1f1f2f;
  }
  &.landing {
    background: inherit;
  }
  
  background-position: top right;
  overflow: auto;
  background-repeat: no-repeat;
  color: ${props => props.theme.primaryColor};
  @media (min-width: ${props => props.theme.mediaQueryWidth}) {
    overflow: hidden;
    &.darkTheme {
      background-image: url(${DarkPattern});
    }
  }
`;

const Content = styled.div`
  @media (min-width: ${props => props.theme.mediaQueryWidth}) {
    cursor: url(${PointerIcon}), auto;
    position: relative;
    z-index: 4;
    width: ${props => props.theme.phoneWidth};
    height: 100%;
    right: 0;
    left: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    overflow-y: auto;
    &.landing {
      cursor: inherit;
      &.darkTheme {
        background-image: url(${LandingPhoneBlack});
      }
      &.lightTheme {
        background-image: url(${LandingPhoneWhite});
      }
    }
    &.darkTheme {
      background-image: url(${PhoneBlackMockupImage});
    }
    &.lightTheme {
      background-image: url(${PhoneWhiteMockupImage});  
    }
    background-repeat: no-repeat;
    background-position: center;
    overflow: hidden;
    & > div:first-child {
      width: ${props => props.theme.phoneContentWidth};
      height: ${props => props.theme.phoneContentHeight};
      position: absolute;
      right: 0;
      left: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      overflow-y: auto;
      box-sizing: border-box;
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
    }
    
    @media (max-height: 1000px) {
      &.darkTheme {
        background-image: url(${PhoneBlackMockupImageSmall});
      }
      &.lightTheme {
        background-image: url(${PhoneWhiteMockupImageSmall});  
      }
      & > div:first-child {
        width: ${props => props.theme.phoneContentWidthSmall};
        height: ${props => props.theme.phoneContentHeightSmall};
      }
    }

    @media (max-height: 825px) {
      &.darkTheme {
        background-image: url(${PhoneWhiteMockupImageExtraSmall});
      }
      &.lightTheme {
        background-image: url(${PhoneWhiteMockupImageExtraSmall});  
      }
      & > div:first-child {
        width: ${props => props.theme.phoneContentWidthExtraSmall};
        height: ${props => props.theme.phoneContentHeightExtraSmall};
      }
    }
  }
`;

export default Phone;