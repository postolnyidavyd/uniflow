import styled from 'styled-components';
import ArrowLeftIcon from '../../assets/Arrow Left.svg?react';
import ArrowRightIcon from '../../assets/Arrow Right.svg?react';

const getPageNumbers = (currentPage, totalPages) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [];

  pages.push(1);

  if (currentPage > 3) pages.push('...');

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) pages.push('...');

  pages.push(totalPages);

  return pages;
};

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <PaginationWrapper>
      <NavButton
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Попередня сторінка"
      >
        <ArrowLeftIcon width="1.25rem" height="1.25rem" />
      </NavButton>

      {pages.map((p, index) =>
        p === '...' ? (
          <Dots key={`dots-${index}`}>…</Dots>
        ) : (
          <PageButton
            key={p}
            $active={p === page}
            onClick={() => onPageChange(p)}
          >
            {p}
          </PageButton>
        )
      )}

      <NavButton
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Наступна сторінка"
      >
        <ArrowRightIcon width="1.25rem" height="1.25rem" />
      </NavButton>
    </PaginationWrapper>
  );
};

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem 0;
`;

const BaseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  border: 1.901px solid transparent;
  cursor: pointer;
  font-size: var(--desktop-headings-h7);
  font-weight: 400;
  line-height: 1.5rem;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const PageButton = styled(BaseButton)`
  min-width: 2.25rem;
  height: 2.25rem;
  padding: 0 0.5rem;
  background-color: ${({ $active }) =>
    $active ? 'var(--base-black)' : 'transparent'};
  color: ${({ $active }) =>
    $active ? 'var(--base-white)' : 'var(--base-black)'};
  border-color: ${({ $active }) =>
    $active ? 'var(--base-black)' : 'var(--base-bright-grey)'};

  &:hover:not(:disabled) {
    border-color: ${({ $active }) =>
      $active ? 'var(--base-black)' : 'var(--grey-40)'};
    background-color: ${({ $active }) =>
      $active ? 'var(--base-black)' : 'var(--base-very-bright-grey)'};
  }
`;

const NavButton = styled(BaseButton)`
  width: 2.25rem;
  height: 2.25rem;
  border-color: var(--base-bright-grey);
  color: var(--base-black);
  background-color: transparent;

  svg path {
    fill: var(--base-black);
  }

  &:hover:not(:disabled) {
    background-color: var(--base-very-bright-grey);
    border-color: var(--grey-40);
  }
`;

const Dots = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.25rem;
  height: 2.25rem;
  color: var(--base-secondary-text);
  font-size: var(--desktop-headings-h7);
  user-select: none;
`;

export default Pagination;
