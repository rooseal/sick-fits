import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';

import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import DisplayError from './ErrorMessage';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    authenticateUserWithPassword(email: $email, password: $password) {
      ... on UserAuthenticationWithPasswordSuccess {
        sessionToken
        item {
          id
          email
          name
        }
      }
      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;

export default function SignIn() {
  const { form, handleChange, resetForm } = useForm({
    email: '',
    password: '',
  });

  const [signin, { data, error, loading }] = useMutation(SIGNIN_MUTATION, {
    variables: form,
    // Refetch the currently sign in user
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  async function handleSubmit(event) {
    event.preventDefault();

    const res = await signin();
    resetForm();
  }

  const loginError =
    data?.authenticateUserWithPassword.__typename ===
    'UserAuthenticationWithPasswordFailure'
      ? data?.authenticateUserWithPassword
      : undefined;

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <DisplayError error={error || loginError} />
      <fieldset disabled={loading} aria-busy={loading}>
        <h2>Sign into your account</h2>
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
        <button type="submit">Sign In</button>
      </fieldset>
    </Form>
  );
}
