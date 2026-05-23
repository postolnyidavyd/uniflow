import styled from 'styled-components';
import Input from '../ui/inputs/Input.jsx';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import { useLoginMutation } from '../../store/api/authApi.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { required, validate, validEmail } from '../../utils/validation.js';
import { useActionState } from 'react';
import { toast } from '../../utils/toast.js';

const LoginModal = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [login] = useLoginMutation();

  const submitAction = async (prevState, formData) => {
    const formValues = Object.fromEntries(formData.entries());
    const errors = validate(formValues, {
      email: [
        [required, 'Введіть електронну адресу'],
        [validEmail, 'Введіть коректну електронну адресу'],
      ],
      password: [[required, 'Введіть пароль']],
    });

    if (Object.keys(errors).length > 0) {
      return { values: formValues, errors };
    }

    try {
      const { email, password } = formValues;
      await login({
        email,
        password,
      }).unwrap();

      toast.success('Вітаємо! Ви успішно увійшли');
      onClose();
      navigate(location.state?.from || '/');
    } catch (error) {
      if (error.data?.message) {
        errors.server = error.data?.message;
      } else {
        errors.server = 'Невідома помилка спробуйте пізніше';
      }
      return { values: formValues, errors };
    }
  };
  const [{ values, errors }, formAction, isPending] = useActionState(submitAction, {
    values: {},
    errors: null,
  });
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="З поверненням!">
      <form action={formAction} style={{ display: 'contents' }}>
        <Input
          label="Електронна пошта"
          id="login-email"
          name="email"
          defaultValue={values.email || ''}
          error={errors?.email}
          autoComplete="email"
          type="email"
        />

        <Input
          label="Пароль"
          id="login-password"
          name="password"
          defaultValue={values.password || ''}
          error={errors?.password}
          autoComplete="current-password"
          type="password"
        />
        <FieldGroup>
          <Button type="submit" disabled={isPending}>
            {!isPending ? 'Увійти' : 'Зачекайте...'}
          </Button>
          {errors?.server && <ErrorText>{errors?.server}</ErrorText>}
        </FieldGroup>
      </form>
    </Modal>
  );
};


const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const ErrorText = styled.p`
  font-size: 0.8rem;
  color: var(--brick-red-100);
  text-align: center;
`;
export default LoginModal;
