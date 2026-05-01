import styled from 'styled-components';
import Input from './ui/Input.jsx';
import Modal from './ui/Modal.jsx';
import Button from './ui/Button.jsx';
import { useRegisterMutation } from '../store/api/authApi.js';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  matchHelper,
  required,
  validate,
  validEmail,
} from '../utils/validation.js';
import { useActionState } from 'react';

const RegisterModal = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const submitAction = async (prevState, formData) => {
    const formValues = Object.fromEntries(formData.entries());
    const errors = validate(formValues, {
      email: [
        [required, 'Введіть електронну адресу'],
        [validEmail, 'Введіть коректну електронну адресу'],
      ],
      lastName: [[required, 'Введіть прізвище']],
      firstName: [[required, "Введіть ім'я"]],
      password: [[required, 'Введіть пароль']],
      'confirm-password': [
        [required, 'Підтвердіть пароль'],
        [matchHelper(formValues.password), 'Паролі не співпадають'],
      ],
      group: [[required, 'Введіть групу']],
    });
    if (Object.keys(errors).length > 0) {
      return { values: formValues, errors };
    }

    try {
      const { email, lastName, firstName, password, group } = formValues;
      await register({
        email,
        password,
        lastName,
        firstName,
        group,
        inviteCode: formValues['invite-code']
          ? formValues['invite-code']
          : undefined,
      }).unwrap();

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
  const [{ values, errors }, formAction] = useActionState(submitAction, {
    values: {},
    errors: null,
  });
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={<HeadingH4>Створити акаунт</HeadingH4>}
    >
      <form action={formAction} style={{ display: 'contents' }}>
        <NameInputsContainer>
          <Input
            label="Прізвище"
            id="register-last-name"
            name="lastName"
            defaultValue={values.lastName || ''}
            error={errors?.lastName}
            autoComplete="family-name"
          />
          <Input
            label="Ім'я"
            id="register-first-name"
            name="firstName"
            defaultValue={values.firstName || ''}
            error={errors?.firstName}
            autoComplete="given-name"
          />
        </NameInputsContainer>
        <FieldGroup>
          <Input
            label="Електронна пошта"
            id="register-email"
            name="email"
            defaultValue={values.email || ''}
            error={errors?.email}
            autoComplete="email"
            type="email"
          />

          <Input
            label="Пароль"
            id="register-password"
            name="password"
            defaultValue={values.password || ''}
            error={errors?.password}
            autoComplete="new-password"
            type="password"
          />
          <Input
            label="Підтвердіть пароль"
            id="registerconfirm-password"
            name="confirm-password"
            defaultValue={values['confirm-password'] || ''}
            error={errors?.['confirm-password']}
            type="password"
          />
        </FieldGroup>

        <GroupAndInviteCodeContainer>
          <Input
            label="Група"
            id="register-group"
            name="group"
            defaultValue={values.group || ''}
            error={errors?.group}
          />

          <Input
            label="Код запрошення(староста)"
            id="register-invite-code"
            name="invite-code"
            defaultValue={values['invite-code'] || ''}
            error={errors?.['invite-code']}
          />
        </GroupAndInviteCodeContainer>
        <FieldGroup>
          <Button type="submit" disabled={isLoading}>
            {!isLoading ? 'Створити акаунт' : 'Створення акаунта...'}
          </Button>
          {errors?.server && <ErrorText>{errors?.server}</ErrorText>}
        </FieldGroup>
      </form>
    </Modal>
  );
};
const HeadingH4 = styled.h4`
  font-size: var(--desktop-headings-h4);
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const NameInputsContainer = styled.div`
  display: inline-grid;
  row-gap: 1rem;
  column-gap: 1rem;
  align-self: stretch;
  grid-template-columns: repeat(2, minmax(0, 1fr));
`;
const GroupAndInviteCodeContainer = styled.div`
  display: inline-grid;
  column-gap: 1rem;
  align-self: stretch;
  grid-template-columns: 1fr 1.5fr;
`;
const ErrorText = styled.p`
  font-size: 0.8rem;
  color: var(--brick-red-100);
  text-align: center;
`;
export default RegisterModal;
