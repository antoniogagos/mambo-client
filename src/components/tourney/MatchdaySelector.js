import React, { useRef, useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { TourneyContext } from '../../pages/TourneyPage';

function MatchdaySelector({ changeMatchday, selectedMatchday }) {
  const { tourney } = useContext(TourneyContext);
  const [totalMatchdays, setTotalMatchdays] = useState([]);
  const selectEl = useRef(null);

  useEffect(_ => {
    const matchdays = [];
    for (let i = tourney.sinceMatchday; i <= tourney.currentMatchday; i++) {
      matchdays.push(i);
    }
    setTotalMatchdays(matchdays);
  }, [tourney.tourneyId]);

  const options = totalMatchdays.sort(( a, b) => b - a).map(matchday => <option key={matchday}>{matchday}</option>);

  const onChangeMatchday = () => {
    changeMatchday(Number(selectEl.current.value));
  }

  return (
    <Wrapper>
      <Label onClick={_ => selectEl.current.focus()} html-for="select">Gameweek {selectedMatchday}</Label>
      <Select id="select" ref={selectEl} onChange={onChangeMatchday}>{options}</Select>
    </Wrapper>
  )
}

const Select = styled.select`
  background: none;
  border: none;
  font-family: inherit;
  font-size: inherit;
  color: #232323;
  cursor: inherit;
  padding: 6px;
  appearance: none;
  position: absolute;
  left: 0;
  width: 100%;
  opacity: 0;
  height: 100%;
  > * {
    cursor: inherit;
  }
  &:focus {
    outline: none;
  }
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
`;

const Label = styled.label`
  cursor: inherit;
  margin-top: 20px;
`;


export default MatchdaySelector;