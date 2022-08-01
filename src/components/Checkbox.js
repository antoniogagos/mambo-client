import React from "react";
import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { ThemePreferenceContext } from "../App";
import styled from 'styled-components';
import SunIcon from '../images/sun.svg';
import MoonIcon from '../images/moon.svg';

export default function App() {
  const [isOn, setIsOn] = useState(false);
  const { setCurrentTheme } = useContext(ThemePreferenceContext);

  const toggleSwitch = () => {
    setIsOn(!isOn);
    setCurrentTheme(isOn ? 'darkTheme' : 'lightTheme');
  }

  const active = isOn ? 'active' : '';
  return (
    <Switch className={`switch ${active}`} active={isOn} onClick={toggleSwitch}>
      <Handle className={`handle ${active}`} active={isOn} layout transition={spring}/>
    </Switch>
  );
}

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30
};

const Switch = styled.div`
  align-items: center;
  background-color: ${props => props.active ? '#394e64' : '#fff' };
  border-radius: 50px;
  border: 2px solid #88888824;
  cursor: pointer;
  display: none;
  height: 32px;
  justify-content: flex-start;
  padding: 0 10px;
  position: absolute;
  right: 50px;
  top: 100px;
  width: 55px;
  z-index: 9999;
  &.active {
    justify-content: flex-end;
  }
  @media (min-width: ${props => props.theme.mediaQueryWidth}) {
    display: flex;
  }
`;

const Handle = styled(motion.div)`
  background-color: white;
  background-image: url(${props => props.active ? MoonIcon : SunIcon });
  border-radius: 40px;
  height: 22px;
  width: 22px;
`;
