import styled from '@emotion/styled';

export const GuessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 5px;
  height: 360px;
  width: 300px;
  margin: 0 auto;
  padding: 10px;
`;
GuessWrapper.displayName = 'GuessWrapper';

export const OverlayWrapper = styled.div<{ messageLen: number }>`
  position: absolute;
  top: 10%;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;
OverlayWrapper.displayName = 'OverlayWrapper';

export const OverlayMessage = styled.div`
  display: flex;
  justify-content: center;
  color: white;
  background-color: black;
  padding: 14px;
  border-radius: 7px;
`;
OverlayMessage.displayName = 'OverlayMessage';
