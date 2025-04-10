import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #0f62fe;
  background: linear-gradient(90deg, #0f62fe 0%, #0043ce 100%);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  height: 64px;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  letter-spacing: 0.5px;
  
  span {
    margin-left: 0.8rem;
  }
  
  @media (max-width: 576px) {
    font-size: 1.2rem;
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: transform 0.2s ease, background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
  }
`;

const LogoSvg = styled.svg`
  filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.2));
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
`;

const Header = ({ toggleSidebar }) => {
  return (
    <HeaderContainer>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <MenuButton onClick={toggleSidebar} aria-label="Toggle sidebar">
          ☰
        </MenuButton>
        <Logo>
          <LogoSvg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v5.7c0 4.83-3.4 9.12-7 10.18-3.6-1.06-7-5.35-7-10.18V6.3l7-3.12z"/>
            <path d="M11 7h2v6h-2zm0 8h2v2h-2z"/>
          </LogoSvg>
          <span>Data Encryption Assessment</span>
        </Logo>
      </div>
      <RightSection />
    </HeaderContainer>
  );
};

export default Header; 