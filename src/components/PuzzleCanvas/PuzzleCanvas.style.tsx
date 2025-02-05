import styled from '@emotion/styled';

export const GuessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 5px;
  height: 360px;
  width: 300px;
  margin: 0 auto;
  padding: 10px;
`;
GuessWrapper.displayName = 'GuessWrapper';

export const OverlayWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  z-index: 100;
`;
OverlayWrapper.displayName = 'OverlayWrapper';

export const OverlayMessage = styled.div`
  color: white;
  background-color: black;
  padding: 14px;
  border-radius: 7px;
`;
OverlayMessage.displayName = 'OverlayMessage';
