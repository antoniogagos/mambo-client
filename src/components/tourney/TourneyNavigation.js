import styled, { css, keyframes } from 'styled-components';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useRouteMatch } from 'react-router-dom';
import { ReactComponent as BallIcon }  from '../../images/ball.svg';
import { ReactComponent as RankingIcon }  from '../../images/trophie.svg';
import { ReactComponent as SettingsIcon }  from '../../images/settings.svg';

const navigationItems = [
  {
    name: 'Ranking',
    icon: RankingIcon,
    color: "#ff0055",
    path: '/ranking'
  },
  {
    name: 'Live',
    icon: BallIcon,
    color: '#0099ff',
    path: '/live'
  },
  {
    name: 'Settings',
    icon: SettingsIcon,
    color: '#22cc88',
    path: '/settings'
  },
];

function TourneyNavigation() {
  const [selected, setSelected] = useState(null);
  const { url } = useRouteMatch();
  const { pathname, state } = useLocation();

  useEffect(_ => {
    setSelected(state?.view || pathname.split('/')[pathname.split('/').length-1]);
  }, [pathname]);

  return (
    <Nav>
      {navigationItems.map(navItem => {
        const { name, path, icon: Icon} = navItem;
        const isSelected = selected?.toLowerCase() === name.toLowerCase();
        const view = path.split('/')[path.split('/').length - 1];
        return (
          <StyledLink onClick={() => setSelected(name)} to={{pathname: `${url}${path}`, state: { view } }} key={name}>
              <NavItem className={isSelected ? 'selected': ''}>
                <Icon className="icon" width="25" height="25"/>
                {/* <Name selected={isSelected}>{name === 'Ranking' ? 'Leaderboard' : name}</Name> */}
                {isSelected && <Name selected={isSelected}>{name === 'Ranking' ? 'Leaderboard' : name}</Name>}
              </NavItem>
          </StyledLink>
        )
      })}
    </Nav>
  )
}

const Nav = styled.nav`
  background: ${props => props.theme.nav};
  align-items: center;
  background: ${props => props.theme.nav};
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  height: 55px;
  left: 0;
  margin: 0 auto;
  position: absolute;
  right: 0;
  width: 100%;
  bottom: 0;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  height: 100%;
  display: block;
  color: #ffffffd9;
  font-weight: bold;
  cursor: inherit;
`;

const NavItem = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  position: relative;
  &.selected .icon {
    transform: scale(1.6) translate3d(0,-12px,0);
    transition-duration: 250ms;
  }
`;

const appear = keyframes`
  0% {
    transform: translate3d(0, 6px, 0);
    opacity: 0
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
`;

const Name = styled.div`
  animation: 150ms ${appear};
  color: ${props => props.theme.navSelected};
  font-size: 14px;
  position: absolute;
  bottom: 2px;
  opacity: ${props => props.selected ? 1 : 0.2};
`;

export default TourneyNavigation;