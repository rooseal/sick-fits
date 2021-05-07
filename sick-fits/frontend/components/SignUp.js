import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';

import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import DisplayError from './ErrorMessage';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    createUser(data: { email: $email, name: $name, password: $password }) {
      id
      email
      name
    }
  }
`;

export default function SignUp() {
  const { form, handleChange, resetForm } = useForm({
    email: '',
    name: '',
    password: '',
  });

  const [signup, { data, error, loading }] = useMutation(SIGNUP_MUTATION, {
    variables: form,
    // Refetch the currently sign in user
    // refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  async function handleSubmit(event) {
    event.preventDefault();

    const res = await signup().catch((err) => console.error(err));
    resetForm();
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <DisplayError error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        {data?.createUser && (
          <p>
            You have successfully sign up for your account with{' '}
            {data.createUser.email}. Go ahead and sign in.
          </p>
        )}
        <h2>Sign Up for your account</h2>
        <label htmlFor="name">
          Name
          <input
            type="text"
            name="name"
            placeholder="Your name"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
          />
        </label>
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
