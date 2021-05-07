import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import useForm from '../lib/useForm';
import FormStyles from './styles/Form';
import DisplayError from './ErrorMessage';

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      id
      name
      description
      price
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $name: String
    $description: String
    $price: Int
  ) {
    updateProduct(
      id: $id
      data: { name: $name, description: $description, price: $price }
    ) {
      id
      name
      description
      price
    }
  }
`;

export default function UpdateProduct({ id }) {
  const { data, error, loading } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: {
      id,
    },
  });

  const [
    updateProduct,
    { data: updateData, error: updateError, loading: updateLoading },
  ] = useMutation(UPDATE_PRODUCT_MUTATION);

  const { form, handleChange } = useForm(data?.Product);

  if (loading) return <p>Loading...</p>;

  return (
    <FormStyles
      onSubmit={async (e) => {
        e.preventDefault();
        // Submit the input fields to the backend
        // Instead of using res we can also use the data that would be returned by the useMutation query
        const res = await updateProduct({
          variables: {
            id,
            name: form.name,
            description: form.description,
            price: form.price,
          },
        });
        // Go to the product page
        // Router.push({
        //   pathname: `/product/${res.data.createProduct.id}`,
        // });
      }}
    >
      <DisplayError error={error || updateError} />
      <fieldset disabled={updateLoading} aria-busy={updateLoading}>
        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="name">
          Price
          <input
            type="number"
            id="price"
            name="price"
            placeholder="price"
            value={form.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
        </label>
      </fieldset>
      <button type="submit">UpdateProduct</button>
    </FormStyles>
  );
}

UpdateProduct.propTypes = {
  id: PropTypes.string.isRequired,
};
