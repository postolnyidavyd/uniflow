import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';

const ErrorPage = () => {
  const error = useRouteError();

  let title = 'Сталася помилка!';
  let message = 'Щось пішло не так. Спробуйте пізніше.';
  let status = 'Помилка';

  if (isRouteErrorResponse(error)) {
    status = error.status;
    title = error.statusText || title;

    if (typeof error.data === 'string') {
      try {
        message = JSON.parse(error.data).message || error.data;
      } catch {
        message = error.data;
      }
    } else if (error.data?.message) {
      message = error.data.message;
    }

    if (error.status === 404) {
      title = 'Ой, ви заблукалися';
      message = 'Перевірте посилання або поверніться назад.';
    } else if (error.status === 500) {
      title = 'Сервер відпочиває';
      message = 'Спробуйте знову через деякий час.';
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div>
      <Sidebar />
      <div>
        <h1>{status}</h1>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorPage;