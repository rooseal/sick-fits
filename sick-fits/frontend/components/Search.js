/* eslint-disable react/jsx-props-no-spreading */
import { useLazyQuery } from '@apollo/client';
import { resetIdCounter, useCombobox } from 'downshift';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/dist/client/router';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_PRODUCTS_QUERY = gql`
  query SEARCH_PRODUCTS_QUERY($searchTerm: String!) {
    searchTerms: allProducts(
      where: {
        OR: [{ name_contains_i: $searchTerm }, { description: $searchTerm }]
      }
    ) {
      id
      name
      photo {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export default function Search() {
  const router = useRouter();

  const [findItems, { loading, data, error }] = useLazyQuery(
    SEARCH_PRODUCTS_QUERY,
    {
      fetchPolicy: 'no-cache',
    }
  );

  const items = data?.searchTerms || [];

  const findItemsButChill = debounce(findItems, 350);

  // resetIdCounter is a function for downshift to make sure the server side renders the same ids as the client side
  resetIdCounter();

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    highlightedIndex,
    inputValue,
  } = useCombobox({
    items,
    itemToString: (item) => item?.name || '',
    onInputValueChange() {
      findItemsButChill({
        variables: {
          searchTerm: inputValue,
        },
      });
    },
    onSelectedItemChange({ selectedItem }) {
      router.push({
        pathname: `/product/${selectedItem.id}`,
      });
    },
  });

  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: 'search',
            placeholder: 'Search for an item',
            id: 'search',
            className: loading ? 'loading' : '',
          })}
        />
      </div>
      <DropDown {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <DropDownItem
              key={item.id}
              {...getItemProps({ item })}
              highlighted={index === highlightedIndex}
            >
              <img
                src={item.photo.image.publicUrlTransformed}
                alt={item.name}
                width="50px"
              />
              {item.name}
            </DropDownItem>
          ))}
        {isOpen && !items.length && !loading && (
          <DropDownItem>Sorry, no items found for {inputValue}</DropDownItem>
        )}
      </DropDown>
    </SearchStyles>
  );
}
