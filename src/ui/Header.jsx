import styled from "styled-components";
import LogOut from "../features/authentication/LogOut";
import HeaderMenu from "./HeaderMenu";
import UserAvatar from "../features/authentication/UserAvatar";

function Header() {
  const StyledHeader = styled.header`
    background-color: var(--color-grey-0);
    padding: 1.2rem 4.2rem;
    border-bottom: 1px solid var(--color-grey-100);
    display: flex;
    gap: 2.4em;
    align-items: center;
    justify-content: end;
  `;
  return (
    <StyledHeader>
      <UserAvatar />
      <HeaderMenu />
    </StyledHeader>
  );
}

export default Header;
