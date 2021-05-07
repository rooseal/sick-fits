import PropTypes from 'prop-types';
import { gql, useMutation } from '@apollo/client';
import DisplayError from './ErrorMessage';
import Form from './styles/Form';
import useForm from '../lib/useForm';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $email: String!
    $password: String!
    $token: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      token: $token
      password: $password
    ) {
      message
      code
    }
  }
`;

export default function Reset({ token }) {
  const { form, handleChange, resetForm } = useForm({
    email: '',
    token,
    password: '',
  });

  const [reset, { data, error }] = useMutation(RESET_MUTATION, {
    variables: form,
    // Refetch the currently sign in user
    // refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  const successfulError = data?.redeemUserPasswordResetToken?.code
    ? data.redeemUserPasswordResetToken
    : undefined;

  async function handleSubmit(event) {
    event.preventDefault();

    const res = await reset().catch((err) => console.error(err));
    resetForm();
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Reset your password</h2>
      <DisplayError error={error || successfulError} />
      <fieldset>
        {data?.redeemUserPasswordResetToken === null && (
          <p>Success! You can now sign in</p>
        )}
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={form.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Request Reset</button>
      </fieldset>
    </Form>
  );
}

Reset.propTypes = {
  token: PropTypes.string.isRequired,
};
