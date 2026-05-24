import styled, { css } from 'styled-components';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  variant = 'medium',
  className,
}) => {
  return (
    <Container $variant={variant} className={className}>
      {Icon && (
        <IconWrapper $variant={variant}>
          <Icon />
        </IconWrapper>
      )}
      <Content>
        <Title $variant={variant}>{title}</Title>
        {description && <Description>{description}</Description>}
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  border: 2px dashed var(--base-bright-grey);
  border-radius: 1.25rem;
  background: transparent;
  text-align: center;

  ${({ $variant }) =>
    $variant === 'large'
      ? css`
          padding: 4rem;
          gap: 1.5rem;
        `
      : css`
          padding: 2rem;
          gap: 1rem;
        `}
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--base-bright-grey);
  border-radius: 50%;
  flex-shrink: 0;

  ${({ $variant }) =>
    $variant === 'large'
      ? css`
          width: 8rem;
          height: 8rem;
          padding: 1rem;
          svg {
            width: 6rem;
            height: 6rem;
          }
        `
      : css`
          width: 4rem;
          height: 4rem;
          padding: 1rem;
          svg {
            width: 3rem;
            height: 3rem;
          }
        `}
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 500px;
`;

const Title = styled.h2`
  color: var(--base-black);
  font-family: 'e-Ukraine', sans-serif;
  font-weight: 400;
  margin: 0;

  ${({ $variant }) =>
    $variant === 'large'
      ? css`
          font-size: var(--desktop-headings-h3);
          line-height: 2rem; /* 32px */
          letter-spacing: -0.035rem;
        `
      : css`
          font-size: var(--desktop-headings-h5);
          line-height: 1.5rem; /* 24px */
          letter-spacing: -0.025rem;
        `}
`;

const Description = styled.p`
  color: var(--base-black);
  font-family: 'e-Ukraine', sans-serif;
  font-size: var(--desktop-headings-h5);
  font-weight: 300;
  line-height: 1.5rem; /* 24px */
  margin: 0;
  letter-spacing: -0.025rem;
`;

export default EmptyState;
