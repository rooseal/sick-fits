import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

// import { CURRENT_USER_QUERY } from './User';

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;

const DELETE_CART_ITEM_MUTATION = gql`
  mutation DELETE_CART_ITEM_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCartItem));
}

export default function RemoveFromCart({ id }) {
  const [removeFromCart, { loading }] = useMutation(DELETE_CART_ITEM_MUTATION, {
    variables: { id },
    update,
  });
  return (
    <BigButton
      title="Remove this item from the cart"
      disabled={loading}
      type="button"
      onClick={removeFromCart}
    >
      &times;
    </BigButton>
  );
}

RemoveFromCart.propTypes = {
  id: PropTypes.string.isRequired,
};
