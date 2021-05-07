import React from 'react';
import { useRouter } from 'next/router';
import Products from '../../components/Products';
import Pagination from '../../components/Pagination';

export default function ProductPage() {
  const { query } = useRouter();
  const page = parseInt(query.page || 1);

  return (
    <div>
      <Pagination page={page} />
      <Products page={page} />
      <Pagination page={page} />
    </div>
  );
}
