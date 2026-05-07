import styled, { css } from 'styled-components';

const sizes = {
  lg: css`
    width: 4rem;
    height: 4rem;
      font-size : var(--desktop-headings-h4);
  `,
  sm: css`
    width: 2.5rem;
    height: 2.5rem;
    font-size: var(--desktop-headings-h7);
  `,
};

const ProfilePicture = ({ size = 'sm', initials }) => {
  return <Avatar $size={size}>{initials.toUpperCase()}</Avatar>;
};

const Avatar = styled.div`
    flex-shrink: 0; /* ← додай це */
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: var(--base-bright-grey);
    color: var(--base-black);
    ${({ $size }) => sizes[$size] || sizes.sm}
`;

export default ProfilePicture;
