import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Router from 'next/router';
import useForm from '../lib/useForm';
import FormStyles from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { ALL_PRODUCTS_QUERY } from './Products';

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    #which variables are getting passed in and what types are they
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        status: "AVAILABLE"
        photo: { create: { image: $image, altText: $name } }
      }
    ) {
      id
      name
      price
      description
    }
  }
`;

export default function CreateProduct() {
  const { form, handleChange, clearForm } = useForm({
    name: 'Nice shoes',
    price: 2000,
    description: 'These are the best shoes',
    image: '',
  });

  const [createProduct, { error, loading }] = useMutation(
    CREATE_PRODUCT_MUTATION,
    {
      variables: form,
      refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
    }
  );

  return (
    <FormStyles
      onSubmit={async (e) => {
        e.preventDefault();
        // Submit the input fields to the backend
        // Instead of using res we can also use the data that would be returned by the useMutation query
        const res = await createProduct();
        clearForm();
        // Go to the product page
        Router.push({
          pathname: `/product/${res.data.createProduct.id}`,
        });
      }}
    >
      <ErrorMessage error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="image">
          Image
          <input
            required
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
          />
        </label>
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
      <button type="submit">Add Product</button>
    </FormStyles>
  );
}
