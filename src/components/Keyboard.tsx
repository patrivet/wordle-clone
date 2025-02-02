import styled from '@emotion/styled';

const KeyboardContainer = styled.div`
  // padding: 1rem;
  // background: white;
  // border-radius: 0.75rem;
  // box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
  //   0 2px 4px -1px rgba(0, 0, 0, 0.06);
  // max-width: 48rem;
  // margin: 0 auto;
  display flex;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  &:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`;

const Key = styled.button<{ isEnter: boolean }>`
  font-size: 20px;
  background-color: #d3d6da;
  border: none;
  border-radius: 4px;
  color: black;
  font-weight: bold;
  height: 58px;
  max-width: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  width: ${props => (props.isEnter ? '6rem' : '3rem')};

  &:hover {
    background-color: #cbd5e1;
  }
`;

const Keyboard = ({ onKeyClick }) => {
  // TODO: receive or read state: for the letter colours - state.PuzzlePlay.lettersGrey etc
  const deleteKey = (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      height="20"
      viewBox="0 0 24 24"
      width="20"
      className="game-icon"
      data-testid="icon-backspace"
    >
      <path
        fill="var(--color-tone-1)"
        d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
      ></path>
    </svg>
  );
  const topRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const middleRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const bottomRow = ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<<'];

  const renderKey = (key: string) => (
    <Key
      key={key}
      isEnter={key === 'ENTER'}
      onClick={() =>
        onKeyClick(key, key === 'ENTER' || key === '<' ? false : true)
      }
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
