import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const SidebarContainer = styled.nav`
  position: absolute;
  top: 0;
  left: 0;
  width: 250px;
  height: 100%;
  background-color: #ffffff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.isOpen ? '2px 0 10px rgba(0, 0, 0, 0.1)' : 'none'};
  z-index: 900;
  transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  
  h2 {
    margin: 0;
    font-size: 1.1rem;
    color: #525252;
    font-weight: 600;
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const MenuItems = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0 0;
`;

const MenuItem = styled.li`
  margin-bottom: 0.25rem;
  
  a {
    display: flex;
    align-items: center;
    padding: 1rem 1.5rem;
    color: #525252;
    text-decoration: none;
    transition: all 0.2s ease;
    border-left: 4px solid transparent;
    font-weight: 500;
    
    &:hover {
      background-color: #e8f1ff;
      color: #0f62fe;
      transform: translateX(4px);
    }
    
    &.active {
      background-color: #d0e2ff;
      color: #0f62fe;
      border-left-color: #0f62fe;
      font-weight: 600;
    }
    
    svg {
      margin-right: 1rem;
      min-width: 20px;
      transition: transform 0.2s ease;
    }
    
    &:hover svg {
      transform: scale(1.1);
    }
  }
`;

const SidebarFooter = styled.div`
  width: 100%;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0e0e0;
  font-size: 0.8rem;
  color: #6f6f6f;
  background-color: #f8f8f8;
  text-align: center;
`;

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  
  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarHeader>
        <h2>Navigation</h2>
      </SidebarHeader>
    
      <SidebarContent>
        <MenuItems>
          <MenuItem>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
              Dashboard
            </Link>
          </MenuItem>
          <MenuItem>
            <Link to="/encrypt" className={location.pathname === '/encrypt' ? 'active' : ''}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              Text Encryption
            </Link>
          </MenuItem>
          <MenuItem>
            <Link to="/decrypt" className={location.pathname === '/decrypt' ? 'active' : ''}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/>
              </svg>
              Text Decryption
            </Link>
          </MenuItem>
          <MenuItem>
            <Link to="/file-encryption" className={location.pathname === '/file-encryption' ? 'active' : ''}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-2 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm1-9h-2V3h2v6z"/>
              </svg>
              File Encryption
            </Link>
          </MenuItem>
        </MenuItems>
      </SidebarContent>
      
      <SidebarFooter>
        Data Encryption Assessment Tool
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar; 