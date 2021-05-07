import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CartStyleProvider({ children }) {
  // This is our own custom provider
  const [cartOpen, setCartOpen] = useState(false);

  function toggleCart() {
    setCartOpen(!cartOpen);
  }

  function closeCart() {
    setCartOpen(false);
  }

  function openCart() {
    setCartOpen(true);
  }

  return (
    <LocalStateProvider value={{ cartOpen, toggleCart, closeCart, openCart }}>
      {children}
    </LocalStateProvider>
  );
}

CartStyleProvider.propTypes = {
  children: PropTypes.any.isRequired,
};

function useCart() {
  const all = useContext(LocalStateContext);

  return all;
}

export { CartStyleProvider, useCart };
