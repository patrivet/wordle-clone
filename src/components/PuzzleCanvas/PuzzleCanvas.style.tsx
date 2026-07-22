import styled from '@emotion/styled';

export const GuessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 360px;
  justify-content: center;
  margin: 0 auto;
  padding: 10px;
  row-gap: 5px;
  width: 300px;
`;

export const OverlayWrapper = styled.div`
  display: flex;
  justify-content: center;
  left: 0;
  pointer-events: none;
  position: absolute;
  top: 10%;
  width: 100%;
  z-index: 10;
`;

export const OverlayMessage = styled.div`
  background-color: black;
  border-radius: 7px;
  color: white;
  display: flex;
  justify-content: center;
  padding: 14px;
`;

export const DebugAnswer = styled.div`
  align-self: center;
  background: #f3f3f3;
  border-radius: 4px;
  color: #555;
  font-family: sans-serif;
  font-size: 12px;
  font-weight: normal;
  margin-top: 8px;
  padding: 4px 8px;
`;
