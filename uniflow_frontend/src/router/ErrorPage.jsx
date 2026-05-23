import styled from 'styled-components';
import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Button from '../components/ui/Button.jsx';
import CompassIcon from '../assets/CompassBig.svg?react';
import ErrorIcon from '../assets/ErrorBig.svg?react';

function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = 'Сталася помилка!';
  let message = 'Щось пішло не так. Спробуйте пізніше.';
  let code = '500';
  let is404 = false;

  if (isRouteErrorResponse(error)) {
    code = error.status.toString();
    is404 = error.status === 404;
    
    if (is404) {
      title = 'Ой, ви заблукали';
      message = 'Перевірте посилання або поверніться назад.';
    } else {
      title = 'Сервер відпочиває';
      if (typeof error.data === 'string') {
        try {
          message = JSON.parse(error.data).message || error.data;
        } catch {
          message = error.data;
        }
      } else if (error.data?.message) {
        message = error.data.message;
      }
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  const handleAction = () => {
    if (is404) {
      navigate('/');
    } else {
      window.location.reload();
    }
  };

  return (
    <LayoutContainer>
      <Sidebar />
      <MainArea>
        <ErrorContainer>
          <IconCircle>
            {is404 ? (
              <CompassIcon width="6rem" height="6rem" />
            ) : (
              <ErrorIcon width="6rem" height="6rem" />
            )}
          </IconCircle>
          
          <ErrorCode>{code}</ErrorCode>
          
          <ErrorTitle>{title}</ErrorTitle>
          
          <ErrorDescription>{message}</ErrorDescription>

          <ActionButton 
            variant="primary" 
            onClick={handleAction}
          >
            {is404 ? 'Повернутися на головну сторінку' : 'Перезавантажити сторінку'}
          </ActionButton>
        </ErrorContainer>
      </MainArea>
    </LayoutContainer>
  );
}

const LayoutContainer = styled.div`
  display: grid;
  grid-template-columns: 258px 1fr;
  min-height: 100dvh;
  background: var(--base-white, #fff);
`;

const MainArea = styled.main`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 4rem;
  border: 2px dashed var(--base-secondary-text, #6b6b6b);
  border-radius: 1.25rem;
  max-width: 60rem;
  width: 100%;
  text-align: center;

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const IconCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 9rem;
  height: 9rem;
  background: var(--base-bright-grey, #e7eef3);
  border-radius: 100px;
  flex-shrink: 0;

  svg {
    color: var(--base-black, #000);
  }
`;

const ErrorCode = styled.h1`
  font-size: 8rem;
  font-family: 'e-Ukraine', sans-serif;
  font-weight: 500;
  line-height: 1.2;
  margin: 0;
  color: var(--base-black, #000);

  @media (max-width: 768px) {
    font-size: 5rem;
  }
`;

const ErrorTitle = styled.h2`
  font-size: 3.5rem;
  font-family: 'e-Ukraine', sans-serif;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: -0.07rem;
  margin: 0;
  color: var(--base-black, #000);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ErrorDescription = styled.p`
  font-size: 1.5rem;
  font-family: 'e-Ukraine', sans-serif;
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: -0.007rem;
  margin: 0;
  color: var(--base-black, #000);

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const ActionButton = styled(Button)`
  margin-top: 1rem;
  width: 100%;
  max-width: 32rem;
  padding: 1rem 2rem !important;
  font-size: 1.125rem !important;
`;

export default ErrorPage;
