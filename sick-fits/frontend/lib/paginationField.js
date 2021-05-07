import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    read(existing = [], { args, cache }) {
      const { skip, first } = args;

      // Read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);

      if (items.length && items.length !== first && page === pages) {
        return items;
      }

      if (items.length !== first) {
        // We don't have any items, we must go to the network
        return false;
      }

      // If there are any items we return them from the cache
      if (items.length) {
        console.log(
          `There are ${items.length} items in the cache. Sending to apollo.
          Happy days :)`
        );

        return items;
      }

      return false;

      // First thing it does is ask the read function for those items
      // We can do either of 2 things:
      // First thing we can do is return the items from the cache because they are already in the cache
      // The other thing is return false here (it will make a network request for the items)
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // This runs when apollo comes back from the network with our items
      console.log(
        `Merging items from the network to the cache ${incoming.length}`
      );
      const merged = existing ? existing.slice(0) : [];

      for (let i = skip; i < skip + incoming.length; i += 1) {
        merged[i] = incoming[i - skip];
      }

      return merged;
    },
  };
}
