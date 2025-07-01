import { Product } from '@/constants/data';
import { getProductById } from '@/lib/api/products';
import { notFound } from 'next/navigation';
import ProductForm from './product-form';

type TProductViewPageProps = {
  productId: string;
};

export default async function ProductViewPage({
  productId
}: TProductViewPageProps) {
  let product = null;
  let pageTitle = 'Create New Product';

  if (productId !== 'new') {
    try {
      const data = await getProductById(Number(productId));
      product = data.product as Product;
      if (!product) {
        notFound();
      }
      pageTitle = `Edit Product`;
    } catch (error) {
      notFound();
    }
  }

  return <ProductForm initialData={product} pageTitle={pageTitle} />;
}
