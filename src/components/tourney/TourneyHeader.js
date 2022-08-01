import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ReactComponent as GoBackIcon }  from '../../images/go-back.svg';

import { ReactComponent as AddUserIcon }  from '../../images/add-user.svg';

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  box-sizing: border-box;
  font-size: 16px;
  position: relative;
  z-index: 4;
  justify-content: center;
  color: ${props => props.theme.primaryColor};
  font-weight: bold;
  flex: 1;
  opacity: ${props => props.modalActive ? 0.2 : 1};

  // background: ${props => props.theme.secondaryColor};
  height: 100px;
  align-items: center;
  border-bottom-right-radius: 50px;
  border-bottom-left-radius: 50px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
`;

const Button = styled.button`
  position: absolute;
  display: block;
  background: none;
  border: none;
  cursor: inherit;
  &.go-back {
    padding: 0;
    left: 16px;
    text-decoration: none;
    box-sizing: border-box;
    border-radius: 6px;
  }
  &.add-user-icon {
    right: 16px;
    display: flex;
    align-items: center;
  }
  &:focus {
    outline: none;
  }
`;

const Title = styled.div`
  font-size: 18px;
`;

const GoBackIconStyled = styled(GoBackIcon)`
  fill: ${props => props.theme.primaryColor};
  padding: 10px;
`;
const AddUserIconStyled = styled(AddUserIcon)`
  fill: ${props => props.theme.primaryColor};
`;

function TourneyHeader({ title, modalActive, setShowModal }) {
  return (
    <Header modalActive={modalActive}>
      <HeaderWrapper>
      <Button className="go-back">
        <Link style={{display: "flex"}} to="/tournaments">
          <GoBackIconStyled fill="#ffffffdb" title="go back" width="16" height="16"/>
        </Link>
      </Button>
      <Title>{title}</Title>
      <Button className="add-user-icon">
        <AddUserIconStyled fill="#ffffffdb" width="32" height="32" onClick={() => setShowModal(true)}title="Add friend"/>
      </Button>
      </HeaderWrapper>
    </Header>
  )
}

export default TourneyHeader;