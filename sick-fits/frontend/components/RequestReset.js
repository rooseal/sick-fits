import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Form from './styles/Form';

import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      message
      code
    }
  }
`;

export default function RequestReset() {
  const { form, handleChange, resetForm } = useForm({
    email: '',
  });

  const [signup, { data, error, loading }] = useMutation(
    REQUEST_RESET_MUTATION,
    {
      variables: form,
      // Refetch the currently sign in user
      // refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  async function handleSubmit(event) {
    event.preventDefault();

    const res = await signup().catch((err) => console.error(err));
    resetForm();
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <DisplayError error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        {data?.sendUserPasswordResetLink === null && (
          <p>Success! Check your email for a link!</p>
        )}
        <h2>Request a password reset</h2>
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
        <button type="submit">Request Reset</button>
      </fieldset>
    </Form>
  );
}
