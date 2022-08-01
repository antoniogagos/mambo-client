import React from 'react';
import styled from 'styled-components';

function Field() {
  return (
    <FieldWrapper>
      <AwayArea>
        <SemicircleArea/>
        <PenaltyArea>
          <GoalArea/>
        </PenaltyArea>
      </AwayArea>
      <Midfield>
        <MidfieldLine/>
        <MidfieldCircle/>
      </Midfield>
      <HomeArea>
        <SemicircleArea/>
        <PenaltyArea>
          <GoalArea/>  
        </PenaltyArea>
      </HomeArea>
    </FieldWrapper>
  )
}

const FieldWrapper = styled.div`
  box-shadow: ${props => props.theme.fieldShadow};
  background: ${props => props.theme.field};
  border-radius: 6px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 81%;
  justify-content: space-between;
  position: absolute;
  top: 0;
  transform: rotateX(15deg);
  width: 100%;
  box-sizing: border-box;
  max-height: 67vh;
  @media (max-height: 750px) {
    height: 85.5%;
  }
  @media (max-height: 640px) {
    height: 88.5%;
  }
  @media (min-width: ${props => props.theme.mediaQueryWidth}) {
    height: calc(100% - 110px);
  }
`;

const HomeArea = styled.div`
  position: relative;
`;

const Midfield = styled.div`
  position: relative;
`;

const MidfieldCircle = styled.div`
  height: 70px;
  width: 70px;
  border: 4px solid ${props => props.theme.fieldLines};
  border-radius: 100%;
  position: absolute;
  top: -38px;
  margin: 0 auto;
  left: 0;
  right: 0;
  background: ${props => props.theme.field};
`;

const MidfieldLine = styled.div`
  height: 4px;
  width: 100%;
  background: ${props => props.theme.fieldLines};
  margin: auto 0;
`;

const PenaltyArea = styled.div`
  height: 50px;
  width: 50%;
  margin: 0 auto;
  border: 4px solid ${props => props.theme.fieldLines};
  border-bottom: none;
  position: relative;
  display: flex;
`;

const GoalArea = styled.div`
  width: 65px;
  margin: 0 auto;
  border: 4px solid ${props => props.theme.fieldLines};
  border-bottom: none;
  height: 15px;
  margin-top: auto;
`;

const SemicircleArea = styled.div`
  margin: 0 auto;
  height: 12px;
  width: 72px;
  border: 4px solid ${props => props.theme.fieldLines};
  border-top-left-radius: 100% 200%;
  border-top-right-radius: 100% 200%;
  border-bottom: none;
`;

const AwayArea = styled.div`
  transform: rotate(180deg);
`;


export default Field;