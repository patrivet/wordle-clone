import React from 'react';
import styled from '@emotion/styled';
import { useAppActions, AppStateContext } from '../state/reducer';

const KeyboardContainer = styled.div`
  padding: 1rem
  background: white
  border-radius: 0.75rem
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06)
  max-width: 48rem
  margin: 0 auto;
  display flex;
  align-items: center;
`;

const Row = styled.div`
  display: flex
  justify-content: center
  gap: 0.5rem
  &:not(:last-child) {
    margin-bottom: 0.5rem
  }
`;

const Key = styled.button<{ isEnter: boolean }>`
  font-size: 20px;
  background-color: #e2e8f0
  border: none
  border-radius: 0.5rem
  color: black
  font-weight: bold
  height: 3rem
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  transition: background-color 0.2s
  width: ${props => (props.isEnter ? '6rem' : '3rem')}

  &:hover {
    background-color: #cbd5e1
  }
`;

const Keyboard = ({ onKeyClick }) => { // TODO: receive or read state: for the letter colours - state.PuzzlePlay.lettersGrey etc
  const topRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const middleRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const bottomRow = ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<'];

  const renderKey = (key: string) => (
    <Key
      key={key}
      isEnter={key === 'ENTER'}
      onClick={() => onKeyClick(key, (key === 'ENTER' || key === '<') ? false : true)}
    >
      {key}
    </Key>
  );

  return (
    <KeyboardContainer>
      <Row>{topRow.map(renderKey)}</Row>
      <Row>{middleRow.map(renderKey)}</Row>
      <Row>{bottomRow.map(renderKey)}</Row>
    </KeyboardContainer>
  );
};

export default Keyboard;
