import { Product } from '@/constants/data';

const API_BASE_URL = '/api/products';

export interface ProductsResponse {
  success: boolean;
  time: string;
  message: string;
  total_products: number;
  offset: number;
  limit: number;
  products: Product[];
}

export interface ProductResponse {
  success: boolean;
  time?: string;
  message: string;
  product?: Product;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  photo_url?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categories?: string[];
}

// Get all products with filtering
export async function getProducts(
  filters: ProductFilters = {}
): Promise<ProductsResponse> {
  const { page = 1, limit = 10, search = '', categories = [] } = filters;

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
    categories: categories.join('.')
  });

  const response = await fetch(`${API_BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
}

// Get a single product by ID
export async function getProductById(id: number): Promise<ProductResponse> {
  const response = await fetch(`${API_BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch product with ID ${id}`);
  }

  return response.json();
}

// Create a new product
export async function createProduct(
  data: CreateProductData
): Promise<ProductResponse> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Failed to create product');
  }

  return response.json();
}

// Update an existing product
export async function updateProduct(
  id: number,
  data: UpdateProductData
): Promise<ProductResponse> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Failed to update product with ID ${id}`);
  }

  return response.json();
}

// Delete a product
export async function deleteProduct(
  id: number
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(`Failed to delete product with ID ${id}`);
  }

  return response.json();
}
