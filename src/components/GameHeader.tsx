import styled from '@emotion/styled';
import Settings from '../assets/svgs/Settings';
import Statistics from '../assets/svgs/Statistics';

const Header = styled.header`
  align-items: center;
  border-bottom: 1px solid #d3d6da;
  display: grid;
  flex: 0 0 52px;
  grid-template-columns: 40px 1fr 40px;
  padding: 0 8px;
`;

const Title = styled.h1`
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 28px;
  letter-spacing: 0.01em;
  margin: 0;
  text-align: center;
`;

const HeaderButton = styled.button`
  align-items: center;
  background: none;
  border: 0;
  border-radius: 4px;
  color: #000;
  cursor: pointer;
  display: flex;
  height: 40px;
  justify-content: center;
  padding: 0;
  width: 40px;

  &:focus-visible {
    outline: 2px solid #000;
    outline-offset: 2px;
  }
`;

type GameHeaderProps = {
  onOpenSettings: () => void;
  onOpenStatistics: () => void;
  statisticsAvailable: boolean;
};

const GameHeader = ({
  onOpenSettings,
  onOpenStatistics,
  statisticsAvailable,
}: GameHeaderProps) => (
  <Header>
    {statisticsAvailable ? (
      <HeaderButton
        aria-haspopup="dialog"
        aria-label="Statistics"
        onClick={onOpenStatistics}
        type="button"
      >
        <Statistics />
      </HeaderButton>
    ) : (
      <span aria-hidden="true" />
    )}
    <Title>Wordle</Title>
    <HeaderButton
      aria-haspopup="dialog"
      aria-label="Settings"
      onClick={onOpenSettings}
      type="button"
    >
      <Settings />
    </HeaderButton>
  </Header>
);

export default GameHeader;
