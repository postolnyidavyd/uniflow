import styled from 'styled-components';

const SubjectFilterChips = ({ subjects = [], selectedId, onSelect }) => {
  return (
    <ChipsWrapper>
      <Chip $active={!selectedId} onClick={() => onSelect(null)}>
        Всі предмети
      </Chip>

      {subjects.map((subject) => (
        <Chip
          key={subject.id}
          $active={selectedId === subject.id}
          onClick={() => onSelect(subject.id)}
        >
          {subject.name}
        </Chip>
      ))}
    </ChipsWrapper>
  );
};

/* overflow-x: auto прямо на flex-контейнері —
   flex-shrink: 0 на чіпах не дає їм стискатись,
   коли сума ширин > ширини ChipsWrapper → скрол.
   Нема max-content, нема окремого батька — просто працює */
const ChipsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.375rem 0 0.5rem 0;
  overflow-x: auto;
  width: 100%;
  min-width: 0;

  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
`;

const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem 0.75rem;
  border-radius: 0.75rem;
  border: 1.901px solid
    ${({ $active }) =>
      $active ? 'transparent' : 'var(--base-bright-grey, #e7eef3)'};
  background-color: ${({ $active }) =>
    $active ? 'var(--accent-color)' : 'transparent'};
  color: ${({ $active }) =>
    $active ? 'var(--base-white)' : 'var(--base-black)'};
  font-size: var(--desktop-headings-h7);
  font-weight: ${({ $active }) => ($active ? '500' : '400')};
  line-height: 1.5rem;
  letter-spacing: -0.02rem;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    border-color: ${({ $active }) =>
      $active ? 'transparent' : 'var(--grey-40)'};
    background-color: ${({ $active }) =>
      $active ? 'var(--accent-color)' : 'var(--base-very-bright-grey)'};
  }
`;

export default SubjectFilterChips;
