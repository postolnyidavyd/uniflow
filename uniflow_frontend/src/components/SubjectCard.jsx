import { LastUpdatedAtBadge } from './LastUpdatedAtBadge.jsx';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export const SubjectCard = ({ id, imgUrl, name, lecturer, lastUpdatedAt }) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(`/subjects/${id}`);
  return (
    <CardContainer onClick={handleClick}>
      <img src={imgUrl} alt={name} />
      <CardContent>
        <LeftSide>
          <p>Викладач</p>
          <h6>{lecturer}</h6>
        </LeftSide>
        <LastUpdatedAtBadge lastUpdatedAt={lastUpdatedAt} />
      </CardContent>
    </CardContainer>
  );
};

const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
  h6 {
    color: var(--base-black, #000);
    font-size: 1.125rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.75rem; /* 155.556% */
    letter-spacing: -0.0225rem;
  }
  p {
    color: var(--base-secondary-text, #6b6b6b);

    font-size: 0.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem; /* 133.333% */
    letter-spacing: -0.015rem;
  }
`;
const CardContent = styled.div`
  display: flex;
  height: 4.375rem;
  padding: 0.625rem;
  justify-content: space-between;
  align-items: center;
  align-self: start;
  grid-row: 2 / span 1;
  grid-column: 1 / span 1;
  justify-self: stretch;
`;
const CardContainer = styled.div`
    display: grid;
    height: 23.25rem;
    align-self: start;
    grid-template-rows: minmax(0, 4fr) minmax(0, 1fr);
    grid-template-columns: repeat(1, minmax(0, 1fr));
    justify-self: stretch;

    border-radius: 1.25rem;
    border: 1.901px solid var(--base-bright-grey, #e7eef3);
    overflow: hidden;
    cursor: pointer;

    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        border-color: transparent;
    }

    &:hover img {
        transform: scale(1.03);
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }
`;
