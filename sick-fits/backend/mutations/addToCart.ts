import { KeystoneContext } from '@keystone-next/types';

import { Session } from '../types';

export default async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
) {
  const sess = context.session as Session;
  
  if (!sess.itemId) {
    throw new Error(`You must be logged in to do this`);
  }

  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: sess.itemId }, product: { id: productId } },
    resolveFields: 'id,quantity',
  });

  const [existingCartItem] = allCartItems;

  if (existingCartItem) {
    console.log(`There are already ${existingCartItem.quantity}, increment by 1`);
    
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 }
    });
  }

  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId }}, user: { connect: { id: sess.itemId }}
    }
  });
}
