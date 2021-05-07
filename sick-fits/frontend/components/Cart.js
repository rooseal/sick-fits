import PropTypes from 'prop-types';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';
import calcTotalPrice from '../lib/calcTotalPrice';
import { useCart } from '../lib/cartState';

import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import { useUser } from './User';
import RemoveFromCart from './removeFromCart';

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid var(--lightGrey);
  display: grid;
  grid-template-columns: auto 1fr auto;

  img {
    margin-right: 1rem;
  }

  h3,
  p {
    margin: 0;
  }
`;

function CartItem({ cartItem }) {
  const { product } = cartItem;

  return (
    <CartItemStyles>
      <img
        width="100"
        src={product.photo.image.publicUrlTransformed}
        alt={product.photo.altText}
      />
      <div>
        <h3>{product.name}</h3>
        <p>
          {formatMoney(product.price * cartItem.quantity)} -
          <em>
            {cartItem.quantity} &times; {formatMoney(product.price)}
          </em>
        </p>
      </div>
      <RemoveFromCart id={cartItem.id} />
    </CartItemStyles>
  );
}

CartItem.propTypes = {
  cartItem: PropTypes.shape({
    product: PropTypes.object.isRequired,
    quantity: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default function Cart() {
  const me = useUser();
  const { cartOpen, closeCart } = useCart();

  if (!me) return null;

  return (
    <CartStyles open={cartOpen}>
      <header>
        <Supreme>{me.name}'s cart</Supreme>
        <CloseButton type="button" onClick={closeCart}>
          &times;
        </CloseButton>
      </header>
      <ul>
        {me.cart.map((cartItem) => (
          <CartItem key={cartItem.id} cartItem={cartItem} />
        ))}
      </ul>
      <footer>
        <p>{formatMoney(calcTotalPrice(me.cart))}</p>
      </footer>
    </CartStyles>
  );
}
