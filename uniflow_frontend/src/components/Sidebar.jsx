import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import Logo from '../assets/Logo.svg?react';
import Calendar from '../assets/Calendar.svg?react';
import Users from '../assets/Users.svg?react';
import Book from '../assets/Book.svg?react';
import Settings from '../assets/Settings.svg?react';
import ProfilePicture from './ui/ProfilePicture.jsx';
import {
  selectUserFirstName,
  selectUserLastName,
} from '../store/selectors/authSelector.js';
import { useSelector } from 'react-redux';
import TokenBalanceBadge from './TokenBalanceBadge.jsx';
function Sidebar() {
  const balance = 3; // TODO: використати api як з'явиться ендпоінт на беку
  const firstName = useSelector(selectUserFirstName);
  const lastName = useSelector(selectUserLastName);
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`;
  return (
    <SidebarContainer>
      <TopSection>
        <Logo width={'4rem'} height={'4rem'} />
        <LinksContainer>
          <StyledNavLink to="/">
            <Calendar width={'1.5rem'} height={'1.5rem'} />
            Календар
          </StyledNavLink>
          <StyledNavLink to="/queues">
            <Users width={'1.5rem'} height={'1.5rem'} />
            Черги
          </StyledNavLink>
          <StyledNavLink to="/subjects">
            <Book width={'1.5rem'} height={'1.5rem'} />
            Предмети
          </StyledNavLink>
          <StyledNavLink to="/settings">
            <Settings width={'1.5rem'} height={'1.5rem'} />
            Налаштування
          </StyledNavLink>
        </LinksContainer>
      </TopSection>
      <BottomSection>
        <ProfilePicture size={'sm'} initials={initials} />
        <NameContainer>
          <span>{lastName}</span>
          <span>{firstName}</span>
        </NameContainer>
        <TokenBalanceBadge balance={balance}/>
      </BottomSection>
    </SidebarContainer>
  );
}
const SidebarContainer = styled.aside`
  display: flex;
  height: 100%;

  padding: 2.5rem 1.5rem;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  background-color: var(--accent-color);
`;
const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2.5rem;
  align-self: stretch;
`;
const LinksContainer = styled.div`
  display: flex;
  padding: 0.3125rem 0;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.75rem;
  align-self: stretch;
`;
const StyledNavLink = styled(NavLink)`
  display: flex;
  padding: 0.5rem 0.75rem;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;
  border-radius: 0.75rem;
  text-decoration: none;

  color: rgba(255, 255, 255, 0.75);
  font-size: var(--desktop-headings-h7);
  font-weight: 300;

  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 1);
  }

  &.active {
    background: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 1);
    font-weight: 500;
  }

  &.active:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const BottomSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  gap: 0.625rem;
`;
const NameContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  color: var(--base-white);
  font-size: var(--desktop-headings-h7);
`;

export default Sidebar;
