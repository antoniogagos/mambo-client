import React from 'react';
import { Link, useParams, useRouteMatch, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ReactComponent as AddTourneyIcon } from '../images/add-tourney.svg';

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 45px;
  padding: 0 16px;
  box-sizing: border-box;
  font-size: 16px;
`

const Title = styled.div`
  letter-spacing: -1px;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 24px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  display: flex;
`

const CreateTourneyIcon = styled.div`
  border-radius: 50%;
  border: 2px solid #3e3e3e;
  color: #3e3e3e;
  width: 30px;
  height: 30px;
  font-size: 24px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  background: none;
  border: none;
`;

function HomeHeader() {
  const location = useLocation();
  const { url } = useRouteMatch();
  const { tourneyId } = useParams(); 

  return (
    <Header>
      <Title>Mambo</Title>
      {!tourneyId && <StyledLink to={`${url}/create`}><AddTourneyIconStyled width="30" height="30" title="create tournament"/></StyledLink>}
    </Header>
  )
}

const AddTourneyIconStyled = styled(AddTourneyIcon)`
  fill: ${props => props.theme.primaryColor}
`;

export default HomeHeader;